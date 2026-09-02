# syntax=docker/dockerfile:1

# Pinned build environment for Airhop's Android Tor libraries.
#
# The base image, Debian packages, NDK, Rust, cargo-ndk, Go, JDK, and Android
# platform jar are pinned to keep library outputs reproducible.
#
# Two toolchains are required because the Tor client and pluggable transports
# are written in Rust and Go. See TOOLCHAIN.env.
#
# Build arguments are passed individually by build-in-container.sh instead of
# sourcing TOOLCHAIN.env here. This keeps unrelated Docker layers cached when
# a single toolchain pin changes.
#
# Apple slices are built separately by build-apple.sh.
# Built through build-in-container.sh.

FROM rust:1.98.0-slim-trixie@sha256:17d1ba895198f9934c6314ec5346a0d5115372f3243390c3d731e242f35c2f27

SHELL ["/bin/bash", "-euo", "pipefail", "-c"]

# Use a fixed Debian snapshot so package versions do not change between builds.
# Check-Valid-Until is disabled because the snapshot is intentionally frozen.
#
# openjdk is required by gomobile to compile the generated Java bindings.
# It is installed from the same snapshot as the other system packages.
ARG DEBIAN_SNAPSHOT
RUN printf '%s\n' \
        'Types: deb' \
        "URIs: https://snapshot.debian.org/archive/debian/${DEBIAN_SNAPSHOT}" \
        'Suites: trixie trixie-updates' \
        'Components: main' \
        'Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg' \
        'Check-Valid-Until: no' \
        '' \
        'Types: deb' \
        "URIs: https://snapshot.debian.org/archive/debian-security/${DEBIAN_SNAPSHOT}" \
        'Suites: trixie-security' \
        'Components: main' \
        'Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg' \
        'Check-Valid-Until: no' \
        > /etc/apt/sources.list.d/debian.sources \
    && rm -f /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        binutils \
        ca-certificates \
        curl \
        openjdk-21-jdk-headless \
        unzip \
    && rm -rf /var/lib/apt/lists/*

# Download the NDK and verify it before installation.
ARG ANDROID_NDK_ARCHIVE
ARG ANDROID_NDK_SHA256
ARG ANDROID_NDK_VERSION
RUN curl -fsSL "https://dl.google.com/android/repository/${ANDROID_NDK_ARCHIVE}" \
        -o "/tmp/${ANDROID_NDK_ARCHIVE}" \
    && echo "${ANDROID_NDK_SHA256}  /tmp/${ANDROID_NDK_ARCHIVE}" | sha256sum -c - \
    && unzip -q "/tmp/${ANDROID_NDK_ARCHIVE}" -d /opt \
    && rm "/tmp/${ANDROID_NDK_ARCHIVE}" \
    && ndk_dir="$(ls -d /opt/android-ndk-*)" \
    && test "$(sed -n 's/^Pkg.Revision *= *//p' "$ndk_dir/source.properties" | tr -d '\r')" = "$ANDROID_NDK_VERSION" \
    && ln -s "$ndk_dir" /opt/android-ndk

# Install the Android platform jar used by gomobile for generated Java bindings.
# The package is unpacked directly to avoid sdkmanager resolving versions at
# build time.
#
# SHA1 is used because Google publishes platform package checksums this way.
ARG ANDROID_PLATFORM_ARCHIVE
ARG ANDROID_PLATFORM_SHA1
ARG ANDROID_PLATFORM_API
RUN curl -fsSL "https://dl.google.com/android/repository/${ANDROID_PLATFORM_ARCHIVE}" \
        -o "/tmp/${ANDROID_PLATFORM_ARCHIVE}" \
    && echo "${ANDROID_PLATFORM_SHA1}  /tmp/${ANDROID_PLATFORM_ARCHIVE}" | sha1sum -c - \
    && mkdir -p /opt/android-sdk/platforms /tmp/platform \
    && unzip -q "/tmp/${ANDROID_PLATFORM_ARCHIVE}" -d /tmp/platform \
    && mv "$(ls -d /tmp/platform/*/)" "/opt/android-sdk/platforms/android-${ANDROID_PLATFORM_API}" \
    && rm -rf "/tmp/${ANDROID_PLATFORM_ARCHIVE}" /tmp/platform \
    && test -f "/opt/android-sdk/platforms/android-${ANDROID_PLATFORM_API}/android.jar"

# Verify the Rust compiler and install the pinned cargo-ndk version.
ARG RUST_VERSION
ARG CARGO_NDK_VERSION
RUN test "$(rustc --version | awk '{print $2}')" = "$RUST_VERSION" \
    && cargo install cargo-ndk --version "$CARGO_NDK_VERSION" --locked \
    && rustup target add \
        aarch64-linux-android \
        armv7-linux-androideabi \
        x86_64-linux-android

# Download Go and verify it before installation.
ARG GO_ARCHIVE
ARG GO_SHA256
ARG GO_VERSION
RUN curl -fsSL "https://go.dev/dl/${GO_ARCHIVE}" -o "/tmp/${GO_ARCHIVE}" \
    && echo "${GO_SHA256}  /tmp/${GO_ARCHIVE}" | sha256sum -c - \
    && tar -C /opt -xzf "/tmp/${GO_ARCHIVE}" \
    && rm "/tmp/${GO_ARCHIVE}" \
    && test "$(/opt/go/bin/go env GOVERSION)" = "go${GO_VERSION}"

# Use the pinned NDK and Android SDK locations.
ENV ANDROID_NDK_HOME=/opt/android-ndk
ENV ANDROID_HOME=/opt/android-sdk

# Prevent Go from automatically downloading a different toolchain.
ENV GOTOOLCHAIN=local

ENV PATH=/usr/local/cargo/bin:/opt/go/bin:${PATH}
ENV TZ=UTC
ENV LC_ALL=C.UTF-8

WORKDIR /workspace

ENTRYPOINT ["/bin/bash", "native/arti/build-android.sh"]
