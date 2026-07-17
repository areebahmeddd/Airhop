// AirhopTorModule.mm
//
// Objective-C bridge for AirhopTorModule.swift.
// Registers the module with React Native and declares all exported methods
// so the RN codegen can include them in the JS bundle.

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

RCT_EXTERN_MODULE(AirhopTorModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startTor:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopTor:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getTorStatus:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(awaitTorReady:(double)timeoutSeconds
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
