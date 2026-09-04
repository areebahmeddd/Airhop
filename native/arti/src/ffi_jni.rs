//! The JNI surface, consumed by
//! `android/app/src/main/java/org/onemindlabs/airhop/tor/ArtiNative.kt`.
//!
//! The same operations the C ABI exposes, in the shape JNI wants. Nothing
//! platform-specific happens above this file, so a behaviour difference between
//! the two phones can only come from the app layer, never from Tor.
//!
//! There is no log callback: `status` reports the same thing as data, so
//! nothing has to pattern match log lines and no `GlobalRef` has to stay alive
//! across threads.
//!
//! Every entry point runs inside `crate::catch_panic`: unwinding into a JNI
//! frame is undefined behaviour.

use jni::objects::{JClass, JString};
use jni::sys::{jboolean, jint, jstring, JNI_TRUE};
use jni::JNIEnv;

#[no_mangle]
pub extern "system" fn Java_org_onemindlabs_airhop_tor_ArtiNative_nativeStart(
    mut env: JNIEnv,
    _class: JClass,
    data_dir: JString,
    socks_port: jint,
    bridge_lines: JString,
    obfs4_port: jint,
    snowflake_port: jint,
) -> jint {
    crate::catch_panic(crate::AIRHOP_TOR_ERR_PANIC, || {
        let Ok(dir) = env.get_string(&data_dir) else {
            return crate::AIRHOP_TOR_ERR_DATA_DIR;
        };
        let dir: String = dir.into();
        // A port outside the u16 range is a caller bug, not something to clamp
        // into a port nobody asked for.
        if !(1..=65535).contains(&socks_port) {
            return crate::AIRHOP_TOR_ERR_BIND;
        }
        // A transport port of 0 is meaningful: it says that transport is not
        // running.
        if !(0..=65535).contains(&obfs4_port) || !(0..=65535).contains(&snowflake_port) {
            return crate::AIRHOP_TOR_ERR_BRIDGE_TRANSPORT;
        }
        let lines: String = if bridge_lines.is_null() {
            String::new()
        } else {
            match env.get_string(&bridge_lines) {
                Ok(s) => s.into(),
                Err(_) => return crate::AIRHOP_TOR_ERR_BRIDGE_LINE,
            }
        };
        crate::start(
            &dir,
            socks_port as u16,
            &lines,
            crate::TransportPorts {
                obfs4: obfs4_port as u16,
                snowflake: snowflake_port as u16,
            },
        )
    })
}

#[no_mangle]
pub extern "system" fn Java_org_onemindlabs_airhop_tor_ArtiNative_nativeStop(
    _env: JNIEnv,
    _class: JClass,
) -> jint {
    crate::catch_panic(crate::AIRHOP_TOR_ERR_PANIC, crate::stop)
}

#[no_mangle]
pub extern "system" fn Java_org_onemindlabs_airhop_tor_ArtiNative_nativeSetDormant(
    _env: JNIEnv,
    _class: JClass,
    dormant: jboolean,
) -> jint {
    crate::catch_panic(crate::AIRHOP_TOR_ERR_PANIC, || {
        crate::set_dormant(dormant == JNI_TRUE)
    })
}

#[no_mangle]
pub extern "system" fn Java_org_onemindlabs_airhop_tor_ArtiNative_nativeStatus(
    _env: JNIEnv,
    _class: JClass,
) -> jint {
    // The same packing the C ABI returns, so the Swift and Kotlin decoders are
    // reading one format, not two that have to be kept in step. The fallback is
    // a stopped client: a status word has no value a caller could read as an
    // error, and "not running" is the safe answer as well as the true one.
    crate::catch_panic(0, crate::packed_status)
}

#[no_mangle]
pub extern "system" fn Java_org_onemindlabs_airhop_tor_ArtiNative_nativeSummary(
    env: JNIEnv,
    _class: JClass,
) -> jstring {
    crate::catch_panic(std::ptr::null_mut(), || {
        match env.new_string(crate::status().summary) {
            Ok(s) => s.into_raw(),
            // Allocation failed, so a JVM exception is already pending. Null
            // lets Kotlin see an empty summary instead of deciding here.
            Err(_) => std::ptr::null_mut(),
        }
    })
}
