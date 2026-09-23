package com.motiva.dailyquotes.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Native module exposing widget save/update APIs to React Native JavaScript.
 *
 * Called from TypeScript via src/native/QuoteWidget.ts
 */
class QuoteWidgetModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "QuoteWidgetModule"

    /**
     * Save a new quote to native SharedPreferences.
     * This must be called before updateWidget() to ensure the widget shows the latest quote.
     */
    @ReactMethod
    fun saveQuote(quoteId: String, content: String, author: String, promise: Promise) {
        try {
            QuoteWidgetStorage.saveQuote(reactContext, quoteId, content, author)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("WIDGET_SAVE_ERROR", e.message ?: "Failed to save quote", e)
        }
    }

    /**
     * Trigger a widget UI refresh using the currently saved quote.
     */
    @ReactMethod
    fun updateWidget(promise: Promise) {
        try {
            QuoteWidgetProvider.updateAllWidgets(reactContext.applicationContext)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("WIDGET_UPDATE_ERROR", e.message ?: "Failed to update widget", e)
        }
    }
}
