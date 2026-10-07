package com.motiva.dailyquotes.notification

import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DailyNotificationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "DailyNotificationModule"

    @ReactMethod
    fun scheduleDailyNotification(hour: Double, minute: Double, promise: Promise) {
        try {
            val h = hour.toInt()
            val m = minute.toInt()
            DailyNotificationManager.scheduleDailyNotification(reactContext, h, m)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_SCHEDULE_ERROR", e.message ?: "Failed to schedule", e)
        }
    }

    @ReactMethod
    fun cancelDailyNotification(promise: Promise) {
        try {
            DailyNotificationManager.cancelDailyNotification(reactContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_CANCEL_ERROR", e.message ?: "Failed to cancel", e)
        }
    }

    @ReactMethod
    fun isNotificationScheduled(promise: Promise) {
        try {
            val enabled = DailyNotificationManager.isNotificationEnabled(reactContext)
            promise.resolve(enabled)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_STATUS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun sendTestNotification(promise: Promise) {
        try {
            DailyNotificationManager.showQuoteNotification(reactContext, isTest = true)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_TEST_ERROR", e.message ?: "Failed to send test notification", e)
        }
    }

    @ReactMethod
    fun getNotificationSettings(promise: Promise) {
        try {
            val map = Arguments.createMap().apply {
                putBoolean("enabled", DailyNotificationManager.isNotificationEnabled(reactContext))
                putInt("hour", DailyNotificationManager.getNotificationHour(reactContext))
                putInt("minute", DailyNotificationManager.getNotificationMinute(reactContext))
            }
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_SETTINGS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun setNotificationEnabled(enabled: Boolean, promise: Promise) {
        try {
            DailyNotificationManager.setNotificationEnabled(reactContext, enabled)
            if (enabled) {
                val hour = DailyNotificationManager.getNotificationHour(reactContext)
                val minute = DailyNotificationManager.getNotificationMinute(reactContext)
                DailyNotificationManager.scheduleDailyNotification(reactContext, hour, minute)
            } else {
                DailyNotificationManager.cancelDailyNotification(reactContext)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_ENABLE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getTodaysNotificationQuote(promise: Promise) {
        try {
            val quote = DailyNotificationManager.getTodaysQuote(reactContext)
            if (quote != null) {
                val map = Arguments.createMap().apply {
                    putString("id", quote.id)
                    putString("content", quote.content)
                    putString("author", quote.author)
                    putString("date", DailyNotificationManager.getTodayDateString())
                }
                promise.resolve(map)
            } else {
                promise.resolve(null)
            }
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_QUOTE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun areNotificationsEnabled(promise: Promise) {
        try {
            val enabled = NotificationManagerCompat.from(reactContext).areNotificationsEnabled()
            promise.resolve(enabled)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_CHECK_ERROR", e.message, e)
        }
    }
}
