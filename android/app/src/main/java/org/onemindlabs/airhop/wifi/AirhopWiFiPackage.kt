// Registers AirhopWiFiModule with the React Native bridge.
// Referenced from MainApplication.kt's getPackages() list alongside AirhopBLEPackage.
package org.onemindlabs.airhop.wifi

import android.os.Build
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AirhopWiFiPackage : ReactPackage {

    override fun createNativeModules(
        reactContext: ReactApplicationContext,
    ): List<NativeModule> {
        // WiFi Aware requires API 26+. On older devices the module is simply
        // absent; TypeScript checks NativeModules.AirhopWiFi before using it.
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            listOf(AirhopWiFiModule(reactContext))
        } else {
            emptyList()
        }
    }

    override fun createViewManagers(
        reactContext: ReactApplicationContext,
    ): List<ViewManager<*, *>> = emptyList()
}
