
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNQrDecoderSpec.h"

@interface QrDecoder : NSObject <NativeQrDecoderSpec>
#else
#import <React/RCTBridgeModule.h>

@interface QrDecoder : NSObject <RCTBridgeModule>
#endif

@end
