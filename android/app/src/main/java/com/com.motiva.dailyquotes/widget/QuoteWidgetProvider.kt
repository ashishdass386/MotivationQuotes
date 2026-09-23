package com.motiva.dailyquotes.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.util.Log
import android.util.TypedValue
import android.widget.RemoteViews
import com.motiva.dailyquotes.MainActivity
import com.motiva.dailyquotes.R

/**
 * Home Screen Widget Provider for Motiva.
 * Features:
 * - Dynamic font sizing based on quote length (Poster bold aesthetic for short quotes)
 * - Dynamic color palette cycling
 * - Bottom-right interactive in-place reload button with instant quote switching
 */
class QuoteWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray,
    ) {
        Log.d(TAG, "onUpdate called for ${appWidgetIds.size} widgets")
        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        super.onEnabled(context)
        Log.d(TAG, "onEnabled called")
    }

    override fun onDisabled(context: Context) {
        super.onDisabled(context)
        Log.d(TAG, "onDisabled called")
    }

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "onReceive action: ${intent.action}")
        if (intent.action == ACTION_REFRESH_QUOTE) {
            val appWidgetId = intent.getIntExtra(
                AppWidgetManager.EXTRA_APPWIDGET_ID,
                AppWidgetManager.INVALID_APPWIDGET_ID,
            )
            Log.d(TAG, "ACTION_REFRESH_QUOTE triggered for widget id $appWidgetId")

            // Pick a fresh random quote and new theme from native assets
            QuoteWidgetStorage.getNextRandomQuote(context)

            val appWidgetManager = AppWidgetManager.getInstance(context)
            if (appWidgetId != AppWidgetManager.INVALID_APPWIDGET_ID) {
                updateWidget(context, appWidgetManager, appWidgetId)
            } else {
                updateAllWidgets(context)
            }
        } else {
            super.onReceive(context, intent)
        }
    }

    companion object {
        const val ACTION_REFRESH_QUOTE = "com.motiva.dailyquotes.ACTION_REFRESH_QUOTE"
        private const val TAG = "QuoteWidgetProvider"

        // Curated high-contrast color palettes for dynamic poster styling
        private val THEMES = listOf(
            // Theme 0: Monochrome Bold (Reference Poster Style)
            ThemePalette(
                quoteColor = Color.parseColor("#FFFFFF"),
                authorColor = Color.parseColor("#94A3B8"),
                labelColor = Color.parseColor("#CBD5E1"),
            ),
            // Theme 1: Electric Violet
            ThemePalette(
                quoteColor = Color.parseColor("#F5F3FF"),
                authorColor = Color.parseColor("#C4B5FD"),
                labelColor = Color.parseColor("#A78BFA"),
            ),
            // Theme 2: Neon Cyan
            ThemePalette(
                quoteColor = Color.parseColor("#F0FDFA"),
                authorColor = Color.parseColor("#67E8F9"),
                labelColor = Color.parseColor("#38BDF8"),
            ),
            // Theme 3: Warm Amber Gold
            ThemePalette(
                quoteColor = Color.parseColor("#FFFBEB"),
                authorColor = Color.parseColor("#FCD34D"),
                labelColor = Color.parseColor("#F59E0B"),
            ),
            // Theme 4: Emerald Mint
            ThemePalette(
                quoteColor = Color.parseColor("#F0FDF4"),
                authorColor = Color.parseColor("#6EE7B7"),
                labelColor = Color.parseColor("#34D399"),
            ),
        )

        fun updateWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int,
        ) {
            try {
                val content = QuoteWidgetStorage.getQuoteContent(context)
                val author = QuoteWidgetStorage.getQuoteAuthor(context)
                val themeIndex = QuoteWidgetStorage.getThemeIndex(context) % THEMES.size
                val theme = THEMES[themeIndex]

                val views = RemoteViews(context.packageName, R.layout.widget_quote_medium)

                // 1. Dynamic Font Sizing & Typography based on Quote Length
                val length = content.trim().length
                val (fontSizeSp, isShort) = when {
                    length <= 45 -> Pair(22f, true)
                    length <= 95 -> Pair(16.5f, false)
                    else -> Pair(13.5f, false)
                }

                // If very short quote (like "YOU CAN DO IT."), format in impactful uppercase poster style
                val displayText = if (isShort && length <= 35) {
                    content.trim().uppercase()
                } else {
                    "“$content”"
                }

                views.setTextViewText(R.id.widget_quote_text, displayText)
                views.setTextViewTextSize(
                    R.id.widget_quote_text,
                    TypedValue.COMPLEX_UNIT_SP,
                    fontSizeSp,
                )

                // 2. Set dynamic color styling
                views.setTextColor(R.id.widget_quote_text, theme.quoteColor)
                views.setTextColor(R.id.widget_author_text, "— $author".let {
                    views.setTextViewText(R.id.widget_author_text, it)
                    theme.authorColor
                })
                views.setTextColor(R.id.widget_label, theme.labelColor)

                // 3. PendingIntent for In-Place Reload Button (Triggers broadcast without opening app)
                val refreshIntent = Intent(context, QuoteWidgetProvider::class.java).apply {
                    action = ACTION_REFRESH_QUOTE
                    putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
                }
                val refreshPendingIntent = PendingIntent.getBroadcast(
                    context,
                    appWidgetId + 20000,
                    refreshIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
                )
                views.setOnClickPendingIntent(R.id.widget_btn_refresh, refreshPendingIntent)

                // 4. PendingIntent for Content Area (Opens MainActivity when tapped)
                val openIntent = Intent(context, MainActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                }
                val openPendingIntent = PendingIntent.getActivity(
                    context,
                    appWidgetId,
                    openIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
                )
                views.setOnClickPendingIntent(R.id.widget_content_area, openPendingIntent)

                // Apply update to AppWidgetManager
                appWidgetManager.updateAppWidget(appWidgetId, views)
                Log.d(TAG, "Successfully updated widget id $appWidgetId with theme $themeIndex: '$displayText'")
            } catch (e: Exception) {
                Log.e(TAG, "Error updating widget id $appWidgetId", e)
            }
        }

        fun updateAllWidgets(context: Context) {
            try {
                val appWidgetManager = AppWidgetManager.getInstance(context)
                val componentName = ComponentName(context, QuoteWidgetProvider::class.java)
                val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
                Log.d(TAG, "updateAllWidgets found ${appWidgetIds.size} widgets")
                for (id in appWidgetIds) {
                    updateWidget(context, appWidgetManager, id)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error in updateAllWidgets", e)
            }
        }
    }

    private data class ThemePalette(
        val quoteColor: Int,
        val authorColor: Int,
        val labelColor: Int,
    )
}
