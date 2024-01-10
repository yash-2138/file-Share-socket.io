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


// Function to decrypt a file
function decryptFile(inputPath, outputPath, key) {
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    // Read the initialization vector from the beginning of the file
    input.once('readable', () => {
        const iv = input.read(16);

        if (!iv || iv.length !== 16) {
            console.error('Error reading initialization vector');
            return;
        }

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        // Handle errors during decryption
        decipher.on('error', (err) => {
            console.error('Decryption error:', err.message);
            output.end();
        });

        // Handle the end of the decryption process
        output.on('finish', () => {
            console.log('File decrypted successfully.');
        });

        input.pipe(decipher).pipe(output);
    });
}



// Example usage
const inputFile = path.join(__dirname, 'hash.html');
const fileExtension = path.extname(inputFile).toLowerCase();

const encryptedFile = path.join(__dirname, `encryptedFile.enc`);
const decryptedFile = path.join(__dirname,  `decryptedFile${fileExtension}`);

// Generate a random key (for demonstration purposes, in a real scenario, you might have a secure key exchange mechanism)
const key = crypto.randomBytes(32); // 256-bit key for AES-256

// Encrypt the file
encryptFile(inputFile, encryptedFile, key);

console.log('Send the encrypted file:', encryptedFile);

// Later, on the receiving end:

// Decrypt the file
decryptFile(encryptedFile, decryptedFile, key);
