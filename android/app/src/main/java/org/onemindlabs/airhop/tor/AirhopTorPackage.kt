// Registers AirhopTorModule with the React Native bridge.
// Referenced from MainApplication.kt's package list alongside AirhopBLEPackage.
package org.onemindlabs.airhop.tor

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AirhopTorPackage : ReactPackage {

    // ReactPackage.createNativeModules is deprecated in New Architecture (use
    // codegen TurboModules), but legacy interop still requires it until
    // AirhopTorModule is fully migrated, which matches every other Airhop module.
    //
    // Registered unconditionally, even on a build where libarti_airhop.so is
    // missing for this ABI. The module answers for itself through
    // ArtiNative.isAvailable and reports a stopped client, which is what lets
    // the Tor toggle explain itself rather than the app crashing the first time
    // somebody opens Settings.
    @Suppress("OVERRIDE_DEPRECATION")
    override fun createNativeModules(
        reactContext: ReactApplicationContext,
    ): List<NativeModule> = listOf(AirhopTorModule(reactContext))

    @Suppress("OVERRIDE_DEPRECATION")
    override fun createViewManagers(
        reactContext: ReactApplicationContext,
    ): List<ViewManager<*, *>> = emptyList()
}
