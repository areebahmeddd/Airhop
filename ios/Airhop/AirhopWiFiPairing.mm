// Obj-C++ bridge: exposes AirhopWiFiPairing (Swift) to the React Native bridge.
//
// iOS only, and there is no Android counterpart on purpose. Pairing is a
// precondition to having Wi-Fi Aware links on this platform, not a property of
// a link, so it stays out of the transport contract both platforms share. See
// AirhopWiFiPairing.swift.
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AirhopWiFiPairing, RCTEventEmitter)

RCT_EXTERN_METHOD(getPairingState:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(presentPairing:(NSString *)mode
                  actionLabel:(NSString *)actionLabel
                  cancelLabel:(NSString *)cancelLabel
                  unavailableLabel:(NSString *)unavailableLabel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
