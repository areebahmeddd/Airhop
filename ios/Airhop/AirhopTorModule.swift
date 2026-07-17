// AirhopTorModule.swift
//
// React Native TurboModule exposing AirhopTorManager to JavaScript.
// This is a separate native module from AirhopBLEModule — Tor and BLE
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
    private var statusObserver: NSObjectProtocol?

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
    /// (not necessarily when bootstrap is complete — use awaitTorReady for that).
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

    private func subscribeToTorNotifications() {
        let nc = NotificationCenter.default
        statusObserver = nc.addObserver(
            forName: nil,
            object: nil,
            queue: nil
        ) { [weak self] notification in
            guard let self else { return }
            let relevant: Set<Notification.Name> = [
                .AirhopTorWillStart,
                .AirhopTorWillRestart,
                .AirhopTorDidBecomeReady,
            ]
            guard relevant.contains(notification.name) else { return }
            guard self.hasListeners else { return }

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
    }

    deinit {
        if let obs = statusObserver {
            NotificationCenter.default.removeObserver(obs)
        }
    }
}
