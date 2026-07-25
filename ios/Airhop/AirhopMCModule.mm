// Obj-C++ bridge: exposes AirhopMCModule (Swift) to the React Native bridge.
// Counterpart to AirhopBLEModule.mm. Same pattern, same method set.
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// REMAP so this registers as "AirhopWiFi", the name the spec
// (src/bridge/NativeAirhopWiFi.ts) asks for and the name AirhopWiFiModule.kt
// reports on Android. The class keeps its platform-accurate name - this is
// MultipeerConnectivity, not WiFi Aware - while JS sees one transport under one
// name on both platforms. See the note in AirhopBLEModule.mm.
@interface RCT_EXTERN_REMAP_MODULE(AirhopWiFi, AirhopMCModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startWiFi:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopWiFi:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(writeToWiFiLink:(NSString *)linkID
                  dataBase64:(NSString *)dataBase64
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
