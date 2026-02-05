const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const { helmetMiddleware, globalLimiter } = require('./src/middleware/security');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
// Simple Cookie Parser Middleware (avoiding npm install for now)
app.use((req, res, next) => {
    const cookieHeader = req.headers.cookie;
    req.cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            req.cookies[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    }
    next();
});

app.use(helmetMiddleware);
app.use('/api/', globalLimiter); // Apply global limit

app.use('/css', express.static(path.join(__dirname, 'css')));

// Serve Admin UI (Static)
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// Routes
app.use('/api', apiRoutes);
app.use('/api/admin', require('./src/routes/adminRoutes'));

// Twitch Callback
app.get('/twitch/callback', (req, res) => {
    res.sendFile(path.join(__dirname, 'twitch_callback.html'));
});

// Serve React App (Catch-All)
app.use(express.static(path.join(__dirname, 'auroralivestream/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'auroralivestream/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving React app from ${path.join(__dirname, 'auroralivestream/dist')}`);
});
