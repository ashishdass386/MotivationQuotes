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
 * Renders quotes dynamically based on the user-selected Widget Template.
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

            // Pick a fresh random quote from native assets
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

    data class WidgetTemplateStyle(
        val backgroundRes: Int,
        val quoteColor: Int,
        val authorColor: Int,
        val labelColor: Int,
        val brandColor: Int,
        val dividerColor: Int,
        val isUppercase: Boolean = false,
        val refreshButtonBgRes: Int = R.drawable.widget_refresh_button_bg,
        val labelText: String = "✦ DAILY MOTIVATION",
    )

    companion object {
        const val ACTION_REFRESH_QUOTE = "com.motiva.dailyquotes.ACTION_REFRESH_QUOTE"
        private const val TAG = "QuoteWidgetProvider"

        // Map of all template designs matching React Native widget templates
        val TEMPLATE_STYLES: Map<String, WidgetTemplateStyle> = mapOf(
            "widget_minimal_white" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_minimal_white,
                quoteColor = Color.parseColor("#0F172A"),
                authorColor = Color.parseColor("#64748B"),
                labelColor = Color.parseColor("#6366F1"),
                brandColor = Color.parseColor("#475569"),
                dividerColor = Color.parseColor("#E2E8F0"),
                refreshButtonBgRes = R.drawable.widget_refresh_btn_light,
                labelText = "MOTIQO • DAILY",
            ),
            "widget_minimal_black" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_minimal_black,
                quoteColor = Color.parseColor("#FFFFFF"),
                authorColor = Color.parseColor("#A1A1AA"),
                labelColor = Color.parseColor("#71717A"),
                brandColor = Color.parseColor("#71717A"),
                dividerColor = Color.parseColor("#27272A"),
                labelText = "MINIMAL • QUOTE",
            ),
            "widget_midnight" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_poster_frame,
                quoteColor = Color.parseColor("#F8FAFC"),
                authorColor = Color.parseColor("#94A3B8"),
                labelColor = Color.parseColor("#A78BFA"),
                brandColor = Color.parseColor("#818CF8"),
                dividerColor = Color.parseColor("#336366F1"),
                labelText = "✦ DAILY MOTIVATION",
            ),
            "widget_soft_beige" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_soft_beige,
                quoteColor = Color.parseColor("#292524"),
                authorColor = Color.parseColor("#78716C"),
                labelColor = Color.parseColor("#D97706"),
                brandColor = Color.parseColor("#78716C"),
                dividerColor = Color.parseColor("#E7E5E4"),
                refreshButtonBgRes = R.drawable.widget_refresh_btn_light,
                labelText = "MOMENT • REFLECTION",
            ),
            "widget_bold_typography" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_bold,
                quoteColor = Color.parseColor("#FFFFFF"),
                authorColor = Color.parseColor("#FCD34D"),
                labelColor = Color.parseColor("#F59E0B"),
                brandColor = Color.parseColor("#F59E0B"),
                dividerColor = Color.parseColor("#F59E0B"),
                isUppercase = true,
                labelText = "⚡ DAILY DRIVE",
            ),
            "widget_elegant_serif" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_emerald,
                quoteColor = Color.parseColor("#ECFDF5"),
                authorColor = Color.parseColor("#6EE7B7"),
                labelColor = Color.parseColor("#34D399"),
                brandColor = Color.parseColor("#10B981"),
                dividerColor = Color.parseColor("#10B981"),
                labelText = "WISDOM • INSPIRATION",
            ),
            "widget_modern_dark" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_modern_dark,
                quoteColor = Color.parseColor("#F1F5F9"),
                authorColor = Color.parseColor("#94A3B8"),
                labelColor = Color.parseColor("#38BDF8"),
                brandColor = Color.parseColor("#38BDF8"),
                dividerColor = Color.parseColor("#38BDF8"),
                labelText = "FOCUS • MOTIQO",
            ),
            "widget_clean_gradient" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_gradient_sunset,
                quoteColor = Color.parseColor("#FFFFFF"),
                authorColor = Color.parseColor("#F472B6"),
                labelColor = Color.parseColor("#EC4899"),
                brandColor = Color.parseColor("#A855F7"),
                dividerColor = Color.parseColor("#F472B6"),
                labelText = "✦ SUNSET INSPIRATION",
            ),
            "widget_glass" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_glass,
                quoteColor = Color.parseColor("#FFFFFF"),
                authorColor = Color.parseColor("#CBD5E1"),
                labelColor = Color.parseColor("#94A3B8"),
                brandColor = Color.parseColor("#94A3B8"),
                dividerColor = Color.parseColor("#4DFFFFFF"),
                labelText = "FROST • PERSPECTIVE",
            ),
            "widget_focus" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_focus,
                quoteColor = Color.parseColor("#FAFAFA"),
                authorColor = Color.parseColor("#71717A"),
                labelColor = Color.parseColor("#A1A1AA"),
                brandColor = Color.parseColor("#52525B"),
                dividerColor = Color.parseColor("#27272A"),
                labelText = "DEEP WORK • REMINDER",
            ),
            "widget_nature" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_emerald,
                quoteColor = Color.parseColor("#F0FDF4"),
                authorColor = Color.parseColor("#86EFAC"),
                labelColor = Color.parseColor("#4ADE80"),
                brandColor = Color.parseColor("#22C55E"),
                dividerColor = Color.parseColor("#22C55E"),
                labelText = "NATURE • SERENITY",
            ),
            "widget_ocean" to WidgetTemplateStyle(
                backgroundRes = R.drawable.widget_bg_gradient_ocean,
                quoteColor = Color.parseColor("#F0FDFA"),
                authorColor = Color.parseColor("#67E8F9"),
                labelColor = Color.parseColor("#2DD4BF"),
                brandColor = Color.parseColor("#06B6D4"),
                dividerColor = Color.parseColor("#06B6D4"),
                labelText = "OCEAN • CALM",
            ),
        )

        fun resolveStyle(templateId: String): WidgetTemplateStyle {
            if (TEMPLATE_STYLES.containsKey(templateId)) {
                return TEMPLATE_STYLES[templateId]!!
            }
            return when {
                templateId.contains("white") || templateId.contains("swiss") || templateId.contains("pure_canvas") ->
                    TEMPLATE_STYLES["widget_minimal_white"]!!
                templateId.contains("beige") || templateId.contains("paper") || templateId.contains("linen") || templateId.contains("cream") ->
                    TEMPLATE_STYLES["widget_soft_beige"]!!
                templateId.contains("glass") ->
                    TEMPLATE_STYLES["widget_glass"]!!
                templateId.contains("ocean") || templateId.contains("pacific") ->
                    TEMPLATE_STYLES["widget_ocean"]!!
                templateId.contains("nature") || templateId.contains("forest") || templateId.contains("pine") || templateId.contains("emerald") ->
                    TEMPLATE_STYLES["widget_nature"]!!
                templateId.contains("focus") || templateId.contains("productivity") ->
                    TEMPLATE_STYLES["widget_focus"]!!
                templateId.contains("bold") || templateId.contains("poster") ->
                    TEMPLATE_STYLES["widget_bold_typography"]!!
                templateId.contains("modern") || templateId.contains("slate") ->
                    TEMPLATE_STYLES["widget_modern_dark"]!!
                templateId.contains("editorial") ->
                    TEMPLATE_STYLES["widget_elegant_serif"]!!
                else ->
                    TEMPLATE_STYLES["widget_minimal_black"]!!
            }
        }

        fun updateWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int,
        ) {
            try {
                val content = QuoteWidgetStorage.getQuoteContent(context)
                val author = QuoteWidgetStorage.getQuoteAuthor(context)
                val templateId = QuoteWidgetStorage.getSelectedTemplateId(context)

                val style = resolveStyle(templateId)

                val views = RemoteViews(context.packageName, R.layout.widget_quote_medium)

                // 1. Dynamic Font Sizing based on Quote Length
                val length = content.trim().length
                val (fontSizeSp, isShort) = when {
                    length <= 45 -> Pair(22f, true)
                    length <= 95 -> Pair(16.5f, false)
                    else -> Pair(13.5f, false)
                }

                val displayText = if (style.isUppercase || (isShort && length <= 35) || templateId.contains("poster")) {
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

                // 2. Apply Template Colors and Visual Design
                views.setInt(R.id.widget_root, "setBackgroundResource", style.backgroundRes)
                views.setTextColor(R.id.widget_quote_text, style.quoteColor)
                views.setTextColor(R.id.widget_author_text, style.authorColor)

                // Author Visibility & Styling
                val isAuthorless = templateId.contains("authorless") ||
                        templateId == "typo_bold_poster_01" ||
                        templateId == "dark_authorless_brutal_04" ||
                        templateId == "minimal_authorless_03" ||
                        templateId == "minimal_quiet_06" ||
                        templateId == "glass_borderless_blur_03" ||
                        templateId == "transparent_authorless_02" ||
                        templateId == "aesthetic_authorless_pure_03" ||
                        templateId == "nature_forest_authorless_03"

                if (isAuthorless) {
                    views.setViewVisibility(R.id.widget_author_text, android.view.View.GONE)
                } else {
                    views.setViewVisibility(R.id.widget_author_text, android.view.View.VISIBLE)
                    val prefix = if (templateId.contains("editorial_serif") || templateId.contains("top_citation")) "WORDS BY "
                        else if (templateId.contains("terminal") || templateId.contains("mono")) "// "
                        else "— "
                    views.setTextViewText(R.id.widget_author_text, "$prefix$author")
                }

                views.setTextColor(R.id.widget_label, style.labelColor)
                views.setTextViewText(R.id.widget_label, style.labelText)
                views.setTextColor(R.id.widget_brand, style.brandColor)
                views.setInt(R.id.widget_divider, "setBackgroundColor", style.dividerColor)
                views.setInt(R.id.widget_btn_refresh, "setBackgroundResource", style.refreshButtonBgRes)

                // 3. In-Place Reload Button PendingIntent
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

                // 4. Content Area Click PendingIntent (Opens MainActivity)
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

                // Apply update
                appWidgetManager.updateAppWidget(appWidgetId, views)
                Log.d(TAG, "Successfully updated widget id $appWidgetId with template '$templateId'")
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
}
