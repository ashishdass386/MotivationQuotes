package com.motiva.dailyquotes.notification

import android.Manifest
import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Build
import android.util.Log
import android.widget.RemoteViews
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.motiva.dailyquotes.MainActivity
import com.motiva.dailyquotes.R
import com.motiva.dailyquotes.widget.QuoteWidgetProvider
import com.motiva.dailyquotes.widget.QuoteWidgetStorage
import com.motiva.dailyquotes.widget.WidgetQuote
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

object DailyNotificationManager {

    private const val TAG = "DailyNotificationMgr"
    const val CHANNEL_ID = "motiva_daily_quotes_v2"
    private const val CHANNEL_NAME = "Daily Motivation Quotes"
    const val ACTION_DAILY_NOTIFICATION = "com.motiva.dailyquotes.ACTION_DAILY_NOTIFICATION"

    private const val PREFS_NAME = "com.motiva.dailyquotes.notification.prefs"
    private const val KEY_ENABLED = "notification_enabled"
    private const val KEY_HOUR = "notification_hour"
    private const val KEY_MINUTE = "notification_minute"
    private const val KEY_TODAYS_QUOTE_ID = "today_notif_quote_id"
    private const val KEY_TODAYS_QUOTE_CONTENT = "today_notif_quote_content"
    private const val KEY_TODAYS_QUOTE_AUTHOR = "today_notif_quote_author"
    private const val KEY_TODAYS_QUOTE_DATE = "today_notif_quote_date"

    private const val ALARM_REQUEST_CODE = 83000
    private const val NOTIFICATION_ID = 83001
    private const val TEST_NOTIFICATION_ID = 83002
    private const val NOTIFICATION_INTENT_REQUEST_CODE = 83003

    // Default time is 8:30 AM
    const val DEFAULT_HOUR = 8
    const val DEFAULT_MINUTE = 30

    private fun getPrefs(context: Context): SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun isNotificationEnabled(context: Context): Boolean =
        getPrefs(context).getBoolean(KEY_ENABLED, true)

    fun setNotificationEnabled(context: Context, enabled: Boolean) {
        getPrefs(context).edit().putBoolean(KEY_ENABLED, enabled).apply()
    }

    fun getNotificationHour(context: Context): Int =
        getPrefs(context).getInt(KEY_HOUR, DEFAULT_HOUR)

    fun getNotificationMinute(context: Context): Int =
        getPrefs(context).getInt(KEY_MINUTE, DEFAULT_MINUTE)

    fun getTodayDateString(): String =
        SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())

    fun saveTodaysQuote(
        context: Context,
        id: String,
        content: String,
        author: String,
        date: String = getTodayDateString(),
    ) {
        getPrefs(context).edit().apply {
            putString(KEY_TODAYS_QUOTE_ID, id)
            putString(KEY_TODAYS_QUOTE_CONTENT, content)
            putString(KEY_TODAYS_QUOTE_AUTHOR, author)
            putString(KEY_TODAYS_QUOTE_DATE, date)
            apply()
        }
    }

    fun getTodaysQuote(context: Context): WidgetQuote? {
        val prefs = getPrefs(context)
        val date = prefs.getString(KEY_TODAYS_QUOTE_DATE, "") ?: ""
        if (date != getTodayDateString()) {
            return null
        }
        val id = prefs.getString(KEY_TODAYS_QUOTE_ID, "") ?: ""
        val content = prefs.getString(KEY_TODAYS_QUOTE_CONTENT, "") ?: ""
        val author = prefs.getString(KEY_TODAYS_QUOTE_AUTHOR, "") ?: ""
        return if (content.isNotBlank()) WidgetQuote(id, content, author) else null
    }

    /**
     * Create Notification Channel (Android 8.0+)
     */
    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                description = "Daily inspirational quote notification at 8:30 AM"
                enableLights(true)
                lightColor = Color.parseColor("#171717")
                enableVibration(true)
                setShowBadge(true)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            }
            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
            try {
                manager?.deleteNotificationChannel("motiva_daily_quotes")
            } catch (_: Exception) {}
            manager?.createNotificationChannel(channel)
        }
    }

    /**
     * Schedules the next daily alarm at the given hour:minute (default 8:30 AM).
     */
    fun scheduleDailyNotification(
        context: Context,
        hour: Int = DEFAULT_HOUR,
        minute: Int = DEFAULT_MINUTE,
    ) {
        if (!isNotificationEnabled(context)) {
            Log.d(TAG, "Notification is disabled in settings; skip scheduling.")
            return
        }

        // Save preference
        getPrefs(context).edit().apply {
            putBoolean(KEY_ENABLED, true)
            putInt(KEY_HOUR, hour)
            putInt(KEY_MINUTE, minute)
            apply()
        }

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return

        val now = Calendar.getInstance()
        val target = Calendar.getInstance().apply {
            timeInMillis = System.currentTimeMillis()
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }

        // If today's target time has already passed, schedule for tomorrow
        if (target.timeInMillis <= now.timeInMillis) {
            target.add(Calendar.DAY_OF_YEAR, 1)
        }

        val intent = Intent(context, DailyNotificationReceiver::class.java).apply {
            action = ACTION_DAILY_NOTIFICATION
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            ALARM_REQUEST_CODE,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        target.timeInMillis,
                        pendingIntent,
                    )
                } else {
                    alarmManager.setAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        target.timeInMillis,
                        pendingIntent,
                    )
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    target.timeInMillis,
                    pendingIntent,
                )
            } else {
                alarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    target.timeInMillis,
                    pendingIntent,
                )
            }
            Log.d(TAG, "Successfully scheduled daily notification for: ${target.time}")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to schedule alarm", e)
        }
    }

    /**
     * Cancels the scheduled daily notification alarm.
     */
    fun cancelDailyNotification(context: Context) {
        setNotificationEnabled(context, false)
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
        val intent = Intent(context, DailyNotificationReceiver::class.java).apply {
            action = ACTION_DAILY_NOTIFICATION
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            ALARM_REQUEST_CODE,
            intent,
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE,
        )
        if (pendingIntent != null) {
            alarmManager.cancel(pendingIntent)
            pendingIntent.cancel()
        }
        Log.d(TAG, "Daily notification alarm cancelled")
    }

    /**
     * Displays a local notification with an inspirational quote.
     * When isTest is false (regular 8:30 AM notification), picks a fresh quote,
     * syncs it with the home screen widget and today's record.
     */
    fun showQuoteNotification(context: Context, isTest: Boolean = false) {
        try {
            createNotificationChannel(context)

            // Select quote
            val quote: WidgetQuote = if (isTest) {
                QuoteWidgetStorage.getNextRandomQuote(context)
            } else {
                // Check if today already has a quote, or generate a fresh one
                val existing = getTodaysQuote(context)
                if (existing != null) {
                    existing
                } else {
                    val fresh = QuoteWidgetStorage.getNextRandomQuote(context)
                    saveTodaysQuote(context, fresh.id, fresh.content, fresh.author)
                    // Synchronize widget with this quote as well
                    QuoteWidgetProvider.updateAllWidgets(context)
                    fresh
                }
            }

            // Intent to open app when notification is tapped
            val launchIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                putExtra("from_notification", true)
                putExtra("quote_id", quote.id)
                putExtra("quote_content", quote.content)
                putExtra("quote_author", quote.author)
            }

            val contentPendingIntent = PendingIntent.getActivity(
                context,
                if (isTest) NOTIFICATION_INTENT_REQUEST_CODE + 1 else NOTIFICATION_INTENT_REQUEST_CODE,
                launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
            )

            val tagText = if (isTest) "MOTIVA • DAILY REFLECTION" else "DAILY REFLECTION"
            val title = if (isTest) "Daily Reflection (Preview)" else "Daily Reflection"
            val quoteContent = "“${quote.content.trim()}”"
            val authorName = "— ${quote.author.trim().ifBlank { "Anonymous" }}"

            // Transparent background custom RemoteViews matching app's minimal editorial theme
            val collapsedView = RemoteViews(context.packageName, R.layout.notification_quote_collapsed).apply {
                setTextViewText(R.id.notif_tag, tagText)
                setTextViewText(R.id.notif_quote, quoteContent)
                setTextViewText(R.id.notif_author, authorName)
            }

            val expandedView = RemoteViews(context.packageName, R.layout.notification_quote_expanded).apply {
                setTextViewText(R.id.notif_tag, tagText)
                setTextViewText(R.id.notif_quote, quoteContent)
                setTextViewText(R.id.notif_author, authorName)
            }

            val builder = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification_quote)
                .setColor(Color.parseColor("#171717"))
                .setCustomContentView(collapsedView)
                .setCustomBigContentView(expandedView)
                .setStyle(NotificationCompat.DecoratedCustomViewStyle())
                .setContentTitle(title)
                .setContentText("$quoteContent $authorName")
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setContentIntent(contentPendingIntent)
                .setAutoCancel(true)
                .setDefaults(NotificationCompat.DEFAULT_ALL)

            val notificationManager = NotificationManagerCompat.from(context)

            // Check notification permission on Android 13+
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                if (ContextCompat.checkSelfPermission(
                        context,
                        Manifest.permission.POST_NOTIFICATIONS,
                    ) != PackageManager.PERMISSION_GRANTED
                ) {
                    Log.w(TAG, "POST_NOTIFICATIONS permission not granted; cannot display notification")
                    return
                }
            }

            val notifId = if (isTest) TEST_NOTIFICATION_ID else NOTIFICATION_ID
            notificationManager.notify(notifId, builder.build())
            Log.d(TAG, "Notification displayed successfully (isTest=$isTest, quoteId=${quote.id})")
        } catch (e: Exception) {
            Log.e(TAG, "Error displaying quote notification", e)
        }
    }
}
