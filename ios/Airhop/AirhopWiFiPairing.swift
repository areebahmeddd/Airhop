// AirhopWiFiPairing: the system pairing sheet the Wi-Fi Aware transport needs.
//
// iOS ONLY, and a module of its own rather than three more methods on
// AirhopWiFiModule. That contract is the transport, and both platforms
// implement all of it; pairing is a precondition to HAVING links on one
// platform, not a property of a link. Folding it in would make the Kotlin module
// answer three questions that mean nothing there.
//
// Events emitted to TypeScript:
//   AirhopWiFiPairing.devicesChanged { count }
//
// Apple's Wi-Fi Aware has no unpaired mode, and no programmatic pairing: a
// listener or browser may only name devices already in the app's paired list,
// and the only way into that list is a system sheet. It is also two-sided, the
// way Bluetooth pairing is, which is why `presentPairing` takes a mode rather
// than doing something clever. There is no single-tap version of this to build.
//
// The labels this file draws arrive already translated, because no user-facing
// string may be written in native code. The sheet Apple presents carries system
// copy; the screen that launches it is ours.
//
// Unpairing is not here because Apple exposes no API for it, only Settings.

// DevicePicker, DevicePairingView and the `.wifiAware(...)` criteria they take
// come from DeviceDiscoveryUI. WiFiAware only supplies the service types those
// criteria name, so both imports are load-bearing.
import DeviceDiscoveryUI
import Foundation
import React
import SwiftUI
import UIKit
import WiFiAware

private enum PairingEvent {
    static let devicesChanged = "AirhopWiFiPairing.devicesChanged"
}

// MARK: - SwiftUI hosts

/// The browse half: look for a nearby phone that has made itself discoverable.
///
/// `DevicePicker` presents the system sheet when its label is tapped and cannot
/// be triggered in code, so the label has to be on screen. Drawn as the whole
/// content area rather than a button, so the tap target is the screen.
@available(iOS 26.0, *)
private struct PairingPickerScreen: View {
    let service: WASubscribableService
    let actionLabel: String
    let cancelLabel: String
    let unavailableLabel: String
    let onFinish: () -> Void

    var body: some View {
        PairingChrome(cancelLabel: cancelLabel, onCancel: onFinish) {
            DevicePicker(.wifiAware(.connecting(to: .userSpecifiedDevices, from: service))) { _ in
                // The endpoint is not kept. Pairing is the whole point of this
                // screen: once the device is in the paired list the transport's
                // own browser finds it, and a connection opened here would be
                // one the link registry never learned about.
                onFinish()
            } label: {
                PairingPrompt(text: actionLabel)
            } fallback: {
                PairingPrompt(text: unavailableLabel)
            }
        }
    }
}

/// The advertise half: become discoverable so the other phone can find this one.
///
/// `DevicePairingView` has no completion of its own, so the user dismisses this
/// screen when they are done and the watcher below is what learns the result.
@available(iOS 26.0, *)
private struct PairingListenerScreen: View {
    let service: WAPublishableService
    let actionLabel: String
    let cancelLabel: String
    let unavailableLabel: String
    let onFinish: () -> Void

    var body: some View {
        PairingChrome(cancelLabel: cancelLabel, onCancel: onFinish) {
            DevicePairingView(.wifiAware(.connecting(to: service, from: .userSpecifiedDevices))) {
                PairingPrompt(text: actionLabel)
            } fallback: {
                PairingPrompt(text: unavailableLabel)
            }
        }
    }
}

/// Shared frame: the control in the middle, one dismissal at the bottom.
@available(iOS 26.0, *)
private struct PairingChrome<Content: View>: View {
    let cancelLabel: String
    let onCancel: () -> Void
    @ViewBuilder let content: Content

    var body: some View {
        VStack(spacing: 0) {
            Spacer()
            content
            Spacer()
            Button(cancelLabel, action: onCancel)
                .padding(.bottom, 32)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

@available(iOS 26.0, *)
private struct PairingPrompt: View {
    let text: String

    var body: some View {
        Text(text)
            .multilineTextAlignment(.center)
            .padding(24)
            .frame(maxWidth: .infinity)
    }
}

// MARK: - Module

@objc(AirhopWiFiPairing)
final class AirhopWiFiPairing: RCTEventEmitter {

    /// How many devices this app is paired with.
    ///
    /// Read synchronously by AirhopWiFiModule's `startWiFi`, which refuses to
    /// attach when it is zero. Cached rather than queried because
    /// `WAPairedDevice.allDevices` is an async sequence and that guard runs on
    /// the bridge queue.
    ///
    /// Zero until the watcher's first value, which is correct rather than
    /// conservative: attaching before the list is known would run a radio for
    /// devices we have not confirmed exist.
    private(set) static var pairedDeviceCount = 0

    private var watchTask: Task<Void, Never>?
    /// Held so a second `presentPairing` while one is on screen resolves rather
    /// than stacking a second sheet over the first.
    private var presented: UIViewController?

    @objc override static func requiresMainQueueSetup() -> Bool { false }

    override func supportedEvents() -> [String]! { [PairingEvent.devicesChanged] }

    override init() {
        super.init()
        startWatching()
    }

    // MARK: Watching the paired list

    /// Track the paired-device list for the life of the module.
    ///
    /// The only thing that changes `pairedDeviceCount`, and the only signal for
    /// a pairing removed in the Settings app: without it the transport would
    /// keep a listener running for a device that is gone.
    private func startWatching() {
        guard #available(iOS 26.0, *) else { return }
        watchPairedDevices()
    }

    @available(iOS 26.0, *)
    private func watchPairedDevices() {
        watchTask?.cancel()
        watchTask = Task { [weak self] in
            do {
                for try await devices in WAPairedDevice.allDevices {
                    guard !Task.isCancelled else { return }
                    await self?.publish(count: devices.count)
                }
            } catch {
                // The sequence ends when the framework is unavailable, which on
                // a device with no Wi-Fi Aware is its permanent state. Nothing
                // to retry: the count stays zero, `startWiFi` keeps refusing,
                // and the JS controller reports it once and stops asking.
            }
        }
    }

    @MainActor
    private func publish(count: Int) {
        guard AirhopWiFiPairing.pairedDeviceCount != count else { return }
        AirhopWiFiPairing.pairedDeviceCount = count
        guard bridge != nil else { return }
        sendEvent(withName: PairingEvent.devicesChanged, body: ["count": count])
    }

    // MARK: Exported

    /// Everything JS needs about pairing, in one answer.
    ///
    /// One call rather than three, matching `getRadioState` on the BLE side: the
    /// three facts are read together on every refresh, and separate calls could
    /// return a set of answers that never existed at one moment.
    @objc(getPairingState:rejecter:)
    func getPairingState(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard #available(iOS 26.0, *) else {
            resolve(["supported": false, "count": 0])
            return
        }
        resolve(Self.pairingState())
    }

    /// The same question AirhopWiFiModule asks before attaching, so the settings
    /// screen and the transport cannot disagree about whether this device has
    /// the hardware and the declaration to use it.
    @available(iOS 26.0, *)
    private static func pairingState() -> [String: Any] {
        [
            "supported": !WACapabilities.supportedFeatures.isEmpty
                && WAPublishableService.allServices[WiFiConst.serviceName] != nil,
            "count": AirhopWiFiPairing.pairedDeviceCount,
        ]
    }

    /// Show the pairing sheet. `mode` is "find" to browse, or "discoverable" to
    /// advertise.
    ///
    /// Resolves when the screen is dismissed, whether or not anything was
    /// paired: the result comes from the watcher, so there is nothing truthful
    /// to resolve with.
    @objc(presentPairing:actionLabel:cancelLabel:unavailableLabel:resolver:rejecter:)
    func presentPairing(
        mode: String,
        actionLabel: String,
        cancelLabel: String,
        unavailableLabel: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard #available(iOS 26.0, *) else {
            reject("WIFI_AWARE_UNSUPPORTED", "Wi-Fi Aware needs iOS 26 or later", nil)
            return
        }
        present(
            mode: mode,
            actionLabel: actionLabel,
            cancelLabel: cancelLabel,
            unavailableLabel: unavailableLabel,
            resolve: resolve,
            reject: reject
        )
    }

    /// `#available` narrows the scope it guards but does not reliably carry into
    /// an escaping closure, and everything here runs inside one dispatched to the
    /// main queue. An annotated method gives that closure a context of its own.
    @available(iOS 26.0, *)
    private func present(
        mode: String,
        actionLabel: String,
        cancelLabel: String,
        unavailableLabel: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            guard self.presented == nil else {
                // Already showing. Resolving rather than rejecting: a double tap
                // is not an error, and the sheet the user is looking at is the
                // one they asked for.
                resolve(nil)
                return
            }
            guard let host = Self.topViewController() else {
                reject("NO_PRESENTER", "No view controller to present from", nil)
                return
            }
            guard
                let publishable = WAPublishableService.allServices[WiFiConst.serviceName],
                let subscribable = WASubscribableService.allServices[WiFiConst.serviceName]
            else {
                reject(
                    "WIFI_AWARE_UNSUPPORTED",
                    "Wi-Fi Aware service \(WiFiConst.serviceName) is not declared",
                    nil
                )
                return
            }

            var controller: UIViewController?
            let finish: () -> Void = { [weak self] in
                controller?.dismiss(animated: true)
                self?.presented = nil
                resolve(nil)
            }

            let hosted: UIViewController =
                mode == "discoverable"
                ? UIHostingController(
                    rootView: PairingListenerScreen(
                        service: publishable,
                        actionLabel: actionLabel,
                        cancelLabel: cancelLabel,
                        unavailableLabel: unavailableLabel,
                        onFinish: finish
                    )
                )
                : UIHostingController(
                    rootView: PairingPickerScreen(
                        service: subscribable,
                        actionLabel: actionLabel,
                        cancelLabel: cancelLabel,
                        unavailableLabel: unavailableLabel,
                        onFinish: finish
                    )
                )
            controller = hosted
            self.presented = hosted
            // A card the user can pull down, so the screen is dismissible even
            // if the control inside it never becomes usable.
            hosted.modalPresentationStyle = .formSheet
            host.present(hosted, animated: true)
        }
    }

    // MARK: Presentation

    /// The controller currently on screen, which is what a modal has to be
    /// presented from.
    ///
    /// Walked from the key window rather than taken from
    /// `RCTPresentedViewController`, so this file needs nothing in the bridging
    /// header and a screen Airhop has itself presented is found rather than
    /// presented over.
    ///
    /// Not `@MainActor` despite touching UIKit: the one caller is already inside
    /// a `DispatchQueue.main.async`, which the compiler cannot see as main-actor
    /// isolation, so annotating it would make that call unrepresentable.
    private static func topViewController() -> UIViewController? {
        let scene = UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .first { $0.activationState == .foregroundActive }
        guard
            let root = (scene?.keyWindow ?? scene?.windows.first)?.rootViewController
        else { return nil }
        var top = root
        while let next = top.presentedViewController { top = next }
        return top
    }

    // MARK: Lifecycle

    override func invalidate() {
        watchTask?.cancel()
        watchTask = nil
        DispatchQueue.main.async { [presented] in
            presented?.dismiss(animated: false)
        }
        presented = nil
        super.invalidate()
    }
}
