#import "RCTQRDecoder.h"
#import <React/RCTLog.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>
@import MLKit;

@implementation RCTQRDecoder

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(decode:(NSString *)uriString
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSURL *uri = [NSURL URLWithString:uriString];
    NSData *imageData = [NSData dataWithContentsOfURL:uri];
    UIImage *image = [UIImage imageWithData:imageData];
    
    if (!image) {
        NSString *errorMessage = [NSString stringWithFormat:@"Failed to load image from URI: %@", uriString];
        reject(@"IMAGE_ERROR", errorMessage, nil);
        return;
    }
    
    MLKBarcodeScannerOptions *options = [[MLKBarcodeScannerOptions alloc] initWithFormats:MLKBarcodeFormatQRCode | MLKBarcodeFormatAztec];
    MLKVisionImage *visionImage = [[MLKVisionImage alloc] initWithImage:image];
    visionImage.orientation = image.imageOrientation;
    
    MLKBarcodeScanner *barcodeScanner = [MLKBarcodeScanner barcodeScannerWithOptions:options];
    
    [barcodeScanner processImage:visionImage
                      completion:^(NSArray<MLKBarcode *> *barcodes, NSError *error) {
        if (error) {
            NSString *errorMessage = [NSString stringWithFormat:@"QR code scanning failed: %@", error.localizedDescription];
            reject(@"QRCODE_ERROR", errorMessage, error);
            return;
        }
        
        if (barcodes.count == 0) {
            NSString *errorMessage = @"No barcodes found in the image";
            reject(@"NO_QRCODE_FOUND", errorMessage, nil);
            return;
        }
        
        NSMutableArray *barcodeResults = [NSMutableArray array];
        
        for (MLKBarcode *barcode in barcodes) {
            NSMutableDictionary *barcodeDict = [NSMutableDictionary dictionary];
            
            NSString *valueType = [self stringForBarcodeValueType:barcode.valueType];
            barcodeDict[@"valueType"] = valueType;
            barcodeDict[@"rawValue"] = barcode.rawValue;
            
            if (barcode.valueType == MLKBarcodeValueTypeURL) {
                MLKBarcodeURLBookmark *urlBookmark = barcode.URL;
                barcodeDict[@"title"] = urlBookmark.title ?: @"No title";
                barcodeDict[@"url"] = urlBookmark.url ?: @"No URL";
            }
            
            [barcodeResults addObject:barcodeDict];
        }
        
        resolve(barcodeResults);
    }];
}

- (NSString *)stringForBarcodeValueType:(MLKBarcodeValueType)valueType {
    switch (valueType) {
        case MLKBarcodeValueTypeURL:
            return @"URL";
        default:
            return @"Unknown";
    }
}

@end
