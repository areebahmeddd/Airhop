Pod::Spec.new do |s|
  s.name             = 'Arti'
  s.version          = '1.0.0'
  s.summary          = "Airhop's embedded Tor client"
  s.description      = <<~DESC
    Binary xcframework wrapping Airhop's Arti-based Tor client.

    Built from native/arti by native/arti/build-apple.sh, not vendored from
    upstream: the Rust source, the pinned toolchain and the checksum manifest
    all live in this repository. Exposes a five-function C ABI (airhop_tor_start,
    airhop_tor_stop, airhop_tor_set_dormant, airhop_tor_status,
    airhop_tor_summary) consumed by AirhopTorManager.swift through @_silgen_name.

    The header beside the library is generated from native/arti/src/ffi.rs by
    cbindgen, so it cannot disagree with the Rust it describes.
  DESC
  s.homepage         = 'https://gitlab.torproject.org/tpo/core/arti'
  s.license          = { :type => 'MIT OR Apache-2.0' }
  s.author           = { 'Tor Project' => 'https://www.torproject.org' }
  s.platform         = :ios, '16.4'

  s.source             = { :path => '.' }
  s.vendored_frameworks = 'Frameworks/arti.xcframework'

  # System libraries the Rust links against.
  #
  # sqlite3 is very likely redundant now: the crate is built with arti-client's
  # `static-sqlite`, and the Android library produced from the same source has no
  # undefined sqlite symbols at all. It is kept until a macOS build confirms the
  # same there, because linking a library nothing references costs nothing while
  # removing one that is needed breaks the build for whoever runs it next.
  s.libraries = 'resolv', 'z', 'sqlite3'
end
