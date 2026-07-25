// Obj-C++ bridge: exposes AirhopBLEModule (Swift) to the React Native bridge.
// Uses RCT_EXTERN_MODULE so that Codegen and the New Architecture interop layer
// can both see the module. The Swift class is found automatically via the
// auto-generated Airhop-Swift.h bridging header.
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// REMAP, not RCT_EXTERN_MODULE. The plain macro passes an empty JS name, so RN
// falls back to the Objective-C class name and registers this as
// "AirhopBLEModule" - it only strips an "RCT"/"RK" prefix, never a "Module"
// suffix. The spec (src/bridge/NativeAirhopBLE.ts) and the Android module both
// use "AirhopBLE", so the two platforms were registering the same module under
// different names. Remapping pins the JS name to the one both sides agree on.
@interface RCT_EXTERN_REMAP_MODULE(AirhopBLE, AirhopBLEModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startAdvertising:(NSString *)serviceUUID
                  localName:(NSString *)localName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopAdvertising:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startScanning:(NSArray<NSString *> *)serviceUUIDs
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopScanning:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isAdapterEnabled:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(writeToLink:(NSString *)linkID
                  dataBase64:(NSString *)dataBase64
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getTorProxyPort:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getTorAvailability:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
