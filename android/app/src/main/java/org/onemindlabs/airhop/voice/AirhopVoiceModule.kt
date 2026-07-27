// AirhopVoiceModule: live push-to-talk audio for Airhop.
//
// Turns the microphone into a stream of AAC-LC frames and turns a stream of
// AAC-LC frames back into sound. Nothing else: no protocol, no routing, no
// buffering policy. The burst wire format lives in voice-capture.ts and the
// jitter buffer in voice-player.ts, exactly as the BLE and WiFi modules leave
// routing to TypeScript.
//
// Format is fixed by the wire protocol (VoiceBurstCodec.aacLC16kMono = 0x01,
// shared with bitchat): AAC-LC, 16 kHz, mono, 16 kbps, 1024 samples per frame,
// raw frames with no ADTS header. MediaCodec emits exactly that shape, and the
// decoder is handed the matching AudioSpecificConfig directly rather than
// waiting for one on the wire.
//
// Threading contract: every @ReactMethod returns immediately. Capture runs on
// its own thread and playback on another, so a slow encoder, a busy speaker, or
// a mic grabbed by a phone call can never stall the JS thread or the UI.
//
// Events emitted to TypeScript:
//   AirhopVoice.frame         { dataBase64 }
//   AirhopVoice.captureError  { message }
package org.onemindlabs.airhop.voice

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioRecord
import android.media.AudioTrack
import android.media.MediaCodec
import android.media.MediaCodecInfo
import android.media.MediaFormat
import android.media.MediaRecorder
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.nio.ByteBuffer
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.atomic.AtomicBoolean

private const val TAG = "AirhopVoiceModule"

// Events emitted to TypeScript.
private const val EVT_FRAME = "AirhopVoice.frame"
private const val EVT_CAPTURE_ERROR = "AirhopVoice.captureError"

// Codec parameters. Fixed by the wire format; changing any of these changes
// what codec byte 0x01 means and breaks both bitchat and older Airhop builds.
private const val SAMPLE_RATE = 16_000
private const val CHANNELS = 1
private const val BIT_RATE = 16_000
private const val AAC_MIME = MediaFormat.MIMETYPE_AUDIO_AAC

// One AAC-LC frame is 1024 samples; at 16-bit mono that is 2048 bytes of PCM.
// Feeding the encoder exactly this much per input buffer keeps one PCM read
// mapped to one output frame, so frame timing matches the 64 ms the receiver's
// silence-fill assumes for a missing packet.
private const val SAMPLES_PER_FRAME = 1024
private const val PCM_BYTES_PER_FRAME = SAMPLES_PER_FRAME * 2 * CHANNELS

// AudioSpecificConfig for AAC-LC / 16 kHz / mono, the decoder's csd-0:
//   audioObjectType 2 (AAC-LC)      = 00010
//   samplingFrequencyIndex 8 (16k)  = 1000
//   channelConfiguration 1 (mono)   = 0001
//   GASpecificConfig padding        = 000
// packed: 00010_1000_0001_000 -> 0x14 0x08
private val AAC_CSD0 = byteArrayOf(0x14, 0x08)

// How long a codec call may wait for a buffer. Short: these run in a loop on a
// dedicated thread, and a long timeout only delays noticing that the loop was
// asked to stop.
private const val CODEC_TIMEOUT_US = 10_000L

// Cap on frames waiting to be played. At 64 ms a frame this is about two
// seconds of audio; past that the sender is outrunning the speaker and the
// oldest audio is already stale, so drop rather than grow without bound.
private const val MAX_QUEUED_FRAMES = 32

class AirhopVoiceModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AirhopVoice"

    // ---- Capture state -------------------------------------------------------

    private val capturing = AtomicBoolean(false)
    private var captureThread: Thread? = null

    // ---- Playback state ------------------------------------------------------

    private val playing = AtomicBoolean(false)
    private var playbackThread: Thread? = null
    private val frameQueue = LinkedBlockingQueue<ByteArray>()

    private var listenerCount = 0

    // ---- Capture -------------------------------------------------------------

    @ReactMethod
    fun startCapture(promise: Promise) {
        if (capturing.getAndSet(true)) {
            // Already running. Idempotent rather than an error: a double press
            // should not fail a burst that is already live.
            promise.resolve(null)
            return
        }
        val thread = Thread({ runCapture() }, "AirhopVoiceCapture")
        // Audio threads must not be starved by ordinary background work.
        thread.priority = Thread.MAX_PRIORITY
        captureThread = thread
        thread.start()
        promise.resolve(null)
    }

    @ReactMethod
    fun stopCapture(promise: Promise) {
        capturing.set(false)
        // Deliberately not joined: the loop notices the flag within one read
        // (64 ms) and tears itself down. Blocking here would block JS for that
        // long on every release of the mic button.
        captureThread = null
        promise.resolve(null)
    }

    private fun runCapture() {
        var record: AudioRecord? = null
        var encoder: MediaCodec? = null
        try {
            val minBuffer = AudioRecord.getMinBufferSize(
                SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
            )
            if (minBuffer <= 0) {
                failCapture("Microphone does not support 16 kHz mono capture")
                return
            }
            record = AudioRecord(
                // VOICE_COMMUNICATION gets the platform's echo cancellation and
                // noise suppression, which is what makes a walkie-talkie usable
                // on speakerphone.
                MediaRecorder.AudioSource.VOICE_COMMUNICATION,
                SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                maxOf(minBuffer, PCM_BYTES_PER_FRAME * 4),
            )
            if (record.state != AudioRecord.STATE_INITIALIZED) {
                failCapture("Microphone unavailable")
                return
            }

            encoder = MediaCodec.createEncoderByType(AAC_MIME).apply {
                configure(
                    MediaFormat.createAudioFormat(AAC_MIME, SAMPLE_RATE, CHANNELS).apply {
                        setInteger(
                            MediaFormat.KEY_AAC_PROFILE,
                            MediaCodecInfo.CodecProfileLevel.AACObjectLC,
                        )
                        setInteger(MediaFormat.KEY_BIT_RATE, BIT_RATE)
                        setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, PCM_BYTES_PER_FRAME * 2)
                    },
                    null,
                    null,
                    MediaCodec.CONFIGURE_FLAG_ENCODE,
                )
                start()
            }

            record.startRecording()
            val pcm = ByteArray(PCM_BYTES_PER_FRAME)
            val info = MediaCodec.BufferInfo()

            while (capturing.get()) {
                val read = record.read(pcm, 0, pcm.size)
                if (read <= 0) {
                    // A negative result is a real error (mic revoked, device
                    // lost); zero just means nothing was ready yet.
                    if (read < 0) {
                        failCapture("Microphone stopped")
                        return
                    }
                    continue
                }
                feedEncoder(encoder, pcm, read)
                drainEncoder(encoder, info)
            }

            // Flush what the encoder is still holding so the tail of the burst
            // is not lost, then let the END packet follow it.
            feedEndOfStream(encoder)
            drainEncoder(encoder, info)
        } catch (e: Exception) {
            Log.w(TAG, "capture failed", e)
            failCapture(e.message ?: "Recording failed")
        } finally {
            capturing.set(false)
            runCatching { record?.stop() }
            runCatching { record?.release() }
            runCatching { encoder?.stop() }
            runCatching { encoder?.release() }
        }
    }

    private fun feedEncoder(encoder: MediaCodec, pcm: ByteArray, length: Int) {
        val index = encoder.dequeueInputBuffer(CODEC_TIMEOUT_US)
        if (index < 0) return // encoder busy; the next read carries on
        val buffer: ByteBuffer = encoder.getInputBuffer(index) ?: return
        buffer.clear()
        buffer.put(pcm, 0, length)
        encoder.queueInputBuffer(index, 0, length, 0L, 0)
    }

    private fun feedEndOfStream(encoder: MediaCodec) {
        val index = encoder.dequeueInputBuffer(CODEC_TIMEOUT_US)
        if (index < 0) return
        encoder.queueInputBuffer(index, 0, 0, 0L, MediaCodec.BUFFER_FLAG_END_OF_STREAM)
    }

    private fun drainEncoder(encoder: MediaCodec, info: MediaCodec.BufferInfo) {
        while (true) {
            val index = encoder.dequeueOutputBuffer(info, 0)
            if (index < 0) return // no output ready, or a format change we ignore
            val output = encoder.getOutputBuffer(index)
            // The codec-config buffer is the AudioSpecificConfig. Receivers
            // rebuild it from the codec byte, so it never goes on the wire.
            val isConfig = info.flags and MediaCodec.BUFFER_FLAG_CODEC_CONFIG != 0
            if (output != null && info.size > 0 && !isConfig) {
                val frame = ByteArray(info.size)
                output.position(info.offset)
                output.get(frame, 0, info.size)
                emitFrame(frame)
            }
            encoder.releaseOutputBuffer(index, false)
            if (info.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM != 0) return
        }
    }

    // ---- Playback ------------------------------------------------------------

    @ReactMethod
    fun startPlayback(promise: Promise) {
        // One voice at a time: an incoming burst replaces whatever was playing
        // rather than mixing with it.
        stopPlaybackInternal()
        frameQueue.clear()
        playing.set(true)
        val thread = Thread({ runPlayback() }, "AirhopVoicePlayback")
        thread.priority = Thread.MAX_PRIORITY
        playbackThread = thread
        thread.start()
        promise.resolve(null)
    }

    @ReactMethod
    fun enqueueFrames(framesBase64: ReadableArray, promise: Promise) {
        if (!playing.get()) {
            // Frames for a burst that already ended. Dropping is correct: late
            // audio is worthless, which is why there is no retransmit anywhere
            // in this path.
            promise.resolve(null)
            return
        }
        for (i in 0 until framesBase64.size()) {
            val encoded = framesBase64.getString(i) ?: continue
            val frame = runCatching { Base64.decode(encoded, Base64.NO_WRAP) }.getOrNull()
            if (frame == null || frame.isEmpty()) continue
            // Drop the oldest rather than block the bridge when the speaker is
            // behind: the queue holding means the audio in it is already stale.
            while (frameQueue.size >= MAX_QUEUED_FRAMES) frameQueue.poll()
            frameQueue.offer(frame)
        }
        promise.resolve(null)
    }

    @ReactMethod
    fun stopPlayback(promise: Promise) {
        stopPlaybackInternal()
        promise.resolve(null)
    }

    private fun stopPlaybackInternal() {
        playing.set(false)
        // Wake the queue's blocking take so the thread can see the flag and
        // finish. Not joined, for the same reason capture is not.
        frameQueue.offer(ByteArray(0))
        playbackThread = null
    }

    private fun runPlayback() {
        var decoder: MediaCodec? = null
        var track: AudioTrack? = null
        try {
            decoder = MediaCodec.createDecoderByType(AAC_MIME).apply {
                configure(
                    MediaFormat.createAudioFormat(AAC_MIME, SAMPLE_RATE, CHANNELS).apply {
                        setInteger(
                            MediaFormat.KEY_AAC_PROFILE,
                            MediaCodecInfo.CodecProfileLevel.AACObjectLC,
                        )
                        setInteger(MediaFormat.KEY_IS_ADTS, 0)
                        // Handed the config directly: the wire carries raw
                        // frames only, and the codec byte already says what
                        // they are.
                        setByteBuffer("csd-0", ByteBuffer.wrap(AAC_CSD0))
                    },
                    null,
                    null,
                    0,
                )
                start()
            }

            val minBuffer = AudioTrack.getMinBufferSize(
                SAMPLE_RATE,
                AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
            )
            track = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        // VOICE_COMMUNICATION routes to the earpiece/speaker the
                        // way a call does and ducks other apps, which is the
                        // behaviour a walkie-talkie wants.
                        .setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build(),
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(SAMPLE_RATE)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build(),
                )
                .setBufferSizeInBytes(maxOf(minBuffer, PCM_BYTES_PER_FRAME * 4))
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build()
            track.play()

            val info = MediaCodec.BufferInfo()
            while (playing.get()) {
                // Waits rather than spins: a burst with a gap in it should cost
                // nothing while the gap lasts.
                val frame = frameQueue.take()
                if (frame.isEmpty()) continue // wake-up sentinel from stop
                feedDecoder(decoder, frame)
                drainDecoder(decoder, info, track)
            }
        } catch (e: InterruptedException) {
            Thread.currentThread().interrupt()
        } catch (e: Exception) {
            Log.w(TAG, "playback failed", e)
        } finally {
            playing.set(false)
            runCatching { track?.stop() }
            runCatching { track?.release() }
            runCatching { decoder?.stop() }
            runCatching { decoder?.release() }
            frameQueue.clear()
        }
    }

    private fun feedDecoder(decoder: MediaCodec, frame: ByteArray) {
        val index = decoder.dequeueInputBuffer(CODEC_TIMEOUT_US)
        if (index < 0) return
        val buffer = decoder.getInputBuffer(index) ?: return
        buffer.clear()
        buffer.put(frame)
        decoder.queueInputBuffer(index, 0, frame.size, 0L, 0)
    }

    private fun drainDecoder(
        decoder: MediaCodec,
        info: MediaCodec.BufferInfo,
        track: AudioTrack,
    ) {
        while (true) {
            val index = decoder.dequeueOutputBuffer(info, 0)
            if (index < 0) return
            val output = decoder.getOutputBuffer(index)
            if (output != null && info.size > 0) {
                val pcm = ByteArray(info.size)
                output.position(info.offset)
                output.get(pcm, 0, info.size)
                // Blocking write, but on the playback thread only: this is the
                // speaker setting the pace, which is exactly right.
                track.write(pcm, 0, pcm.size)
            }
            decoder.releaseOutputBuffer(index, false)
        }
    }

    // ---- Lifecycle -----------------------------------------------------------

    override fun invalidate() {
        capturing.set(false)
        stopPlaybackInternal()
        super.invalidate()
    }

    @ReactMethod
    fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
        listenerCount++
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenerCount = maxOf(0, listenerCount - count)
    }

    // ---- Events --------------------------------------------------------------

    private fun emitFrame(frame: ByteArray) {
        emitEvent(
            EVT_FRAME,
            WritableNativeMap().apply {
                putString("dataBase64", Base64.encodeToString(frame, Base64.NO_WRAP))
            },
        )
    }

    private fun failCapture(message: String) {
        capturing.set(false)
        emitEvent(EVT_CAPTURE_ERROR, WritableNativeMap().apply { putString("message", message) })
    }

    private fun emitEvent(name: String, params: WritableNativeMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit(name, params)
    }
}
