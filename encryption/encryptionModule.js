const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Function to encrypt a file
function encryptFile(inputPath, outputPath, key) {
    const iv = crypto.randomBytes(16); // Initialization vector for AES
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    // Append the initialization vector to the beginning of the file
    output.write(iv);

    input.pipe(cipher).pipe(output);

    // Handle errors during encryption
    cipher.on('error', (err) => {
        console.error('Encryption error:', err.message);
        output.end();
    });

    // Handle the end of the encryption process
    output.on('finish', () => {
        console.log('File encrypted successfully.');
    });
}

module.exports = encryptFile;
