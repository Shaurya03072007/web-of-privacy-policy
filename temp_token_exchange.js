const https = require('https');

const APP_ID = '2008818269931292';
const APP_SECRET = '637905f3eb7e4058fbf2111f5b0d4259';
const SHORT_LIVED_TOKEN = 'EAAcjAnNlxxwBQs7NKHCZAqS3vhzw7o6P34t4sY8STi5V9XGWpEwM9EODcJ9MBPWcidmbx6WwgeVnLQQoPc3FdXR3coSYk5Fh0oNce3DWknauRQvIHtlSZAyAM2ZACzMHdzrNSoA5rbc18KvBcwWPgFN2HBSYtYk66SAn1ZBpHv1oKvO4DnFdWK94j6zZBdhWv49S41cPaDv4SavY3qqk0';

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
