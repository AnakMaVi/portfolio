use base64::{engine::general_purpose::STANDARD_NO_PAD, Engine as _};
use sha2::{Digest, Sha256};
use wasm_bindgen::prelude::*;

const HASH_CHUNK_SIZE: usize = 64 * 1024;

#[wasm_bindgen]
pub fn encrypt_data(input: &str, key: &str) -> Result<String, JsValue> {
    if key.is_empty() {
        return Err(JsValue::from_str("La clave no puede estar vacia."));
    }

    let input_bytes = input.as_bytes();
    let key_bytes = key.as_bytes();

    let mut encrypted = Vec::with_capacity(input_bytes.len());
    for (index, &byte) in input_bytes.iter().enumerate() {
        encrypted.push(byte ^ key_bytes[index % key_bytes.len()]);
    }

    Ok(STANDARD_NO_PAD.encode(encrypted))
}

#[wasm_bindgen]
pub fn generate_hash(input: &str) -> String {
    let mut hasher = Sha256::new();

    for chunk in input.as_bytes().chunks(HASH_CHUNK_SIZE) {
        hasher.update(chunk);
    }

    let digest = hasher.finalize();
    to_hex(&digest)
}

fn to_hex(bytes: &[u8]) -> String {
    const HEX: &[u8; 16] = b"0123456789abcdef";

    let mut out = String::with_capacity(bytes.len() * 2);
    for &b in bytes {
        out.push(HEX[(b >> 4) as usize] as char);
        out.push(HEX[(b & 0x0f) as usize] as char);
    }

    out
}
