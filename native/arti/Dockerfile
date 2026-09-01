# syntax=docker/dockerfile:1
# Pinned build environment for Airhop's Android Tor libraries.
#
# The base image, Debian packages, NDK, Rust, and cargo-ndk are all pinned.
# Rebuilding from the same commit produces reproducible library outputs.
#
# Apple slices are built separately by build-apple.sh.
# Built through build-in-container.sh.

FROM rust:1.98.0-slim-trixie@sha256:17d1ba895198f9934c6314ec5346a0d5115372f3243390c3d731e242f35c2f27

SHELL ["/bin/bash", "-euo", "pipefail", "-c"]

# Build configuration used to pin the toolchain and package versions.
COPY TOOLCHAIN.env /tmp/TOOLCHAIN.env

# Use a fixed Debian snapshot so package versions do not change between builds.
# Check-Valid-Until is disabled because the snapshot is intentionally frozen.
RUN source /tmp/TOOLCHAIN.env \
    && printf '%s\n' \
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
        unzip \
    && rm -rf /var/lib/apt/lists/*

# Download the NDK and verify it before installation.
RUN source /tmp/TOOLCHAIN.env \
    && curl -fsSL "https://dl.google.com/android/repository/${ANDROID_NDK_ARCHIVE}" \
        -o "/tmp/${ANDROID_NDK_ARCHIVE}" \
    && echo "${ANDROID_NDK_SHA256}  /tmp/${ANDROID_NDK_ARCHIVE}" | sha256sum -c - \
    && unzip -q "/tmp/${ANDROID_NDK_ARCHIVE}" -d /opt \
    && rm "/tmp/${ANDROID_NDK_ARCHIVE}" \
    && ndk_dir="$(ls -d /opt/android-ndk-*)" \
    && test "$(sed -n 's/^Pkg.Revision *= *//p' "$ndk_dir/source.properties" | tr -d '\r')" = "$ANDROID_NDK_VERSION" \
    && ln -s "$ndk_dir" /opt/android-ndk

# Verify the compiler version and install the pinned cargo-ndk version.
RUN source /tmp/TOOLCHAIN.env \
    && test "$(rustc --version | awk '{print $2}')" = "$RUST_VERSION" \
    && cargo install cargo-ndk --version "$CARGO_NDK_VERSION" --locked \
    && rustup target add \
        aarch64-linux-android \
        armv7-linux-androideabi \
        x86_64-linux-android

ENV ANDROID_NDK_HOME=/opt/android-ndk
ENV PATH=/usr/local/cargo/bin:${PATH}
ENV TZ=UTC
ENV LC_ALL=C.UTF-8

WORKDIR /workspace

ENTRYPOINT ["/bin/bash", "native/arti/build-android.sh"]
