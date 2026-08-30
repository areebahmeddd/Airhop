// AirhopAppModule: process-level operations that belong to no radio.
//
// One method, because layout direction only moves on a fresh process: native
// views read the RTL preference when they are created. Asking the user to
// relaunch is not enough, since a warm start recreates the Activity while the
// JS context survives, so the frame turns around and the strings do not.
package org.onemindlabs.airhop.app

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

private const val TAG = "AirhopAppModule"

class AirhopAppModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AirhopApp"

    // Relaunch into a fresh process. `makeRestartActivityTask` is the platform's
    // own answer: the launcher activity as the base of a cleared task, flags
    // included. The exit is what makes the next start cold rather than warm.
    //
    // Foreground only, a platform rule from API 29. Nothing is flushed first:
    // every store writes to MMKV as it is set.
    @ReactMethod
    fun restart(promise: Promise) {
        val context = reactContext.applicationContext
        val launch = context.packageManager.getLaunchIntentForPackage(context.packageName)
        val component = launch?.component
        if (component == null) {
            // Nothing to relaunch. The caller falls back to asking the user.
            Log.e(TAG, "No launch component for ${context.packageName}")
            promise.reject("NO_LAUNCH_INTENT", "This build has no launcher activity")
            return
        }
        try {
            context.startActivity(Intent.makeRestartActivityTask(component))
        } catch (e: Exception) {
            Log.e(TAG, "Restart refused: ${e.message}")
            promise.reject("RESTART_FAILED", e.message, e)
            return
        }
        // Settled before the exit, so an awaiting caller is never left hanging.
        promise.resolve(null)
        Runtime.getRuntime().exit(0)
    }
}
