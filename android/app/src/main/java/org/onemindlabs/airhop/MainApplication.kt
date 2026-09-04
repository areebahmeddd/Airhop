package org.onemindlabs.airhop

import android.app.Application
import android.content.res.Configuration

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ExpoReactHostFactory
import org.onemindlabs.airhop.app.AirhopAppPackage
import org.onemindlabs.airhop.ble.AirhopBLEPackage
import org.onemindlabs.airhop.lan.AirhopLANPackage
import org.onemindlabs.airhop.tor.AirhopTorPackage
import org.onemindlabs.airhop.tor.AirhopTorProxy
import org.onemindlabs.airhop.voice.AirhopVoicePackage
import org.onemindlabs.airhop.wifi.AirhopWiFiPackage

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    ExpoReactHostFactory.getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          add(AirhopBLEPackage())
          add(AirhopWiFiPackage())
          add(AirhopLANPackage())
          add(AirhopVoicePackage())
          add(AirhopTorPackage())
          add(AirhopAppPackage())
        }
    )
  }

  override fun onCreate() {
    super.onCreate()
    // Before loadReactNative, and it has to be. OkHttpClientProvider caches the
    // first client it builds and offers no way to replace it, so a factory
    // installed after React Native has made a request would apply to nothing and
    // the Tor toggle would silently cover only the sockets opened later.
    //
    // Installing the factory does not route anything through Tor. It only puts
    // the decision somewhere AirhopTorProxy can change later, and the default is
    // a direct connection, which is what a user with Tor off expects.
    AirhopTorProxy.install(this)
    DefaultNewArchitectureEntryPoint.releaseLevel = try {
      ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
    } catch (e: IllegalArgumentException) {
      ReleaseLevel.STABLE
    }
    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
