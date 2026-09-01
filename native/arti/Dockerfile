# The pinned environment that builds Airhop's Android Tor libraries.
#
# Everything that can drift is nailed down: the base image by digest, the Debian
# archive by snapshot timestamp, the NDK by checksum, and Rust and cargo-ndk by
# version. Two runs of this container from the same commit produce byte-identical
# libraries, which is what makes SHA256SUMS.android worth checking.
#
# Apple slices are not built here. See build-apple.sh for why.
#
# Driven by build-in-container.sh, never run directly.

# syntax=docker/dockerfile:1
FROM rust:1.98.0-slim-trixie

SHELL ["/bin/bash", "-euo", "pipefail", "-c"]

# The build context is native/arti, not the repository root, so this is the only
# file the image needs at build time. The crate itself arrives on a volume mount
# at run time, which is what lets an edit be rebuilt without rebuilding the
# image. Keeping the context small also stops Docker shipping node_modules and
# the whole git history to the daemon on every run.
COPY TOOLCHAIN.env /tmp/TOOLCHAIN.env

# An immutable Debian archive rather than the rolling mirror, so a rebuild six
# months from now installs the same package versions rather than whatever is
# current. Check-Valid-Until is off because a frozen snapshot is expired by
# definition and that is the intent.
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

# The NDK is verified by checksum before it is trusted with anything. A download
# over HTTPS proves who served it, not what it is.
RUN source /tmp/TOOLCHAIN.env \
    && curl -fsSL "https://dl.google.com/android/repository/${ANDROID_NDK_ARCHIVE}" \
        -o "/tmp/${ANDROID_NDK_ARCHIVE}" \
    && echo "${ANDROID_NDK_SHA256}  /tmp/${ANDROID_NDK_ARCHIVE}" | sha256sum -c - \
    && unzip -q "/tmp/${ANDROID_NDK_ARCHIVE}" -d /opt \
    && rm "/tmp/${ANDROID_NDK_ARCHIVE}" \
    && ndk_dir="$(ls -d /opt/android-ndk-*)" \
    && test "$(sed -n 's/^Pkg.Revision *= *//p' "$ndk_dir/source.properties" | tr -d '\r')" = "$ANDROID_NDK_VERSION" \
    && ln -s "$ndk_dir" /opt/android-ndk

# The base image already carries the pinned Rust. Assert it rather than assume
# it, so a base-image bump that changes the compiler fails here instead of
# silently producing different bytes.
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
