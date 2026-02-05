const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');
require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

exports.googleLogin = async (req, res) => {
    const { idToken, email, displayName, googleId } = req.body;
    console.log('Received login request:', { email, displayName });

    try {
        // Dev: Use provided values. In Init: Verify ID Token
        const verifiedEmail = email;
        const verifiedGoogleId = googleId || `mock_google_id_${Date.now()}`;

        // Generate New Session Token
        const newSessionToken = uuidv4();

        // Upsert User in Supabase
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
            // Return success even if DB save fails (for initial dev setups without tables)
            return res.status(200).json({
                success: true,
                message: 'Login successful (DB Save Failed)',
                user: { email, displayName },
                sessionToken: newSessionToken
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
};

exports.verifySession = async (req, res) => {
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
};
