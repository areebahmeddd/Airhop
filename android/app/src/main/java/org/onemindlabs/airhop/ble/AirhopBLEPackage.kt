// Registers AirhopBLEModule with the React Native bridge.
// This file is referenced from MainApplication.kt's getPackages() list.
package org.onemindlabs.airhop.ble

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AirhopBLEPackage : ReactPackage {

    // ReactPackage.createNativeModules is deprecated in New Architecture (use codegen TurboModules),
    // but legacy interop still requires it until AirhopBLEModule is fully migrated.
    @Suppress("OVERRIDE_DEPRECATION")
    override fun createNativeModules(
        reactContext: ReactApplicationContext,
    ): List<NativeModule> = listOf(AirhopBLEModule(reactContext))

    @Suppress("OVERRIDE_DEPRECATION")
    override fun createViewManagers(
        reactContext: ReactApplicationContext,
    ): List<ViewManager<*, *>> = emptyList()
}
