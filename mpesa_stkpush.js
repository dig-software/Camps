const axios = require('axios');

// Replace with your actual credentials:
const consumerKey = '4bf64DtcD6T0cn7UTFiG8fwzm90Zw9FjawyVQxUACdbzInpS';
const consumerSecret = '0EL44svbL08ZfqvNw8LxSZAXXeb4faGcPI2jDbx5BnRCQm4l67nYQABbwvA5xxL2';
const BusinessShortCode = '174379';
const Passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';

const pad = n => n < 10 ? '0' + n : n;

async function stkPush({ phone_number, amount }) {
  // Step 1: Get access token
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  let accessToken;
  try {
    const tokenRes = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    accessToken = tokenRes.data.access_token;
  } catch (error) {
    if (error.response) {
      console.error('Error fetching access token:', error.response.status, error.response.data);
    } else {
      console.error('Error fetching access token:', error.message);
    }
    return;
  }

  // Step 2: Prepare STK Push payload
  const now = new Date();
  const Timestamp =
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
  const Password = Buffer.from(BusinessShortCode + Passkey + Timestamp).toString('base64');

  const payload = {
    "BusinessShortCode": BusinessShortCode,
    "Password": Password,
    "Timestamp": Timestamp,
    "TransactionType": "CustomerPayBillOnline",
    "Amount": amount,
    "PartyA": phone_number,
    "PartyB": BusinessShortCode,
    "PhoneNumber": phone_number,
    "CallBackURL": "https://mydomain.com/path",
    "AccountReference": "CampsltdKE",
    "TransactionDesc": "confirm"
  };

  // Step 3: Make STK Push request
  try {
    const res = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('STK Push Response:', res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error('STK Push Error:', error.response.status, error.response.data);
    } else {
      console.error('STK Push Error:', error.message);
    }
    throw error;
  }
}

module.exports = { stkPush };