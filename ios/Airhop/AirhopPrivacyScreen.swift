//
//  AirhopPrivacyScreen.swift
//  Airhop
//
//  Covers the window while the app is not frontmost, so the snapshot iOS takes
//  for the app switcher shows the Airhop mark instead of an open conversation.
//
//  Ported from bitchat's PrivacyScreen, including the two details that make it
//  work at all:
//
//  - The cover goes on at `willResignActive` and comes off at `didBecomeActive`,
//    UIKit notifications rather than SwiftUI's `scenePhase`. The snapshot is
//    captured shortly after `willResignActive`, and adding an opaque subview to
//    the window synchronously in that callback is the only way to guarantee it
//    is in the render tree before the capture. A React or SwiftUI overlay driven
//    by state may not have been laid out yet.
//  - `queue: nil` is required, not incidental. Passing an `OperationQueue` would
//    run the handler in a later runloop turn, which the snapshot can beat; with
//    no queue the block runs synchronously on the thread that posted the
//    notification, which for UIApplication lifecycle notifications is main.
//
//  What it draws differs: bitchat centres a text wordmark, this draws the pixel
//  bird from the same 11x6 grid the brand mark is authored on, in dynamic colours
//  so light and dark each resolve without a second asset to keep in sync.
//
//  Opaque, never a blur: blurred large text can stay partly legible, and the
//  snapshot is written to disk. Panic wipe separately deletes snapshots already
//  there; this keeps new ones from containing anything worth deleting.
//

#if os(iOS)
import UIKit

final class AirhopPrivacyScreen {
  static let shared = AirhopPrivacyScreen()

  // The pixel bird, one bit per cell, most significant bit leftmost. Same grid
  // as landing/public/brand/airhop-icon.svg and assets/images/splash-icon.png:
  // 11 columns by 6 rows, so a change to the mark is a change to these six
  // numbers and nothing else.
  private static let markColumns = 11
  private static let markRows: [UInt16] = [
    0b110_0000_0011,
    0b011_0000_0110,
    0b001_1010_1100,
    0b000_1111_1000,
    0b000_0111_0000,
    0b000_0010_0000,
  ]
  // Cell edge in points. 11 cells wide keeps the mark at 176pt, close to the
  // launch screen's optical size on every phone without needing to measure.
  private static let cellSize: CGFloat = 16

  // Airhop's own palette rather than `.systemBackground` / `.label`, so the cover
  // is the same two colours the app itself renders (Colors.bg and
  // Colors.textPrimary in src/ui/theme.ts, and their DarkColors counterparts) and
  // matches android/app/src/main/res/values*/colors.xml exactly. Dynamic
  // providers, so light and dark each resolve without a second asset.
  private static let background = UIColor {
    $0.userInterfaceStyle == .dark
      ? UIColor(red: 0x0B / 255, green: 0x0B / 255, blue: 0x0B / 255, alpha: 1)
      : UIColor(red: 0xF8 / 255, green: 0xF8 / 255, blue: 0xF8 / 255, alpha: 1)
  }
  private static let ink = UIColor {
    $0.userInterfaceStyle == .dark
      ? UIColor(red: 0xF5 / 255, green: 0xF5 / 255, blue: 0xF5 / 255, alpha: 1)
      : UIColor(red: 0x11 / 255, green: 0x11 / 255, blue: 0x11 / 255, alpha: 1)
  }

  private var cover: UIView?
  private var observers: [NSObjectProtocol] = []

  private init() {}

  /// Idempotent: repeated calls do not stack observers.
  func install() {
    guard observers.isEmpty else { return }
    let center = NotificationCenter.default
    observers = [
      center.addObserver(
        forName: UIApplication.willResignActiveNotification,
        object: nil,
        queue: nil
      ) { _ in
        AirhopPrivacyScreen.shared.show()
      },
      center.addObserver(
        forName: UIApplication.didBecomeActiveNotification,
        object: nil,
        queue: nil
      ) { _ in
        AirhopPrivacyScreen.shared.hide()
      },
    ]
  }

  private func show() {
    guard cover == nil, let window = Self.activeWindow() else { return }

    let view = UIView(frame: window.bounds)
    view.backgroundColor = Self.background
    view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    view.addSubview(Self.makeMark(centeredIn: view.bounds))

    window.addSubview(view)
    cover = view
  }

  private func hide() {
    cover?.removeFromSuperview()
    cover = nil
  }

  // One container holding a plain UIView per lit cell. A stack of small opaque
  // squares rather than an image or a shape layer: it inherits the dynamic
  // colour directly, so the mark flips with the system appearance even while the
  // cover is already on screen.
  private static func makeMark(centeredIn bounds: CGRect) -> UIView {
    let width = cellSize * CGFloat(markColumns)
    let height = cellSize * CGFloat(markRows.count)
    let container = UIView(
      frame: CGRect(
        x: (bounds.width - width) / 2,
        y: (bounds.height - height) / 2,
        width: width,
        height: height
      )
    )
    container.autoresizingMask = [
      .flexibleTopMargin, .flexibleBottomMargin,
      .flexibleLeftMargin, .flexibleRightMargin,
    ]

    for (row, bits) in markRows.enumerated() {
      for column in 0..<markColumns {
        let bit = UInt16(1) << UInt16(markColumns - 1 - column)
        guard bits & bit != 0 else { continue }
        let cell = UIView(
          frame: CGRect(
            x: CGFloat(column) * cellSize,
            y: CGFloat(row) * cellSize,
            width: cellSize,
            height: cellSize
          )
        )
        cell.backgroundColor = Self.ink
        container.addSubview(cell)
      }
    }
    return container
  }

  private static func activeWindow() -> UIWindow? {
    let windows = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
    return windows.first { $0.isKeyWindow } ?? windows.first
  }
}
#endif
