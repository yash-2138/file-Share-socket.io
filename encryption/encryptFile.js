const path = require('path');
const encryptFile = require('./encryptionModule');
const fs = require('fs');

const inputFile = path.join(__dirname, 'hash.html');
const encryptedFile = path.join(__dirname, 'encryptedFile.enc');
const keyFilePath = path.join(__dirname, 'secretKey.txt');

// Retrieve the key from the file
const key = Buffer.from(fs.readFileSync(keyFilePath, 'utf-8'), 'hex');


// Encrypt the file
encryptFile(inputFile, encryptedFile, key);

console.log('File encrypted.');
