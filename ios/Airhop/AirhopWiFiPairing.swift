// AirhopWiFiPairing: the system pairing sheet the Wi-Fi Aware transport needs.
//
// iOS ONLY, and a module of its own rather than more methods on
// AirhopWiFiModule: that contract is the transport, which both platforms
// implement in full, and pairing is a precondition to HAVING links here rather
// than a property of a link.
//
// Events emitted to TypeScript:
//   AirhopWiFiPairing.devicesChanged { count }
//
// Apple's Wi-Fi Aware has no unpaired mode and no programmatic pairing: a
// listener or browser may only name devices already in the app's paired list,
// and the only way in is a system sheet. It is two-sided the way Bluetooth
// pairing is, which is why `presentPairing` takes a mode.
//
// Labels and palette both arrive from TypeScript: native owns no user-facing
// string and no visual value.
//
// Unpairing is absent because Apple exposes no API for it, only Settings.

// DevicePicker and DevicePairingView come from DeviceDiscoveryUI; WiFiAware
// supplies the service types their criteria name. Both imports are load-bearing.
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

/// The palette, from services/wifi-pairing-service.ts. `src/ui/theme.ts` is the
/// one source: a second copy here would drift the first time a token moved.
/// Defaults only keep a malformed payload legible.
private struct PairingTheme {
    let bg: Color
    let surface: Color
    let border: Color
    let textPrimary: Color
    let textMuted: Color

    init(_ raw: [String: Any]) {
        bg = Color(hex: raw["bg"] as? String, fallback: .init(white: 0.97))
        surface = Color(hex: raw["surface"] as? String, fallback: .white)
        border = Color(hex: raw["border"] as? String, fallback: .init(white: 0.89))
        textPrimary = Color(hex: raw["textPrimary"] as? String, fallback: .black)
        textMuted = Color(hex: raw["textMuted"] as? String, fallback: .gray)
    }
}

private extension Color {
    /// `#RRGGBB`, the only form theme.ts writes.
    init(hex: String?, fallback: Color) {
        guard let hex, hex.hasPrefix("#"), hex.count == 7,
            let value = UInt32(hex.dropFirst(), radix: 16)
        else {
            self = fallback
            return
        }
        self = Color(
            red: Double((value >> 16) & 0xff) / 255,
            green: Double((value >> 8) & 0xff) / 255,
            blue: Double(value & 0xff) / 255
        )
    }
}

/// The browse half. `DevicePicker` presents the system sheet when its label is
/// tapped and cannot be triggered in code, so the label has to be on screen.
@available(iOS 26.0, *)
private struct PairingPickerScreen: View {
    let service: WASubscribableService
    let labels: PairingLabels
    let theme: PairingTheme
    let onFinish: () -> Void

    var body: some View {
        PairingChrome(labels: labels, theme: theme, onCancel: onFinish) {
            DevicePicker(.wifiAware(.connecting(to: .userSpecifiedDevices, from: service))) { _ in
                // The endpoint is dropped: pairing is the point, and the
                // transport's own browser finds the device from here on. A
                // connection opened here would be one the registry never saw.
                onFinish()
            } label: {
                PairingCard(text: labels.action, theme: theme)
            } fallback: {
                PairingCard(text: labels.unavailable, theme: theme)
            }
        }
    }
}

/// The advertise half. `DevicePairingView` has no completion of its own, so the
/// user dismisses this and the watcher below is what learns the result.
@available(iOS 26.0, *)
private struct PairingListenerScreen: View {
    let service: WAPublishableService
    let labels: PairingLabels
    let theme: PairingTheme
    let onFinish: () -> Void

    var body: some View {
        PairingChrome(labels: labels, theme: theme, onCancel: onFinish) {
            DevicePairingView(.wifiAware(.connecting(to: service, from: .userSpecifiedDevices))) {
                PairingCard(text: labels.action, theme: theme)
            } fallback: {
                PairingCard(text: labels.unavailable, theme: theme)
            }
        }
    }
}

/// Shared frame. `textPrimary` on the dismiss rather than `textMuted`, which on
/// a filled surface reads as disabled rather than as the quieter choice.
@available(iOS 26.0, *)
private struct PairingChrome<Content: View>: View {
    let labels: PairingLabels
    let theme: PairingTheme
    let onCancel: () -> Void
    @ViewBuilder let content: Content

    var body: some View {
        VStack(spacing: 0) {
            Spacer()
            content
                .padding(.horizontal, 16)
            Spacer()
            Button(action: onCancel) {
                Text(labels.cancel)
                    .font(.system(size: 17, weight: .medium))
                    .foregroundStyle(theme.textPrimary)
            }
            .padding(.bottom, 32)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(theme.bg)
    }
}

/// The tappable label, drawn as a settings card so the shape is familiar.
@available(iOS 26.0, *)
private struct PairingCard: View {
    let text: String
    let theme: PairingTheme

    var body: some View {
        Text(text)
            .font(.system(size: 17, weight: .medium))
            .foregroundStyle(theme.textPrimary)
            .multilineTextAlignment(.center)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 24)
            .padding(.horizontal, 16)
            .background(
                RoundedRectangle(cornerRadius: 14)
                    .fill(theme.surface)
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(theme.border, lineWidth: 1)
                    )
            )
    }
}

/// Already translated. Native decides none of it.
private struct PairingLabels {
    let action: String
    let cancel: String
    let unavailable: String

    init(_ raw: [String: Any]) {
        action = raw["action"] as? String ?? ""
        cancel = raw["cancel"] as? String ?? ""
        unavailable = raw["unavailable"] as? String ?? ""
    }
}

// MARK: - Module

@objc(AirhopWiFiPairing)
final class AirhopWiFiPairing: RCTEventEmitter {

    /// How many devices this app is paired with.
    ///
    /// Read synchronously by the transport's `start`, which refuses to attach on
    /// zero. Cached because `WAPairedDevice.allDevices` is an async sequence and
    /// that guard runs on the bridge queue. Zero until the watcher's first value,
    /// which is correct: attaching earlier would run a radio for devices we have
    /// not confirmed exist.
    private(set) static var pairedDeviceCount = 0

    private var watchTask: Task<Void, Never>?
    /// Held so a second `presentPairing` while one is on screen resolves rather
    /// than stacking a second sheet over the first.
    private var presented: UIViewController?
    /// The Cancel button's teardown, kept so a swipe can run it too. A
    /// `formSheet` is pull-dismissible, and without this the guard above stayed
    /// armed against a screen already gone: every later tap did nothing.
    private var onDismiss: (() -> Void)?

    @objc override static func requiresMainQueueSetup() -> Bool { false }

    override func supportedEvents() -> [String]! { [PairingEvent.devicesChanged] }

    override init() {
        super.init()
        startWatching()
    }

    // MARK: Watching the paired list

    /// The only thing that changes `pairedDeviceCount`, and the only signal for
    /// a pairing removed in the Settings app.
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
                // Ends when the framework is unavailable, which on a device
                // without Wi-Fi Aware is permanent. The count stays zero and the
                // controller reports it once.
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

    /// One call rather than two, matching `getRadioState` on the BLE side:
    /// separate calls could return answers that never held at one moment.
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

    /// The same question the transport asks before attaching, so the screen and
    /// it cannot disagree about this device.
    @available(iOS 26.0, *)
    private static func pairingState() -> [String: Any] {
        [
            "supported": !WACapabilities.supportedFeatures.isEmpty
                && WAPublishableService.allServices[WiFiConst.serviceName] != nil,
            "count": AirhopWiFiPairing.pairedDeviceCount,
        ]
    }

    /// `mode` is "find" to browse, or "discoverable" to advertise. Resolves on
    /// dismissal either way: the result comes from the watcher, so there is
    /// nothing truthful to resolve with.
    @objc(presentPairing:labels:colors:resolver:rejecter:)
    func presentPairing(
        mode: String,
        labels: NSDictionary,
        colors: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard #available(iOS 26.0, *) else {
            reject("WIFI_AWARE_UNSUPPORTED", "Wi-Fi Aware needs iOS 26 or later", nil)
            return
        }
        present(
            mode: mode,
            labels: PairingLabels(labels as? [String: Any] ?? [:]),
            theme: PairingTheme(colors as? [String: Any] ?? [:]),
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
        labels: PairingLabels,
        theme: PairingTheme,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            guard self.presented == nil else {
                // Resolving rather than rejecting: a double tap is not an error,
                // and the sheet on screen is the one they asked for.
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
            // Idempotent: Cancel, the picker's completion and a swipe all reach
            // it, and resolving a promise twice traps.
            let finish: () -> Void = { [weak self] in
                guard let self, self.presented != nil else { return }
                self.presented = nil
                self.onDismiss = nil
                controller?.dismiss(animated: true)
                resolve(nil)
            }

            let hosted: UIViewController =
                mode == "discoverable"
                ? UIHostingController(
                    rootView: PairingListenerScreen(
                        service: publishable,
                        labels: labels,
                        theme: theme,
                        onFinish: finish
                    )
                )
                : UIHostingController(
                    rootView: PairingPickerScreen(
                        service: subscribable,
                        labels: labels,
                        theme: theme,
                        onFinish: finish
                    )
                )
            controller = hosted
            self.presented = hosted
            self.onDismiss = finish
            // Pull-dismissible, so the screen closes even if the control inside
            // never becomes usable. UIKit holds the delegate weakly.
            hosted.modalPresentationStyle = .formSheet
            hosted.presentationController?.delegate = self
            host.present(hosted, animated: true)
        }
    }

    // MARK: Presentation

    /// Walked from the key window rather than `RCTPresentedViewController`, so
    /// this file needs nothing in the bridging header and a screen Airhop has
    /// itself presented is found rather than presented over.
    ///
    /// Not `@MainActor` despite touching UIKit: the one caller is already inside
    /// a `DispatchQueue.main.async`, which the compiler cannot see as isolation.
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

// MARK: - Dismissal

/// The one dismissal UIKit reports rather than routing through our own button.
extension AirhopWiFiPairing: UIAdaptivePresentationControllerDelegate {
    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
        onDismiss?()
    }
}
