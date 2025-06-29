const axios = require('axios');

const consumerKey = '4bf64DtcD6T0cn7UTFiG8fwzm90Zw9FjawyVQxUACdbzInpS';      // <-- Replace with your key
const consumerSecret = '0EL44svbL08ZfqvNw8LxSZAXXeb4faGcPI2jDbx5BnRCQm4l67nYQABbwvA5xxL2';// <-- Replace with your secret

const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
        Authorization: `Basic ${auth}`
    }
})
.then(response => {
    console.log('Access Token:', response.data.access_token);
})
.catch(error => {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
});