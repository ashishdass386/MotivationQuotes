package com.motiva.dailyquotes

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.motiva.dailyquotes.notification.DailyNotificationManager
import com.motiva.dailyquotes.notification.DailyNotificationPackage
import com.motiva.dailyquotes.widget.QuoteWidgetPackage

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Register QuoteWidgetModule for home screen widget communication
          add(QuoteWidgetPackage())
          // Register DailyNotificationModule for daily morning local notifications
          add(DailyNotificationPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)

    // Ensure the 8:30 AM daily motivation notification is scheduled
    DailyNotificationManager.scheduleDailyNotification(this, 8, 30)
  }
}
