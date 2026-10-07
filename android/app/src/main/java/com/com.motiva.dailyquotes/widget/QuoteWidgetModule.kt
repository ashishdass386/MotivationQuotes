package com.motiva.dailyquotes.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Native module exposing widget save/update, template selection, and pin APIs to React Native JavaScript.
 *
 * Called from TypeScript via src/native/QuoteWidget.ts
 */
class QuoteWidgetModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "QuoteWidgetModule"

    /**
     * Save a new quote to native SharedPreferences.
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
     * Trigger a widget UI refresh using the currently saved quote and template.
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

    /**
     * Set the active widget template and immediately update all widgets on the home screen.
     */
    @ReactMethod
    fun setWidgetTemplate(templateId: String, promise: Promise) {
        try {
            QuoteWidgetStorage.setSelectedTemplateId(reactContext, templateId)
            QuoteWidgetProvider.updateAllWidgets(reactContext.applicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("WIDGET_TEMPLATE_ERROR", e.message ?: "Failed to set widget template", e)
        }
    }

    /**
     * Get the active widget template ID.
     */
    @ReactMethod
    fun getWidgetTemplate(promise: Promise) {
        try {
            val id = QuoteWidgetStorage.getSelectedTemplateId(reactContext)
            promise.resolve(id)
        } catch (e: Exception) {
            promise.reject("WIDGET_TEMPLATE_ERROR", e.message ?: "Failed to get widget template", e)
        }
    }

    /**
     * Set the active lock screen template ID in native SharedPreferences.
     */
    @ReactMethod
    fun setLockScreenTemplate(templateId: String, promise: Promise) {
        try {
            QuoteWidgetStorage.setSelectedLockScreenTemplateId(reactContext, templateId)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("LOCKSCREEN_TEMPLATE_ERROR", e.message ?: "Failed to set lock screen template", e)
        }
    }

    /**
     * Get the active lock screen template ID.
     */
    @ReactMethod
    fun getLockScreenTemplate(promise: Promise) {
        try {
            val id = QuoteWidgetStorage.getSelectedLockScreenTemplateId(reactContext)
            promise.resolve(id)
        } catch (e: Exception) {
            promise.reject("LOCKSCREEN_TEMPLATE_ERROR", e.message ?: "Failed to get lock screen template", e)
        }
    }

    /**
     * Requests the launcher to pin the Motiva widget to the home screen (Android 8.0+).
     */
    @ReactMethod
    fun pinWidget(promise: Promise) {
        try {
            val appWidgetManager = AppWidgetManager.getInstance(reactContext)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && appWidgetManager.isRequestPinAppWidgetSupported) {
                val provider = ComponentName(reactContext, QuoteWidgetProvider::class.java)
                val success = appWidgetManager.requestPinAppWidget(provider, null, null)
                promise.resolve(success)
            } else {
                promise.resolve(false)
            }
        } catch (e: Exception) {
            promise.reject("PIN_WIDGET_ERROR", e.message ?: "Failed to pin widget", e)
        }
    }

    /**
     * Returns the count of Motiva widgets currently placed on the device launcher.
     */
    @ReactMethod
    fun getInstalledWidgetsCount(promise: Promise) {
        try {
            val appWidgetManager = AppWidgetManager.getInstance(reactContext)
            val provider = ComponentName(reactContext, QuoteWidgetProvider::class.java)
            val ids = appWidgetManager.getAppWidgetIds(provider)
            promise.resolve(ids.size)
        } catch (e: Exception) {
            promise.reject("WIDGET_COUNT_ERROR", e.message ?: "Failed to get widget count", e)
        }
    }
}
