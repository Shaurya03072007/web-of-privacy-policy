const supabase = require('../config/supabaseClient');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.SERVER_BASE_URL}/api/admin/auth/google/callback`
);

exports.googleLogin = (req, res) => {
    const authorizeUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
        prompt: 'select_account' // Forces account selection even if logged in
    });
    res.redirect(authorizeUrl);
};

exports.googleCallback = async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const userInfoResponse = await client.request({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo'
        });
        const userInfo = userInfoResponse.data;
        const email = userInfo.email;

        // 1. Sync User with Supabase (Upsert)
        // Check if user exists
        let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            // Create new user (Default: free, user)
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{
                    email: email,
                    role: email === 'jshauryareddy@gmail.com' ? 'admin' : 'user', // Auto-admin for owner
                    subscription_tier: 'free',
                    session_token: require('uuid').v4() // Generate initial token
                }])
                .select()
                .single();

            if (createError) throw createError;
            user = newUser;
        }

        // 2. Set Session
        const sessionToken = require('uuid').v4();
        global.adminSessions = global.adminSessions || {};
        global.adminSessions[sessionToken] = {
            email: user.email,
            role: user.role,
            id: user.id,
            createdAt: Date.now()
        };

        // Garbage Collection: Cleanup old sessions every hour
        if (!global.sessionCleanupInterval) {
            global.sessionCleanupInterval = setInterval(() => {
                const now = Date.now();
                const TTL = 24 * 60 * 60 * 1000; // 24 Hours
                Object.keys(global.adminSessions).forEach(token => {
                    if (now - global.adminSessions[token].createdAt > TTL) {
                        delete global.adminSessions[token];
                    }
                });
                console.log('🧹 Session Garbage Collection Completed');
            }, 60 * 60 * 1000); // Run every hour
        }

        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('admin_session', sessionToken, {
            httpOnly: true,
            secure: isProduction, // Secure in Prod
            sameSite: 'Lax', // Prevention against CSRF
            maxAge: 24 * 60 * 60 * 1000 // 24 Hours
        });

        // 3. Redirect based on Role
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard.html');
        } else {
            res.redirect('/admin/profile.html');
        }

    } catch (error) {
        console.error('OAuth Error:', error);
        res.status(500).send('Authentication Failed: ' + error.message);
    }
};

exports.listUsers = async (req, res) => {
    // Check Session (Memory based for now)
    const sessionToken = req.cookies?.admin_session || req.headers['x-admin-token'];
    if (!sessionToken || !global.adminSessions?.[sessionToken]) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: users, error } = await supabase
        .from('users')
        .select('id, email, subscription_tier, role, created_at')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ users });
};

exports.updateUserTier = async (req, res) => {
    // Check Session
    const sessionToken = req.cookies?.admin_session || req.headers['x-admin-token'];
    if (!sessionToken || !global.adminSessions?.[sessionToken]) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Role Check (Only admins can update)
    if (global.adminSessions[sessionToken].role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params;
    const { tier } = req.body; // 'free' or 'premium'

    const { data, error } = await supabase
        .from('users')
        .update({ subscription_tier: tier })
        .eq('id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, user: data[0] });
};

exports.getMe = async (req, res) => {
    const sessionToken = req.cookies?.admin_session || req.headers['x-admin-token'];
    if (!sessionToken || !global.adminSessions?.[sessionToken]) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { email } = global.adminSessions[sessionToken];

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(user);
};

exports.logout = (req, res) => {
    const sessionToken = req.cookies?.admin_session || req.headers['x-admin-token'];

    // Server-side cleanup
    if (sessionToken && global.adminSessions?.[sessionToken]) {
        delete global.adminSessions[sessionToken];
    }

    // Client-side cleanup (Cookie)
    res.clearCookie('admin_session', {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
    });

    res.json({ success: true, message: 'Logged out successfully' });
};
