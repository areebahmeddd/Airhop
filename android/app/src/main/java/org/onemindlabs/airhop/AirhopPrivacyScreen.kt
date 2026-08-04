package org.onemindlabs.airhop

import android.app.Activity
import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.core.content.ContextCompat

/**
 * Covers the window while the activity is not resumed, so the thumbnail Android
 * keeps for the recents/overview screen shows the Airhop mark instead of an open
 * conversation.
 *
 * The iOS counterpart is ios/Airhop/AirhopPrivacyScreen.swift; the two draw the
 * same mark from the same grid.
 *
 * Why an overlay rather than `setRecentsScreenshotEnabled(false)`:
 *
 *  - that API is Tiramisu and up, while minSdk here is 26, so most of the
 *    install base would keep leaking
 *  - where it does apply, it substitutes the OS placeholder rather than our mark
 *
 * Why not FLAG_SECURE: it would also block deliberate screenshots, which Airhop
 * treats as legitimate. It detects them and tells the other side of the
 * conversation rather than preventing them.
 *
 * The cover is attached in `onPause` and removed in `onResume`. Android captures
 * the thumbnail after the activity leaves the resumed state, and adding the view
 * synchronously in `onPause` puts it in the hierarchy before that happens.
 *
 * `onPause` also fires when a system dialog takes focus, such as a permission
 * prompt, so the cover can appear behind one. That is the same trade-off iOS
 * makes with `willResignActive`, and it is the right way round: a moment of the
 * mark behind a dialog costs nothing, a conversation left in the recents
 * thumbnail costs the user.
 */
object AirhopPrivacyScreen {
  private var cover: View? = null

  fun show(activity: Activity) {
    // A cover whose window has since been torn down (activity recreated while
    // backgrounded) must not block the next one.
    if (cover?.parent == null) cover = null
    if (cover != null) return
    val root = activity.window?.decorView as? ViewGroup ?: return
    val view = MarkView(activity)
    view.setBackgroundColor(
      ContextCompat.getColor(activity, R.color.airhop_privacy_background)
    )
    root.addView(
      view,
      FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
      )
    )
    cover = view
  }

  fun hide() {
    val view = cover ?: return
    (view.parent as? ViewGroup)?.removeView(view)
    cover = null
  }

  /**
   * The pixel bird, one bit per cell, most significant bit leftmost. Same grid as
   * landing/public/brand/airhop-icon.svg and assets/images/splash-icon.png: 11
   * columns by 6 rows. Drawn rather than loaded so a single colour resource gives
   * a correct light and dark mark with no second bitmap to keep in sync.
   */
  private class MarkView(context: Context) : View(context) {
    private val paint = Paint().apply {
      isAntiAlias = false
      color = ContextCompat.getColor(context, R.color.airhop_privacy_ink)
    }

    override fun onDraw(canvas: Canvas) {
      super.onDraw(canvas)
      val cell = (resources.displayMetrics.density * CELL_DP)
      val markWidth = cell * COLUMNS
      val markHeight = cell * ROWS.size
      val left = (width - markWidth) / 2f
      val top = (height - markHeight) / 2f
      for ((row, bits) in ROWS.withIndex()) {
        for (column in 0 until COLUMNS) {
          if (bits and (1 shl (COLUMNS - 1 - column)) == 0) continue
          val x = left + column * cell
          val y = top + row * cell
          canvas.drawRect(x, y, x + cell, y + cell, paint)
        }
      }
    }

    private companion object {
      const val COLUMNS = 11
      const val CELL_DP = 16f
      val ROWS = intArrayOf(
        0b110_0000_0011,
        0b011_0000_0110,
        0b001_1010_1100,
        0b000_1111_1000,
        0b000_0111_0000,
        0b000_0010_0000,
      )
    }
  }
}
