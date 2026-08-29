// Obj-C++ bridge: exposes AirhopWiFiModule (Swift) to the React Native bridge.
// Same pattern as AirhopBLEModule.mm, and the same method set as
// AirhopWiFiModule.kt on Android, so one spec (src/bridge/NativeAirhopWiFi.ts)
// covers both platforms.
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_REMAP_MODULE(AirhopWiFi, AirhopWiFiModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startWiFi:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopWiFi:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(writeToWiFiLink:(NSString *)linkID
                  dataBase64:(NSString *)dataBase64
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
