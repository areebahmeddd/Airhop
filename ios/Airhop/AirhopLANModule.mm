// Obj-C++ bridge: exposes AirhopLANModule (Swift) to the React Native bridge.
// Same pattern as AirhopWiFiModule.mm, and the same method set as
// AirhopLANModule.kt on Android, so one spec (src/bridge/NativeAirhopLAN.ts)
// covers both platforms.
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_REMAP_MODULE(AirhopLAN, AirhopLANModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startLAN:(NSString *)instanceName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopLAN:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(connectToPeer:(NSString *)serviceName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(writeToLANLink:(NSString *)linkID
                  dataBase64:(NSString *)dataBase64
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
