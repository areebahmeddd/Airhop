// AirhopVoiceModule: live push-to-talk audio for Airhop.
//
// iOS counterpart of AirhopVoiceModule.kt, with the same contract: the mic
// becomes a stream of AAC-LC frames, and a stream of AAC-LC frames becomes
// sound. No protocol, no routing, no buffering policy — those live in
// voice-capture.ts, flood-router.ts, and voice-player.ts respectively.
//
// Format is fixed by the wire protocol (VoiceBurstCodec.aacLC16kMono = 0x01,
// shared with bitchat): AAC-LC, 16 kHz, mono, 16 kbps, 1024 samples per frame,
// raw frames with no ADTS header. AVAudioConverter produces exactly that.
//
// Threading contract: every exported method returns immediately. Capture runs
// on the audio engine's own render thread and playback on an AVAudioPlayerNode,
// so neither the JS thread nor the UI can be stalled by audio work.
//
// Events emitted to TypeScript:
//   AirhopVoice.frame         { dataBase64 }
//   AirhopVoice.captureError  { message }
import AVFoundation
import Foundation
import React

// MARK: - Constants

private enum VoiceConst {
    // Fixed by the wire format; changing any of these changes what codec byte
    // 0x01 means and breaks both bitchat and older Airhop builds.
    static let sampleRate: Double = 16_000
    static let channels: AVAudioChannelCount = 1
    static let bitRate = 16_000
    // One AAC-LC frame is 1024 samples: 64 ms at 16 kHz, which is the gap the
    // receiver fills with silence when a packet goes missing.
    static let samplesPerFrame: AVAudioFrameCount = 1024
    // Generous ceiling for one encoded frame; ~130 bytes is typical at 16 kbps.
    static let maxEncodedFrameBytes = 1024
    // About two seconds of audio. Past that the sender is outrunning the
    // speaker and the oldest audio is already stale.
    static let maxQueuedFrames = 32
}

private enum VoiceEvent {
    static let frame = "AirhopVoice.frame"
    static let captureError = "AirhopVoice.captureError"
}

// MARK: - Module

@objc(AirhopVoiceModule)
final class AirhopVoiceModule: RCTEventEmitter {

    // MARK: Capture state

    private let captureEngine = AVAudioEngine()
    private var captureConverter: AVAudioConverter?
    private var isCapturing = false
    // Serialises capture setup/teardown against the render thread's tap.
    private let captureQueue = DispatchQueue(label: "org.onemindlabs.airhop.voice.capture")

    // MARK: Playback state

    private let playbackEngine = AVAudioEngine()
    private let playerNode = AVAudioPlayerNode()
    private var playbackConverter: AVAudioConverter?
    private var isPlaying = false
    private var queuedFrames = 0
    private let playbackQueue = DispatchQueue(label: "org.onemindlabs.airhop.voice.playback")

    // MARK: RN boilerplate

    @objc override static func requiresMainQueueSetup() -> Bool { false }

    override func supportedEvents() -> [String]! {
        [VoiceEvent.frame, VoiceEvent.captureError]
    }

    // MARK: - Formats

    /// PCM the converters work in: 16 kHz mono float, the engine's native shape.
    private var pcmFormat: AVAudioFormat? {
        AVAudioFormat(
            commonFormat: .pcmFormatFloat32,
            sampleRate: VoiceConst.sampleRate,
            channels: VoiceConst.channels,
            interleaved: false
        )
    }

    /// The compressed format on both sides of the link.
    private var aacFormat: AVAudioFormat? {
        var desc = AudioStreamBasicDescription(
            mSampleRate: VoiceConst.sampleRate,
            mFormatID: kAudioFormatMPEG4AAC,
            mFormatFlags: 0,
            mBytesPerPacket: 0,
            mFramesPerPacket: VoiceConst.samplesPerFrame,
            mBytesPerFrame: 0,
            mChannelsPerFrame: VoiceConst.channels,
            mBitsPerChannel: 0,
            mReserved: 0
        )
        return AVAudioFormat(streamDescription: &desc)
    }

    // MARK: - Capture

    @objc func startCapture(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        captureQueue.async { [weak self] in
            guard let self else { return }
            if self.isCapturing {
                // Idempotent: a double press should not fail a live burst.
                resolve(nil)
                return
            }
            do {
                try self.configureSession()
                try self.beginCapture()
                self.isCapturing = true
                resolve(nil)
            } catch {
                self.isCapturing = false
                self.teardownCapture()
                reject("VOICE_CAPTURE", error.localizedDescription, error)
            }
        }
    }

    @objc func stopCapture(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        captureQueue.async { [weak self] in
            self?.teardownCapture()
            resolve(nil)
        }
    }

    /// Play-and-record with speaker default and ducking, matching the walkie
    /// behaviour the design asks for: other audio dips rather than stops.
    private func configureSession() throws {
        let session = AVAudioSession.sharedInstance()
        try session.setCategory(
            .playAndRecord,
            mode: .voiceChat,
            options: [.duckOthers, .defaultToSpeaker, .allowBluetooth]
        )
        try session.setActive(true, options: [])
    }

    private func beginCapture() throws {
        guard let pcmFormat, let aacFormat else {
            throw VoiceError.format("Unsupported audio format")
        }
        let input = captureEngine.inputNode
        let inputFormat = input.outputFormat(forBus: 0)
        guard inputFormat.sampleRate > 0 else {
            throw VoiceError.format("Microphone unavailable")
        }

        // Two stages: whatever the hardware gives us down to 16 kHz mono, then
        // 16 kHz mono to AAC. AVAudioConverter handles the rate conversion, so
        // this works on hardware that only offers 44.1 or 48 kHz.
        guard let toPCM = AVAudioConverter(from: inputFormat, to: pcmFormat),
              let toAAC = AVAudioConverter(from: pcmFormat, to: aacFormat)
        else {
            throw VoiceError.format("Cannot convert microphone audio")
        }
        toAAC.bitRate = VoiceConst.bitRate
        captureConverter = toAAC

        input.installTap(
            onBus: 0,
            bufferSize: 2048,
            format: inputFormat
        ) { [weak self] buffer, _ in
            self?.handleCapturedBuffer(buffer, toPCM: toPCM, toAAC: toAAC, pcmFormat: pcmFormat)
        }

        captureEngine.prepare()
        try captureEngine.start()
    }

    /// Runs on the audio render thread. Must not allocate more than necessary
    /// and must never block: anything slow here is heard as a dropout.
    private func handleCapturedBuffer(
        _ buffer: AVAudioPCMBuffer,
        toPCM: AVAudioConverter,
        toAAC: AVAudioConverter,
        pcmFormat: AVAudioFormat
    ) {
        guard isCapturing else { return }

        // Resample to 16 kHz mono.
        let ratio = pcmFormat.sampleRate / buffer.format.sampleRate
        let capacity = AVAudioFrameCount(Double(buffer.frameLength) * ratio) + 1024
        guard let pcm = AVAudioPCMBuffer(pcmFormat: pcmFormat, frameCapacity: capacity) else { return }
        var supplied = false
        var error: NSError?
        toPCM.convert(to: pcm, error: &error) { _, status in
            if supplied {
                status.pointee = .noDataNow
                return nil
            }
            supplied = true
            status.pointee = .haveData
            return buffer
        }
        if error != nil || pcm.frameLength == 0 { return }

        // Encode to AAC. The converter emits one packet per 1024 samples, so a
        // buffer that is not a whole number of frames simply carries the
        // remainder into the next call.
        guard let compressed = AVAudioCompressedBuffer(
            format: toAAC.outputFormat,
            packetCapacity: 8,
            maximumPacketSize: VoiceConst.maxEncodedFrameBytes
        ) else { return }

        var pcmSupplied = false
        var encodeError: NSError?
        toAAC.convert(to: compressed, error: &encodeError) { _, status in
            if pcmSupplied {
                status.pointee = .noDataNow
                return nil
            }
            pcmSupplied = true
            status.pointee = .haveData
            return pcm
        }
        if encodeError != nil || compressed.packetCount == 0 { return }

        emitPackets(from: compressed)
    }

    /// Splits a compressed buffer into its individual AAC packets and sends each
    /// one up as a frame. One packet is one 64 ms frame, which is what the burst
    /// packetizer expects.
    private func emitPackets(from buffer: AVAudioCompressedBuffer) {
        guard let descriptions = buffer.packetDescriptions else {
            // No descriptions means a single packet filling the buffer.
            let data = Data(bytes: buffer.data, count: Int(buffer.byteLength))
            if !data.isEmpty { emitFrame(data) }
            return
        }
        let base = buffer.data.assumingMemoryBound(to: UInt8.self)
        for i in 0..<Int(buffer.packetCount) {
            let description = descriptions[i]
            let offset = Int(description.mStartOffset)
            let size = Int(description.mDataByteSize)
            guard size > 0, offset >= 0 else { continue }
            let data = Data(bytes: base.advanced(by: offset), count: size)
            emitFrame(data)
        }
    }

    private func teardownCapture() {
        isCapturing = false
        if captureEngine.isRunning { captureEngine.stop() }
        captureEngine.inputNode.removeTap(onBus: 0)
        captureConverter = nil
    }

    // MARK: - Playback

    @objc func startPlayback(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        playbackQueue.async { [weak self] in
            guard let self else { return }
            // One voice at a time: an incoming burst replaces whatever was
            // playing rather than mixing with it.
            self.teardownPlayback()
            do {
                try self.configureSession()
                try self.beginPlayback()
                self.isPlaying = true
                resolve(nil)
            } catch {
                self.teardownPlayback()
                reject("VOICE_PLAYBACK", error.localizedDescription, error)
            }
        }
    }

    @objc func enqueueFrames(
        _ framesBase64: [String],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        playbackQueue.async { [weak self] in
            guard let self else { return }
            // Frames for a burst that already ended. Dropping is correct: late
            // audio is worthless, which is why nothing in this path retransmits.
            guard self.isPlaying else {
                resolve(nil)
                return
            }
            for encoded in framesBase64 {
                guard let frame = Data(base64Encoded: encoded), !frame.isEmpty else { continue }
                // Behind the speaker means the queued audio is already stale.
                if self.queuedFrames >= VoiceConst.maxQueuedFrames { continue }
                self.schedule(frame)
            }
            resolve(nil)
        }
    }

    @objc func stopPlayback(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        playbackQueue.async { [weak self] in
            self?.teardownPlayback()
            resolve(nil)
        }
    }

    private func beginPlayback() throws {
        guard let pcmFormat, let aacFormat else {
            throw VoiceError.format("Unsupported audio format")
        }
        guard let converter = AVAudioConverter(from: aacFormat, to: pcmFormat) else {
            throw VoiceError.format("Cannot decode voice audio")
        }
        playbackConverter = converter

        if playerNode.engine == nil {
            playbackEngine.attach(playerNode)
        }
        playbackEngine.connect(playerNode, to: playbackEngine.mainMixerNode, format: pcmFormat)
        playbackEngine.prepare()
        try playbackEngine.start()
        playerNode.play()
        queuedFrames = 0
    }

    /// Decode one AAC frame and hand the PCM to the player node. The node owns
    /// the pacing: frames play back to back in the order they were scheduled.
    private func schedule(_ frame: Data) {
        guard let converter = playbackConverter,
              let pcmFormat,
              let aacFormat
        else { return }

        guard let compressed = AVAudioCompressedBuffer(
            format: aacFormat,
            packetCapacity: 1,
            maximumPacketSize: frame.count
        ) else { return }
        compressed.byteLength = UInt32(frame.count)
        compressed.packetCount = 1
        frame.withUnsafeBytes { raw in
            guard let base = raw.baseAddress else { return }
            compressed.data.copyMemory(from: base, byteCount: frame.count)
        }
        compressed.packetDescriptions?.pointee = AudioStreamPacketDescription(
            mStartOffset: 0,
            mVariableFramesInPacket: 0,
            mDataByteSize: UInt32(frame.count)
        )

        guard let pcm = AVAudioPCMBuffer(
            pcmFormat: pcmFormat,
            frameCapacity: VoiceConst.samplesPerFrame
        ) else { return }

        var supplied = false
        var error: NSError?
        converter.convert(to: pcm, error: &error) { _, status in
            if supplied {
                status.pointee = .noDataNow
                return nil
            }
            supplied = true
            status.pointee = .haveData
            return compressed
        }
        guard error == nil, pcm.frameLength > 0 else { return }

        queuedFrames += 1
        playerNode.scheduleBuffer(pcm) { [weak self] in
            guard let self else { return }
            self.playbackQueue.async { self.queuedFrames = max(0, self.queuedFrames - 1) }
        }
    }

    private func teardownPlayback() {
        isPlaying = false
        queuedFrames = 0
        if playerNode.engine != nil { playerNode.stop() }
        if playbackEngine.isRunning { playbackEngine.stop() }
        playbackConverter = nil
    }

    // MARK: - Lifecycle

    override func invalidate() {
        captureQueue.sync { teardownCapture() }
        playbackQueue.sync { teardownPlayback() }
        super.invalidate()
    }

    // MARK: - Events

    private func emitFrame(_ frame: Data) {
        guard bridge != nil else { return }
        sendEvent(withName: VoiceEvent.frame, body: ["dataBase64": frame.base64EncodedString()])
    }
}

// MARK: - Errors

private enum VoiceError: LocalizedError {
    case format(String)

    var errorDescription: String? {
        switch self {
        case .format(let message): return message
        }
    }
}
