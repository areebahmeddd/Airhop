Pod::Spec.new do |s|
  s.name             = 'Arti'
  s.version          = '1.0.0'
  s.summary          = 'Arti Tor client xcframework for Airhop'
  s.description      = <<~DESC
    Binary xcframework wrapping the Arti Rust Tor client.
    Exposes a C ABI (arti_start, arti_stop, arti_is_running,
    arti_bootstrap_progress, arti_bootstrap_summary) consumed by
    AirhopTorManager.swift via @_silgen_name FFI declarations.
  DESC
  s.homepage         = 'https://gitlab.torproject.org/tpo/core/arti'
  s.license          = { :type => 'MIT OR Apache-2.0' }
  s.author           = { 'Tor Project' => 'https://www.torproject.org' }
  s.platform         = :ios, '16.4'

  s.source             = { :path => '.' }
  s.vendored_frameworks = 'Frameworks/arti.xcframework'

  # Arti (Rust) links against these system libraries at runtime.
  s.libraries = 'resolv', 'z', 'sqlite3'
end
