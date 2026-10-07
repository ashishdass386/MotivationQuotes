package com.motiva.dailyquotes.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * Re-registers the 8:30 AM notification alarm on device boot or app update.
 */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        Log.d(TAG, "BootReceiver received action: $action")

        if (action == Intent.ACTION_BOOT_COMPLETED ||
            action == Intent.ACTION_MY_PACKAGE_REPLACED ||
            action == "android.app.action.SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED"
        ) {
            if (DailyNotificationManager.isNotificationEnabled(context)) {
                val hour = DailyNotificationManager.getNotificationHour(context)
                val minute = DailyNotificationManager.getNotificationMinute(context)
                DailyNotificationManager.scheduleDailyNotification(context, hour, minute)
                Log.d(TAG, "Rescheduled daily notification on $action for $hour:$minute")
            }
        }
    }

    companion object {
        private const val TAG = "BootReceiver"
    }
}
