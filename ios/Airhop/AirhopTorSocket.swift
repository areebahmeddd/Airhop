// AirhopTorSocket.swift
//
// A WebSocket that rides Arti's SOCKS5 proxy so nostr-tools can route relay
// connections through Tor. React Native's built-in WebSocket cannot speak
// SOCKS5, so we expose URLSessionWebSocketTask over a session configured with
// the same proxy dictionary AirhopTorSession uses, and bridge each socket's
// lifecycle to JS as `TorSocketEvent`s keyed by a per-connection id.
//
// Bridge file: AirhopTorSocket.mm
// TypeScript spec: src/bridge/NativeAirhopTorSocket.ts
// JS WebSocket shim: src/core/nostr/tor-websocket.ts
//
// Security:
//  - TLS is validated end to end to the relay by URLSession's default trust
//    evaluation. We deliberately never implement urlSession(_:didReceive:), so
//    there is no certificate bypass: SOCKS only tunnels the TCP stream; the
//    wss:// handshake and certificate check still happen against the real relay
//    at the Tor exit, exactly as they would on a direct connection.
//  - The session is ephemeral, so no cookies, cache, or credentials persist to
//    disk that could correlate one Tor circuit with another.
//  - waitsForConnectivity is off: if Arti's SOCKS port is not listening the
//    connect fails fast and is reported as an error + close. The JS layer keeps
//    Tor selected and retries; it never silently falls back to the clear net.

import Foundation
import React

@objc(AirhopTorSocket)
final class AirhopTorSocket: RCTEventEmitter, URLSessionWebSocketDelegate {

  private static let eventName = "TorSocketEvent"

  // Guards `tasks`, which is touched from both the JS method queue (connect /
  // send / close) and the session's delegate queue (receive / delegate).
  private let lock = NSLock()
  private var tasks: [String: URLSessionWebSocketTask] = [:]
  private var hasListeners = false

  // Serialized delegate queue keeps receive callbacks and delegate events off
  // the main thread and ordered, so a socket's frames arrive in sequence.
  private lazy var delegateQueue: OperationQueue = {
    let queue = OperationQueue()
    queue.maxConcurrentOperationCount = 1
    queue.name = "chat.airhop.torsocket"
    return queue
  }()

  private lazy var session: URLSession = {
    let cfg = URLSessionConfiguration.ephemeral
    cfg.waitsForConnectivity = false
    // Arti SOCKS5 port (39050), distinct from Orbot/C-Tor (9050). Read from the
    // manager so the two stay in lock step if the port ever changes.
    cfg.connectionProxyDictionary = [
      "SOCKSEnable": 1,
      "SOCKSProxy": "127.0.0.1",
      "SOCKSPort": AirhopTorManager.shared.socksPort,
    ]
    return URLSession(configuration: cfg, delegate: self, delegateQueue: delegateQueue)
  }()

  // MARK: - RCTEventEmitter

  override static func requiresMainQueueSetup() -> Bool { false }

  override func supportedEvents() -> [String]! { [AirhopTorSocket.eventName] }

  override func startObserving() { hasListeners = true }
  override func stopObserving() { hasListeners = false }

  private func emit(_ id: String, _ type: String, _ extra: [String: Any] = [:]) {
    guard hasListeners else { return }
    var body: [String: Any] = ["id": id, "type": type]
    for (key, value) in extra { body[key] = value }
    sendEvent(withName: AirhopTorSocket.eventName, body: body)
  }

  // MARK: - Task registry (atomic claim so exactly one path reports close)

  private func store(_ id: String, _ task: URLSessionWebSocketTask) {
    lock.lock(); defer { lock.unlock() }
    tasks[id] = task
  }

  private func peek(_ id: String) -> URLSessionWebSocketTask? {
    lock.lock(); defer { lock.unlock() }
    return tasks[id]
  }

  // Remove and return the task for `id`, or nil if it was already claimed. The
  // caller that gets a non-nil result owns emitting the single close event.
  private func claim(_ id: String) -> URLSessionWebSocketTask? {
    lock.lock(); defer { lock.unlock() }
    let task = tasks[id]
    tasks[id] = nil
    return task
  }

  private func claim(byTask task: URLSessionTask) -> String? {
    lock.lock(); defer { lock.unlock() }
    guard let id = tasks.first(where: { $0.value === task })?.key else { return nil }
    tasks[id] = nil
    return id
  }

  private func id(forTask task: URLSessionTask) -> String? {
    lock.lock(); defer { lock.unlock() }
    return tasks.first(where: { $0.value === task })?.key
  }

  // MARK: - JS API

  @objc(connect:url:)
  func connect(_ id: String, url urlString: String) {
    guard let url = URL(string: urlString),
          let scheme = url.scheme?.lowercased(),
          scheme == "wss" || scheme == "ws" else {
      emit(id, "error", ["message": "invalid websocket url"])
      emit(id, "close", ["code": 1006, "reason": "invalid websocket url"])
      return
    }
    let task = session.webSocketTask(with: url)
    store(id, task)
    task.resume()
    receive(id)
  }

  @objc(send:data:)
  func send(_ id: String, data: String) {
    guard let task = peek(id) else {
      emit(id, "error", ["message": "send on closed socket"])
      return
    }
    task.send(.string(data)) { [weak self] error in
      if let error = error {
        self?.emit(id, "error", ["message": error.localizedDescription])
      }
    }
  }

  @objc(close:code:reason:)
  func close(_ id: String, code: NSNumber, reason: String) {
    guard let task = claim(id) else { return }
    let closeCode = URLSessionWebSocketTask.CloseCode(rawValue: code.intValue) ?? .normalClosure
    task.cancel(with: closeCode, reason: reason.data(using: .utf8))
    // A locally-initiated cancel does not always fire didCloseWith, so emit the
    // close here. `claim` guarantees this fires exactly once for the socket.
    emit(id, "close", ["code": code.intValue, "reason": reason])
  }

  // MARK: - Receive loop

  private func receive(_ id: String) {
    guard let task = peek(id) else { return }
    task.receive { [weak self] result in
      guard let self = self else { return }
      switch result {
      case .failure(let error):
        // Terminal for this socket. Report + close once (claim wins the race
        // with any concurrent delegate callback).
        if self.claim(id) != nil {
          self.emit(id, "error", ["message": error.localizedDescription])
          self.emit(id, "close", ["code": 1006, "reason": "receive failed"])
        }
      case .success(let message):
        switch message {
        case .string(let text):
          self.emit(id, "message", ["data": text])
        case .data(let data):
          // Nostr frames are JSON text; a binary frame is unexpected but we pass
          // it through base64-encoded so the JS side can decode if it must.
          self.emit(id, "message", ["data": data.base64EncodedString(), "binary": true])
        @unknown default:
          break
        }
        self.receive(id) // keep reading until the socket closes
      }
    }
  }

  // MARK: - URLSessionWebSocketDelegate

  func urlSession(_ session: URLSession,
                  webSocketTask: URLSessionWebSocketTask,
                  didOpenWithProtocol protocolName: String?) {
    if let id = id(forTask: webSocketTask) {
      emit(id, "open")
    }
  }

  func urlSession(_ session: URLSession,
                  webSocketTask: URLSessionWebSocketTask,
                  didCloseWith closeCode: URLSessionWebSocketTask.CloseCode,
                  reason: Data?) {
    guard let id = claim(byTask: webSocketTask) else { return }
    let reasonStr = reason.flatMap { String(data: $0, encoding: .utf8) } ?? ""
    emit(id, "close", ["code": closeCode.rawValue, "reason": reasonStr])
  }

  // Surface transport-level failures, including SOCKS/connect errors when Arti
  // is not yet listening, as an error + close so the JS relay can retry.
  func urlSession(_ session: URLSession,
                  task: URLSessionTask,
                  didCompleteWithError error: Error?) {
    guard let error = error, let id = claim(byTask: task) else { return }
    emit(id, "error", ["message": error.localizedDescription])
    emit(id, "close", ["code": 1006, "reason": error.localizedDescription])
  }

  // MARK: - Teardown

  override func invalidate() {
    let live: [URLSessionWebSocketTask]
    lock.lock()
    live = Array(tasks.values)
    tasks.removeAll()
    lock.unlock()
    for task in live { task.cancel(with: .goingAway, reason: nil) }
    super.invalidate()
  }
}
