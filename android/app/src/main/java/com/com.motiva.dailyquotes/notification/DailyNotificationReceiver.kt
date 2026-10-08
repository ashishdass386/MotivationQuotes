package com.motiva.dailyquotes.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * BroadcastReceiver triggered by AlarmManager every day at 8:30 AM.
 * Shows the notification with a fresh inspirational quote and schedules the next day's alarm.
 */
class DailyNotificationReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "DailyNotificationReceiver received intent: ${intent.action}")

        if (intent.action == DailyNotificationManager.ACTION_DAILY_NOTIFICATION) {
            val isTest = intent.getBooleanExtra("isTest", false)
            if (DailyNotificationManager.isNotificationEnabled(context) || isTest) {
                // 1. Show the quote notification
                DailyNotificationManager.showQuoteNotification(context, isTest = isTest)

                // 2. Schedule the next day's notification (8:30 AM)
                val hour = DailyNotificationManager.getNotificationHour(context)
                val minute = DailyNotificationManager.getNotificationMinute(context)
                DailyNotificationManager.scheduleDailyNotification(context, hour, minute)
                Log.d(TAG, "Rescheduled next alarm for $hour:$minute")
            } else {
                Log.d(TAG, "Notification is disabled; ignoring alarm trigger")
            }
        }
    }

    companion object {
        private const val TAG = "DailyNotifReceiver"
    }
}
