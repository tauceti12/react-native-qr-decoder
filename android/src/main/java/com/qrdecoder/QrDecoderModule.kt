package com.qrdecoder

import android.net.Uri
import android.util.Log
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise

class QRDecoder(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val options = BarcodeScannerOptions.Builder()
            .setBarcodeFormats(
                    Barcode.FORMAT_QR_CODE,
                    Barcode.FORMAT_AZTEC
            ).build()

    private val scanner = BarcodeScanning.getClient(options)

    override fun getName(): String {
        return "BarcodeScanner"
    }

    @ReactMethod
    fun decode(uriString: String, promise: Promise) {
        val uri = Uri.parse(uriString)
        val image = InputImage.fromFilePath(reactApplicationContext, uri)

        scanner.process(image)
                .addOnSuccessListener { barcodes ->
                    val barcodeList = Arguments.createArray()
                    Log.d("BARCODES", barcodes.toString())
                    for (barcode in barcodes) {
                        val valueType = barcode.valueType
                        when (valueType) {
                            Barcode.TYPE_URL -> {
                                val title = barcode.url?.title ?: "No title"
                                val url = barcode.url?.url ?: "No URL"
                                val barcodeMap = Arguments.createMap()
                                barcodeMap.putString("name", title)
                                barcodeMap.putString("url", url)
                                barcodeList.pushMap(barcodeMap)
                            }
                        }
                    }

                    promise.resolve(barcodeList)
                }
                .addOnFailureListener { exception ->
                    promise.reject("BARCODE_ERROR", exception.localizedMessage, exception)
                }
    }
}
