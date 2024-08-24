<?php

require_once "../../config/envParser.php";

// This instance will allow us to get the variables from the .env file
(new DotEnv("../../config/.env"))->load();

// This class contains all the methods to encrypt and decrypt data
class Crypto {
    private $key, $nonce;

    // The constructor will initialize the variables from the .env file
    public function __construct() {
        $this->key = base64_decode(getenv("KEY_CRYPTO"));
        $this->nonce = base64_decode(getenv("NONCE_CRYPTO"));
    }

    // This function is going to crypt the data with the key and the nonce saved in the .env file
    public function cryptData($data) {
        $ciphertext = base64_encode(sodium_crypto_secretbox($data, $this->nonce, $this->key));

        return $ciphertext;
    }

    // This function is going to decrypt the data with the key and the nonce saved in the .env file
    public function decryptData($data) {
        $decrypted_data = sodium_crypto_secretbox_open(base64_decode($data), $this->nonce, $this->key);

        return $decrypted_data;
    }
}