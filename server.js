const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use('/css', express.static(path.join(__dirname, 'css')));

// Google Auth Client
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return payload;
}

// Serve React App Static Files
app.use(express.static(path.join(__dirname, 'auroralivestream/dist')));

// API Routes
const supabase = require('./supabase');
const { v4: uuidv4 } = require('uuid');

// API Routes
app.post('/api/auth/google', async (req, res) => {
    const { idToken, email, displayName, googleId } = req.body; // Expect googleId if available, or rely on token
    console.log('Received login request:', { email, displayName });

    try {
        // 1. Verify Google Token (Uncomment in Production)
        // const ticket = await client.verifyIdToken({ idToken, audience: CLIENT_ID });
        // const payload = ticket.getPayload();
        // const verifiedEmail = payload.email;
        // const verifiedGoogleId = payload.sub;

        // For dev, use provided values
        const verifiedEmail = email;
        const verifiedGoogleId = googleId || `mock_google_id_${Date.now()}`;

        // 2. Generate New Session Token (Invalidates old sessions)
        const newSessionToken = uuidv4();

        // 3. Upsert User in Supabase
        const { data, error } = await supabase
            .from('users')
            .upsert({
                email: verifiedEmail,
                google_id: verifiedGoogleId,
                display_name: displayName,
                session_token: newSessionToken,
                updated_at: new Date()
            }, { onConflict: 'email' })
            .select()
            .single();

        if (error) {
            console.error('Supabase Error:', error);
            // If table doesn't exist yet, we can't save. Return success specifically for first-run UI test
            // BUT warn the user heavily in logs.
            return res.status(200).json({
                success: true,
                message: 'Login successful (DB Save Failed - Check if Table Exists)',
                user: { email, displayName },
                sessionToken: newSessionToken // Still return token for app logic
            });
        }

        console.log('User saved/updated in DB:', data);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { email, displayName },
            sessionToken: newSessionToken
        });

    } catch (error) {
        console.error('Error processing login:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// New Endpoint: Verify Session (Single Device Enforcement)
app.post('/api/auth/verify-session', async (req, res) => {
    const { email, sessionToken } = req.body;

    if (!email || !sessionToken) {
        return res.status(400).json({ valid: false, message: 'Missing parameters' });
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .select('session_token')
            .eq('email', email)
            .single();

        if (error || !data) {
            return res.status(401).json({ valid: false, message: 'User not found' });
        }

        // Check if token matches DB (if mismatch, another login occurred)
        if (data.session_token === sessionToken) {
            return res.status(200).json({ valid: true });
        } else {
            console.log(`Session mismatch for ${email}. Client: ${sessionToken}, DB: ${data.session_token}`);
            return res.status(401).json({ valid: false, message: 'Session expired (Logged in elsewhere)' });
        }

    } catch (error) {
        console.error('Session verify error:', error);
        return res.status(500).json({ valid: false, message: 'Server error' });
    }
});

// Catch-all handler for any request that doesn't match an API route
// Sends back React's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'auroralivestream/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving React app from ${path.join(__dirname, 'auroralivestream/dist')}`);
});
