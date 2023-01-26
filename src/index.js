const { OpenBrowser } = require('./OpenBrowser');

let openBrowser = new OpenBrowser("");

let {b64EncryptedFile, publicKey} = openBrowser.processFile(
    "./img/img.jpeg"
);
console.log(b64EncryptedFile.length);