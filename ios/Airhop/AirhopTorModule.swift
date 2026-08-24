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
    func startTor(_ resolve: @escaping RCTPromiseResolveBlock,
                  rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task { @MainActor in
            let manager = AirhopTorManager.shared
            manager.enableAutoStart()
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

    /// Report an app foreground transition, and recover Arti on the way back.
    ///
    /// iOS suspends the process in the background, so Arti's circuits and guard
    /// connections do not survive it, while nothing in the manager re-probes
    /// after the first successful bootstrap. Both edges are needed: the
    /// background one clears the latched readiness, the foreground one restarts
    /// against it. Both are no-ops when Tor was never started, since
    /// ensureRunningOnForeground() gates on auto-start consent.
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

    /// Return the current Tor status synchronously as a JS object.
    @objc
    func getTorStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task { @MainActor in
            let m = AirhopTorManager.shared
            resolve([
                "isReady": m.isReady,
                "isStarting": m.isStarting,
                "port": m.isReady ? m.socksPort : 0,
                "progress": m.bootstrapProgress,
                "bootstrapSummary": m.bootstrapSummary,
            ])
        }
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
    /// A catch-all block is invoked for every notification posted anywhere in
    /// the process - UIKit alone posts keyboard, scene, screen and locale
    /// changes constantly - to filter four of them out. Naming them lets
    /// NotificationCenter do the matching.
    ///
    /// The four are the transitions JS cannot infer. Ready and stall are the
    /// load-bearing pair: without the stall, a bootstrap that ran out its
    /// deadline emits nothing, and JS cannot tell "still forming" from "gave
    /// up" so it keeps claiming onion routing indefinitely.
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
        Task { @MainActor in
            let m = AirhopTorManager.shared
            self.sendEvent(
                withName: AirhopTorModule.torStatusEvent,
                body: [
                    "isReady": m.isReady,
                    "isStarting": m.isStarting,
                    "port": m.isReady ? m.socksPort : 0,
                    "progress": m.bootstrapProgress,
                    "bootstrapSummary": m.bootstrapSummary,
                ]
            )
        }
    }

    deinit {
        let nc = NotificationCenter.default
        for obs in statusObservers { nc.removeObserver(obs) }
    }
}
