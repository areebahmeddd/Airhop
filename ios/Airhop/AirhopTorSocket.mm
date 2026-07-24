// AirhopTorSocket.mm
//
// Objective-C bridge for AirhopTorSocket.swift. Registers the module with
// React Native and declares the exported methods so the RN bridge can invoke
// them. connect/send/close are fire-and-forget: results and frames come back
// asynchronously as `TorSocketEvent` emitter events, keyed by connection id.

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AirhopTorSocket, RCTEventEmitter)

RCT_EXTERN_METHOD(connect:(NSString *)id url:(NSString *)url)

RCT_EXTERN_METHOD(send:(NSString *)id data:(NSString *)data)

RCT_EXTERN_METHOD(close:(NSString *)id
                  code:(nonnull NSNumber *)code
                  reason:(NSString *)reason)

@end
