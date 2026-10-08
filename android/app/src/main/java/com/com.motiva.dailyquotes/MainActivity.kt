package com.motiva.dailyquotes

import android.os.Build
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableHighRefreshRate()
  }

  /**
   * Unlocks 120Hz high refresh rate display modes on devices that support it (API 23+),
   * while gracefully keeping 60Hz on standard displays without battery penalty.
   */
  private fun enableHighRefreshRate() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      try {
        val currentDisplay = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          display
        } else {
          @Suppress("DEPRECATION")
          windowManager.defaultDisplay
        }
        val modes = currentDisplay?.supportedModes ?: return
        var maxRate = 60f
        var bestModeId = 0
        for (mode in modes) {
          if (mode.refreshRate > maxRate) {
            maxRate = mode.refreshRate
            bestModeId = mode.modeId
          }
        }
        if (bestModeId != 0) {
          val params = window.attributes
          params.preferredDisplayModeId = bestModeId
          window.attributes = params
        }
      } catch (_: Exception) {
        // Fallback to default system refresh rate
      }
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Motiva"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
