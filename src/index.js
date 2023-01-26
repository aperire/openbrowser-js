const { OpenBrowser } = require('./OpenBrowser');
const fs = require('fs');
let openBrowser = new OpenBrowser("http://localhost:3000");

const processAndPostData = async() => {
    // 1. Fetch RPC Array
    const rpcArray = await openBrowser.getAvailableRpcs();

    // 2. Process File
    let bitmap = fs.readFileSync("./img/img.jpeg");
    let { b64EncryptedFile, publicKey} = openBrowser.processFileWithBitmap(bitmap);

    // 3. Distribute Data to RPC/RPCs
    const result = await openBrowser.distributeDataToRpc(
        publicKey, b64EncryptedFile, rpcArray, "jpeg", "img.jpeg" 
    );
}

const retrieveAndSaveData = async(publicKey, retrieveDirectory, rpcEndpoint) => {
    let status = openBrowser.retrieveAndStoreDataFromRpc(
        publicKey, retrieveDirectory, rpcEndpoint
    )
}

//processAndPostData();
retrieveAndSaveData(
    "ca38e05bba85c1077a3ee4fb620104486a84fb7ee8fd99a0c2518dc74093fe05",
    "retrieve_img",
    "http://localhost:8080"
);