const fs = require('fs');
const assert = require('assert');
const axios = require('axios');
const shajs = require('sha.js');

class OpenBrowser {
    constructor(connection) {
        this.connection = connection;
    }

    processFileWithBitmap = (bitmap) => {
        // base64 encode
        const b64EncryptedFile = Buffer.from(bitmap).toString('base64');
        const publicKey = shajs("sha256").update(b64EncryptedFile).digest("hex");

        return { b64EncryptedFile, publicKey };
    }
    processFileWithPath = (filePath) => {
        // base64 encode
        const bitmap = fs.readFileSync(filePath);
        const b64EncryptedFile = Buffer.from(bitmap).toString('base64');
        const publicKey = shajs("sha256").update(b64EncryptedFile).digest("hex");

        return { b64EncryptedFile, publicKey };
    }

    distributeDataToRpc = async(publicKey, b64EncryptedFile, rpcArray, fileType, fileName) => {
        assert(this.pingRpc(rpcArray).length != 0, "One of the storage Offline");
        const postData = {}
        postData[publicKey] = [b64EncryptedFile, fileType, fileName]
        
        for (let i=0; i<rpcArray.length; i++) {
            let res = await axios.post(`${rpcArray[i]}/data`, postData);
        }
        return true;
    }

    retrieveDataFromRpc = async(publicKey, rpcEndpoint) => {
        const res = await axios.post(`${rpcEndpoint}/retrieve`, {
            "pubkey": publicKey
        });

        const data = res.data.data;
        const bitmap = Buffer.from(data[0], 'base64');
        return bitmap;
    }

    retrieveAndStoreDataFromRpc = async(publicKey, retrieveDirectory, rpcEndpoint) => {
        const res = await axios.post(`${rpcEndpoint}/retrieve`, {
            "pubkey": publicKey
        });

        const data = res.data.data;
        const bitmap = Buffer.from(data[0], 'base64');
        fs.writeFileSync(`${retrieveDirectory}/${data[2]}`, bitmap);
        return true;
    }

    getAvailableRpcs = async() => {
        const res = await axios.get(`${this.connection}/rpc`);
        const rpcArray = res.data;
        return rpcArray;
    }

    pingRpc = async(rpcArray) => {
        let offlineRpcArray = [];

        for (let i=0; i<rpcArray.length; i++) {
            let res = await axios.get(`${rpcArray[i]}/ping`);
            if (res.status != 200 || res.data.status == false) {
                offlineRpcArray.push(i);
            }
        }

        return offlineRpcArray;
    }
}

module.exports = { OpenBrowser };