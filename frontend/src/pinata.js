require('dotenv').config();
const key = process.env.REACT_APP_PINATAKEY;
const secret = process.env.REACT_APP_PINATASECRET;

//const key = '0862df390ff1d8861a14'
//const secret = '823d0eab14bbd6706e7c2fc8e398840ac25ce234950fa363afc1c6e04040b060'

const axios = require('axios');
const FormData = require('form-data');

/*
This code exports two functions, uploadJSONToIPFS and uploadFileToIPFS, that allow you to upload JSON data and files, 
respectively, to the IPFS (InterPlanetary File System) network via the Pinata API. 
The Pinata API is a cloud-based service that allows you to easily pin and manage your content on IPFS.

The uploadJSONToIPFS function takes in a JSON object as its parameter and makes an HTTP POST request to the Pinata API endpoint for pinning JSON to IPFS using the axios library.
It then returns an object containing the success status and the IPFS hash of the pinned content.

The uploadFileToIPFS function takes in a file as its parameter and makes an HTTP POST request to the Pinata API endpoint for pinning files to IPFS. 
It creates a FormData object, appends the file to it, and adds metadata and pinataOptions as well.
The function then returns an object containing the success status and the IPFS hash of the pinned content.

Both functions use the key and secret variables, which are supposed to be the Pinata API key and secret key, respectively. 
These values are passed as headers in the requests.

It should be noted that in order to use this code,
you must replace '0862df390ff1d8861a14' and '823d0eab14bbd6706e7c2fc8e398840ac25ce234950fa363afc1c6e04040b060' with your own Pinata API key and secret key, respectively.

*/

export const uploadJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};

export const uploadFileToIPFS = async(file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️
    
    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    return axios 
        .post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            console.log("image uploaded", response.data.IpfsHash)
            return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};
