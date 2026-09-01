//! The JNI surface, consumed by
//! `android/app/src/main/java/org/onemindlabs/airhop/tor/ArtiNative.kt`.
//!
//! The same five operations the C ABI exposes, in the shape JNI wants. Nothing
//! platform-specific happens above this file, so a behaviour difference between
//! the two phones can only come from the app layer, never from Tor.
//!
//! There is no log callback: `status` reports the same thing as data, so
//! nothing has to pattern match log lines and no `GlobalRef` has to stay alive
//! across threads.

use jni::objects::{JClass, JString};
use jni::sys::{jboolean, jint, jstring, JNI_TRUE};
use jni::JNIEnv;

#[no_mangle]
pub extern "system" fn Java_org_onemindlabs_airhop_tor_ArtiNative_nativeStart(
    mut env: JNIEnv,
    _class: JClass,
    data_dir: JString,
    socks_port: jint,
) -> jint {
    let Ok(dir) = env.get_string(&data_dir) else {
        return crate::AIRHOP_TOR_ERR_DATA_DIR;
    };
    let dir: String = dir.into();
    // A port outside the u16 range is a caller bug, not something to clamp
    // into a port nobody asked for.
    if !(1..=65535).contains(&socks_port) {
        return crate::AIRHOP_TOR_ERR_BIND;
    }
    crate::start(&dir, socks_port as u16)
}

#[no_mangle]
pub extern "system" fn Java_org_onemindlabs_airhop_tor_ArtiNative_nativeStop(
    _env: JNIEnv,
    _class: JClass,
) -> jint {
    crate::stop()
}

#[no_mangle]
pub extern "system" fn Java_org_onemindlabs_airhop_tor_ArtiNative_nativeSetDormant(
    _env: JNIEnv,
    _class: JClass,
    dormant: jboolean,
) -> jint {
    crate::set_dormant(dormant == JNI_TRUE)
}

#[no_mangle]
pub extern "system" fn Java_org_onemindlabs_airhop_tor_ArtiNative_nativeStatus(
    _env: JNIEnv,
    _class: JClass,
) -> jint {
    // The same packing the C ABI returns, so the Swift and Kotlin decoders are
    // reading one format, not two that have to be kept in step.
    crate::packed_status()
}

#[no_mangle]
pub extern "system" fn Java_org_onemindlabs_airhop_tor_ArtiNative_nativeSummary(
    env: JNIEnv,
    _class: JClass,
) -> jstring {
    match env.new_string(crate::status().summary) {
        Ok(s) => s.into_raw(),
        // Allocation failed, which on a JVM means an exception is already
        // pending. Returning null lets Kotlin see an empty summary rather than
        // this frame trying to decide what to do about it.
        Err(_) => std::ptr::null_mut(),
    }
}
