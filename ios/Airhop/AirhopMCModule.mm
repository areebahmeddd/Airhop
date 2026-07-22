// Obj-C++ bridge: exposes AirhopMCModule (Swift) to the React Native bridge.
// Counterpart to AirhopBLEModule.mm. Same pattern, same method set.
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

RCT_EXTERN_MODULE(AirhopMCModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startWiFi:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopWiFi:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(writeToWiFiLink:(NSString *)linkID
                  dataBase64:(NSString *)dataBase64
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
