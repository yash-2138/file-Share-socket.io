const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Function to decrypt a file and save to a text file
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

module.exports = decryptFile;
