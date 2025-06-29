const axios = require('axios');

const consumerKey = '';      // <-- Replace with your key
const consumerSecret = '';// <-- Replace with your secret

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
