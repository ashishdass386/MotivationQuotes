package com.motiva.dailyquotes.widget

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import org.json.JSONArray
import kotlin.random.Random

data class WidgetQuote(
    val id: String,
    val content: String,
    val author: String,
    val themeIndex: Int = 0,
)

/**
 * Reads and writes quote data to SharedPreferences and loads random quotes from bundled assets.
 * Operates independently of the React Native runtime.
 */
object QuoteWidgetStorage {

    private const val TAG = "QuoteWidgetStorage"
    private const val PREFS_NAME = "com.motiva.dailyquotes.widget.prefs"
    private const val KEY_QUOTE_ID = "widget_quote_id"
    private const val KEY_QUOTE_CONTENT = "widget_quote_content"
    private const val KEY_QUOTE_AUTHOR = "widget_quote_author"
    private const val KEY_THEME_INDEX = "widget_theme_index"
    private const val KEY_LAST_UPDATED = "widget_last_updated"

    // In-memory cache of quotes loaded from assets
    private var cachedQuotes: List<Triple<String, String, String>>? = null

    private fun getPrefs(context: Context): SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun saveQuote(
        context: Context,
        quoteId: String,
        content: String,
        author: String,
        themeIndex: Int = -1,
    ) {
        val nextTheme = if (themeIndex >= 0) themeIndex else (getThemeIndex(context) + 1) % 5
        getPrefs(context).edit().apply {
            putString(KEY_QUOTE_ID, quoteId)
            putString(KEY_QUOTE_CONTENT, content)
            putString(KEY_QUOTE_AUTHOR, author)
            putInt(KEY_THEME_INDEX, nextTheme)
            putLong(KEY_LAST_UPDATED, System.currentTimeMillis())
            apply()
        }
    }

    fun getQuoteContent(context: Context): String =
        getPrefs(context).getString(KEY_QUOTE_CONTENT, "YOU CAN DO IT.")
            ?: "YOU CAN DO IT."

    fun getQuoteAuthor(context: Context): String =
        getPrefs(context).getString(KEY_QUOTE_AUTHOR, "Motiva")
            ?: "Motiva"

    fun getQuoteId(context: Context): String =
        getPrefs(context).getString(KEY_QUOTE_ID, "") ?: ""

    fun getThemeIndex(context: Context): Int =
        getPrefs(context).getInt(KEY_THEME_INDEX, 0)

    fun hasQuote(context: Context): Boolean =
        getPrefs(context).contains(KEY_QUOTE_CONTENT)

    private fun loadQuotesFromAssets(context: Context): List<Triple<String, String, String>> {
        cachedQuotes?.let { return it }

        return try {
            val jsonString = context.assets.open("quotes.json").bufferedReader().use { it.readText() }
            val jsonArray = JSONArray(jsonString)
            val list = ArrayList<Triple<String, String, String>>(jsonArray.length())
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                val id = obj.optString("_id", "$i")
                val content = obj.optString("content", "")
                val author = obj.optString("author", "Motiva")
                if (content.isNotBlank()) {
                    list.add(Triple(id, content, author))
                }
            }
            cachedQuotes = list
            Log.d(TAG, "Loaded ${list.size} quotes from assets")
            list
        } catch (e: Exception) {
            Log.e(TAG, "Failed to load quotes from assets", e)
            emptyList()
        }
    }

    fun getNextRandomQuote(context: Context): WidgetQuote {
        val quotes = loadQuotesFromAssets(context)
        val currentId = getQuoteId(context)

        val nextTriple = if (quotes.isNotEmpty()) {
            var candidate = quotes[Random.nextInt(quotes.size)]
            var attempts = 0
            while (candidate.first == currentId && attempts < 10) {
                candidate = quotes[Random.nextInt(quotes.size)]
                attempts++
            }
            candidate
        } else {
            Triple("default-1", "Believe you can and you're halfway there.", "Theodore Roosevelt")
        }

        val nextTheme = (getThemeIndex(context) + 1 + Random.nextInt(2)) % 5
        saveQuote(context, nextTriple.first, nextTriple.second, nextTriple.third, nextTheme)

        return WidgetQuote(
            id = nextTriple.first,
            content = nextTriple.second,
            author = nextTriple.third,
            themeIndex = nextTheme,
        )
    }
}
