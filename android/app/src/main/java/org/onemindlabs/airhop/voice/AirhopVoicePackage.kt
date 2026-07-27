// Registers AirhopVoiceModule with the React Native bridge.
// Referenced from MainApplication.kt's getPackages() list alongside
// AirhopBLEPackage and AirhopWiFiPackage.
package org.onemindlabs.airhop.voice

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AirhopVoicePackage : ReactPackage {

    // ReactPackage.createNativeModules is deprecated in New Architecture (use
    // codegen TurboModules), but legacy interop still requires it until
    // AirhopVoiceModule is fully migrated. Same position as the other two.
    @Suppress("OVERRIDE_DEPRECATION")
    override fun createNativeModules(
        reactContext: ReactApplicationContext,
    ): List<NativeModule> = listOf(AirhopVoiceModule(reactContext))

    @Suppress("OVERRIDE_DEPRECATION")
    override fun createViewManagers(
        reactContext: ReactApplicationContext,
    ): List<ViewManager<*, *>> = emptyList()
}
