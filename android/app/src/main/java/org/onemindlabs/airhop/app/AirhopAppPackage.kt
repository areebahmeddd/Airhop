// Registers AirhopAppModule with the React Native bridge.
// Referenced from MainApplication.kt's getPackages() list alongside
// AirhopBLEPackage, AirhopWiFiPackage and AirhopVoicePackage.
package org.onemindlabs.airhop.app

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AirhopAppPackage : ReactPackage {

    // ReactPackage.createNativeModules is deprecated in New Architecture (use
    // codegen TurboModules), but legacy interop still requires it until
    // AirhopAppModule is fully migrated. Same position as the other three.
    @Suppress("OVERRIDE_DEPRECATION")
    override fun createNativeModules(
        reactContext: ReactApplicationContext,
    ): List<NativeModule> = listOf(AirhopAppModule(reactContext))

    @Suppress("OVERRIDE_DEPRECATION")
    override fun createViewManagers(
        reactContext: ReactApplicationContext,
    ): List<ViewManager<*, *>> = emptyList()
}
