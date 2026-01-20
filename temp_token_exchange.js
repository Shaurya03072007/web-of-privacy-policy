const https = require('https');

const APP_ID = '2008818269931292';
const APP_SECRET = '637905f3eb7e4058fbf2111f5b0d4259';
const SHORT_LIVED_TOKEN = 'EAAcjAnNlxxwBQs6nrrnrlOw2N3o45Gnu9iRFWnhNBzURVVPAcqcT43FT9kP8A8Tke81lAneQ6aImtS4zskjZBPnpGn3xySIdTFZCEDTC4T2DfKKeYlC3ZBkNIooQYZAgWBMBjmo69YMVHJHS4g6I3o1ptM6vWZA2CkWSmws45ccfYUJ0ZCCSVbaPnJfbTImXBwwf4AHurxS0VZAIDqA0tKAGq6b7IY66RRpUFrQx2Vtg7VIkTU1';

const url = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${SHORT_LIVED_TOKEN}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            console.log('Response:', JSON.stringify(jsonData, null, 2));
        } catch (e) {
            console.error('Error parsing response:', e);
            console.log('Raw response:', data);
        }
    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
