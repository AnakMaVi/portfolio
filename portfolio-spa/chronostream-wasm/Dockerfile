FROM rust:1.96-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        binaryen \
        pkg-config \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

ARG WASM_PACK_VERSION=0.15.0
RUN curl -sSL "https://github.com/rustwasm/wasm-pack/releases/download/v${WASM_PACK_VERSION}/wasm-pack-v${WASM_PACK_VERSION}-x86_64-unknown-linux-musl.tar.gz" \
    | tar -xz -C /tmp \
    && mv "/tmp/wasm-pack-v${WASM_PACK_VERSION}-x86_64-unknown-linux-musl/wasm-pack" /usr/local/bin/wasm-pack \
    && chmod +x /usr/local/bin/wasm-pack \
    && rm -rf /tmp/wasm-pack-v${WASM_PACK_VERSION}-x86_64-unknown-linux-musl

RUN rustup target add wasm32-unknown-unknown

WORKDIR /work

ENV WASM_TARGET=web
ENV WASM_OUT_DIR=/work/pkg
ENV WASM_RELEASE=true

# Uso por defecto:
# - compila el crate montado en /work
# - genera /work/pkg con JS + .wasm
# - aplica optimizacion adicional con wasm-opt para reducir tamano final
CMD ["bash", "-lc", "wasm-pack build --target ${WASM_TARGET} --out-dir ${WASM_OUT_DIR} $( [ \"${WASM_RELEASE}\" = \"true\" ] && echo --release ) && wasm-opt -Oz ${WASM_OUT_DIR}/chronostream_wasm_bg.wasm -o ${WASM_OUT_DIR}/chronostream_wasm_bg.wasm && ls -lah ${WASM_OUT_DIR}"]
