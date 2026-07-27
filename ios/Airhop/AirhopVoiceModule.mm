// Obj-C++ bridge: exposes AirhopVoiceModule (Swift) to the React Native bridge.
// Counterpart to AirhopMCModule.mm. Same pattern, same method set as
// AirhopVoiceModule.kt on Android, so one spec (src/bridge/NativeAirhopVoice.ts)
// covers both platforms.
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_REMAP_MODULE(AirhopVoice, AirhopVoiceModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startCapture:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopCapture:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startPlayback:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(enqueueFrames:(NSArray *)framesBase64
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopPlayback:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
