// AirhopMCModule: MultipeerConnectivity high-bandwidth transport for Airhop.
//
// Uses Apple's MultipeerConnectivity framework for peer-to-peer data exchange
// between nearby iOS devices. Provides 30–100 Mbps throughput without internet
// or a Wi-Fi router; replaces BLE for video, large files, and HD voice.
//
// Architecture contract: no protocol or routing logic here. Raw bytes only.
// TypeScript (src/core/router/message-router.ts) decides when to use this
// transport. This module is the iOS counterpart of AirhopWiFiModule.kt.
//
// Three events emitted to TypeScript:
//   AirhopWiFi.packetReceived   { linkID, dataBase64 }
//   AirhopWiFi.linkConnected    { linkID }
//   AirhopWiFi.linkDisconnected { linkID }
//
// Note: the same event names as the Android WiFi module so TypeScript can
// treat them symmetrically through the NativeAirhopWiFi TurboModule.
import Foundation
import MultipeerConnectivity
import React

// MARK: - Constants

private enum MCConst {
    // Service type must be 1–15 characters, letters/digits/hyphens only.
    static let serviceType = "airhop-mesh"
    // Maximum single stream write before flushing.
    static let maxFrameSize = 65_544
}

private enum MCEvent {
    static let packetReceived    = "AirhopWiFi.packetReceived"
    static let linkConnected     = "AirhopWiFi.linkConnected"
    static let linkDisconnected  = "AirhopWiFi.linkDisconnected"
}

// MARK: - Module

@objc(AirhopMCModule)
final class AirhopMCModule: RCTEventEmitter {

    // MARK: State

    private var peerID:     MCPeerID?
    private var session:    MCSession?
    private var advertiser: MCNearbyServiceAdvertiser?
    private var browser:    MCNearbyServiceBrowser?

    // linkID (peerID.displayName) -> MCPeerID for connected peers.
    private var connectedPeers: [String: MCPeerID] = [:]

    // MARK: RCTEventEmitter

    @objc override static func requiresMainQueueSetup() -> Bool { false }

    override func supportedEvents() -> [String]! {
        [MCEvent.packetReceived, MCEvent.linkConnected, MCEvent.linkDisconnected]
    }

    // MARK: - Start / Stop

    @objc func startWiFi(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock,
    ) {
        guard peerID == nil else {
            resolve(nil)
            return
        }

        // Use the device name as the display name. TypeScript identifies peers
        // by linkID (= peerID.displayName), not by human-readable name.
        let pid = MCPeerID(displayName: UIDevice.current.name)
        peerID = pid

        let s = MCSession(
            peer: pid,
            securityIdentity: nil,
            encryptionPreference: .required,
        )
        s.delegate = self
        session = s

        let adv = MCNearbyServiceAdvertiser(
            peer: pid,
            discoveryInfo: nil,
            serviceType: MCConst.serviceType,
        )
        adv.delegate = self
        adv.startAdvertisingPeer()
        advertiser = adv

        let br = MCNearbyServiceBrowser(peer: pid, serviceType: MCConst.serviceType)
        br.delegate = self
        br.startBrowsingForPeers()
        browser = br

        resolve(nil)
    }

    @objc func stopWiFi(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock,
    ) {
        advertiser?.stopAdvertisingPeer()
        browser?.stopBrowsingForPeers()
        session?.disconnect()
        advertiser = nil
        browser = nil
        session = nil
        peerID = nil
        connectedPeers.removeAll()
        resolve(nil)
    }

    // MARK: - Write

    @objc func writeToWiFiLink(
        _ linkID: String,
        dataBase64: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock,
    ) {
        guard let session,
              let peer = connectedPeers[linkID],
              let data = Data(base64Encoded: dataBase64)
        else {
            reject("LINK_NOT_FOUND", "No active WiFi link: \(linkID)", nil)
            return
        }

        // Length-prefixed frame: [4-byte BE length][data]
        var frame = Data(capacity: 4 + data.count)
        var len = UInt32(data.count).bigEndian
        frame.append(contentsOf: withUnsafeBytes(of: &len) { Array($0) })
        frame.append(data)

        do {
            try session.send(frame, toPeers: [peer], with: .reliable)
            resolve(nil)
        } catch {
            reject("SEND_FAILED", error.localizedDescription, error)
        }
    }
}

// MARK: - MCSessionDelegate

extension AirhopMCModule: MCSessionDelegate {

    func session(_ session: MCSession, peer: MCPeerID, didChange state: MCSessionState) {
        let linkID = peer.displayName
        switch state {
        case .connected:
            connectedPeers[linkID] = peer
            sendEvent(withName: MCEvent.linkConnected, body: ["linkID": linkID])

        case .notConnected:
            connectedPeers.removeValue(forKey: linkID)
            sendEvent(withName: MCEvent.linkDisconnected, body: ["linkID": linkID])

        case .connecting:
            break // no event; wait for .connected

        @unknown default:
            break
        }
    }

    func session(_ session: MCSession, didReceive data: Data, fromPeer peer: MCPeerID) {
        // Unwrap the 4-byte BE length prefix sent by writeToWiFiLink.
        guard data.count > 4 else { return }
        let len = Int(data.prefix(4).withUnsafeBytes { $0.load(as: UInt32.self).bigEndian })
        guard len == data.count - 4 else { return }
        let payload = data.dropFirst(4)
        let b64 = payload.base64EncodedString()
        sendEvent(withName: MCEvent.packetReceived, body: [
            "linkID": peer.displayName,
            "dataBase64": b64,
        ])
    }

    // Stream and resource delegates — not used; raw Data frames cover all cases.
    func session(_ session: MCSession, didReceive stream: InputStream,
                 withName streamName: String, fromPeer peer: MCPeerID) {}
    func session(_ session: MCSession,
                 didStartReceivingResourceWithName resourceName: String,
                 fromPeer peer: MCPeerID, with progress: Progress) {}
    func session(_ session: MCSession,
                 didFinishReceivingResourceWithName resourceName: String,
                 fromPeer peer: MCPeerID, at localURL: URL?,
                 withError error: (any Error)?) {}
}

// MARK: - MCNearbyServiceAdvertiserDelegate

extension AirhopMCModule: MCNearbyServiceAdvertiserDelegate {

    func advertiser(_ advertiser: MCNearbyServiceAdvertiser,
                    didReceiveInvitationFromPeer peer: MCPeerID,
                    withContext context: Data?,
                    invitationHandler: @escaping (Bool, MCSession?) -> Void) {
        // Accept all invitations unconditionally. Identity verification is
        // handled by the TypeScript layer via signed ANNOUNCE packets.
        invitationHandler(true, session)
    }

    func advertiser(_ advertiser: MCNearbyServiceAdvertiser,
                    didNotStartAdvertisingPeer error: any Error) {
        // Non-fatal: BLE fallback is always available.
        NSLog("[AirhopMCModule] Advertiser error: %@", error.localizedDescription)
    }
}

// MARK: - MCNearbyServiceBrowserDelegate

extension AirhopMCModule: MCNearbyServiceBrowserDelegate {

    func browser(_ browser: MCNearbyServiceBrowser,
                 foundPeer peer: MCPeerID,
                 withDiscoveryInfo info: [String: String]?) {
        guard let session, let myPeer = peerID else { return }
        // Only the lexicographically smaller peer initiates the invitation to
        // prevent both sides inviting each other simultaneously.
        if myPeer.displayName < peer.displayName {
            browser.invitePeer(peer, to: session, withContext: nil, timeout: 10)
        }
    }

    func browser(_ browser: MCNearbyServiceBrowser, lostPeer peer: MCPeerID) {
        // Handled via MCSessionDelegate.didChange(.notConnected).
    }

    func browser(_ browser: MCNearbyServiceBrowser,
                 didNotStartBrowsingForPeers error: any Error) {
        NSLog("[AirhopMCModule] Browser error: %@", error.localizedDescription)
    }
}
