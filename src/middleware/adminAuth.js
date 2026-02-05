const supabase = require('../../config/supabaseClient');

exports.isAdmin = async (req, res, next) => {
    // 1. Check if session exists (set by Google Auth)
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Unauthorized: Please login.' });
    }

    const email = req.session.user.email;

    // 2. Strict Check for Specific Admin Email
    if (email !== 'jshauryareddy@gmail.com') {
        return res.status(403).json({ error: 'Forbidden: You are not the admin.' });
    }

    // 3. (Optional but recommended) Double check DB role
    const { data: user, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single();

    if (error || !user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin role required.' });
    }

    next();
};
