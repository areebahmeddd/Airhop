// AirhopTorModule.swift
//
// React Native TurboModule exposing AirhopTorManager to JavaScript.
// This is a separate native module from AirhopBLEModule. Tor and BLE
// are independent concerns and should not share a module boundary.
//
// Bridge file: AirhopTorModule.mm
// TypeScript spec: src/bridge/NativeAirhopTor.ts

import Foundation
import React

@objc(AirhopTorModule)
final class AirhopTorModule: RCTEventEmitter {

    // The single JS event emitted when Tor status changes.
    static let torStatusEvent = "TorStatusChanged"

    private var hasListeners = false
    private var statusObservers: [NSObjectProtocol] = []

    override init() {
        super.init()
        subscribeToTorNotifications()
    }

    override static func requiresMainQueueSetup() -> Bool {
        // Init touches no UI; run on any thread.
        return false
    }

    override func supportedEvents() -> [String]! {
        return [AirhopTorModule.torStatusEvent]
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }

    // MARK: - JS-callable methods

    /// Enable and start Arti. Resolves when the start has been initiated
    /// (not necessarily when bootstrap is complete; use awaitTorReady for that).
    @objc
    func startTor(_ bridgeLines: NSString,
                  resolver resolve: @escaping RCTPromiseResolveBlock,
                  rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task { @MainActor in
            let manager = AirhopTorManager.shared
            manager.enableAutoStart(bridgeLines: bridgeLines as String)
            manager.startIfNeeded()
            resolve(nil)
        }
    }

    /// Stop Arti. Resolves when shutdown has been initiated.
    @objc
    func stopTor(_ resolve: @escaping RCTPromiseResolveBlock,
                 rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task { @MainActor in
            AirhopTorManager.shared.shutdownCompletely()
            resolve(nil)
        }
    }

    /// Stop Arti and destroy its on-disk state. Panic wipe only.
    @objc
    func wipeTorState(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task { @MainActor in
            await AirhopTorManager.shared.wipeState()
            resolve(nil)
        }
    }

    /// iOS suspends the process in the background, so circuits and guard
    /// connections do not survive a long spell there. Both edges are needed: the
    /// background one sleeps Arti, the foreground one wakes it. No-ops when Tor
    /// was never started.
    @objc
    func setAppForeground(_ foreground: Bool,
                          resolver resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task { @MainActor in
            let manager = AirhopTorManager.shared
            manager.setAppForeground(foreground)
            if foreground {
                manager.ensureRunningOnForeground()
            } else {
                manager.goDormantOnBackground()
            }
            resolve(nil)
        }
    }

    /// The status JS sees, read from the native client rather than from the
    /// manager's published copy.
    ///
    /// The manager lowers its own `isReady` on the way to the background without
    /// asking Arti, because whether circuits survived a suspension is not
    /// knowable until it wakes. Reporting that copy lets an ordinary resume read
    /// as a failure, since app-foreground and the JS status re-check fire
    /// un-awaited on the same tick. Kotlin answers from the same source.
    private static func statusPayload() -> [String: Any] {
        let status = ArtiStatus.current
        return [
            "isReady": status.ready,
            // Running, not yet carrying traffic, and not stuck. Blocked is
            // not "starting": the banner has to be able to say the
            // network refused rather than spinning forever.
            "isStarting": status.running && !status.ready && !status.blocked,
            "port": status.ready ? AirhopTorEndpoint.socksPort : 0,
            "progress": status.progress,
            "bootstrapSummary": ArtiStatus.summary,
        ]
    }

    @objc
    func getTorStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(AirhopTorModule.statusPayload())
    }

    /// Block until Arti is bootstrapped and SOCKS-ready (or timeout expires).
    /// Resolves with `true` if ready, `false` on timeout.
    @objc
    func awaitTorReady(_ timeoutSeconds: Double,
                       resolver resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task {
            let ready = await AirhopTorManager.shared.awaitReady(timeout: timeoutSeconds)
            resolve(ready)
        }
    }

    // MARK: - Status event relay

    /// One observer per notification, never `forName: nil`.
    ///
    /// A catch-all is invoked for every notification posted anywhere in the
    /// process, UIKit's keyboard and scene changes included, to filter four out.
    /// Ready and stall are the load-bearing pair: without the stall, JS cannot
    /// tell "still forming" from "gave up".
    private func subscribeToTorNotifications() {
        let nc = NotificationCenter.default
        let names: [Notification.Name] = [
            .AirhopTorWillStart,
            .AirhopTorWillRestart,
            .AirhopTorDidBecomeReady,
            .AirhopTorDidStall,
        ]
        statusObservers = names.map { name in
            nc.addObserver(forName: name, object: nil, queue: nil) { [weak self] _ in
                self?.emitStatus()
            }
        }
    }

    private func emitStatus() {
        guard hasListeners else { return }
        sendEvent(
            withName: AirhopTorModule.torStatusEvent,
            body: AirhopTorModule.statusPayload()
        )
    }

    deinit {
        let nc = NotificationCenter.default
        for obs in statusObservers { nc.removeObserver(obs) }
    }
}
