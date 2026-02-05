const supabase = require('../config/supabaseClient');

exports.checkPermissions = async (req, res) => {
    const { sessionToken } = req.body;

    if (!sessionToken) {
        return res.status(400).json({ valid: false, message: 'Missing session token' });
    }

    try {
        // 1. Verify User Session
        const { data: user, error } = await supabase
            .from('users')
            .select('session_token, email, subscription_tier')
            .eq('session_token', sessionToken)
            .single();

        if (error) {
            console.error('Supabase Error during check:', error);
        }

        if (error || !user) {
            console.warn(`Permission check failed: Invalid Token ${sessionToken} from ${req.ip}`);
            return res.status(401).json({
                valid: false,
                message: 'Unauthorized: Invalid or Expired Session'
            });
        }

        // 2. Determine Permissions
        const isPremium = (user.subscription_tier === 'premium');
        console.log(`User ${user.email} is ${isPremium ? 'PREMIUM' : 'FREE'}`);

        const permissions = {
            allow_multistream: isPremium,
            max_resolution: isPremium ? "2160p" : "1440p",
            allow_editing: isPremium,
            max_bitrate_kbps: isPremium ? 15000 : 4500,
            watermark_required: !isPremium, // Trailing comma safe in JS

            // Dynamic UI Options (Server Controlled)
            allowed_resolutions: isPremium
                ? ["2160p (4K)", "1440p (2K)", "1080p", "720p", "480p", "360p"]
                : ["1440p (2K)", "1080p", "720p", "480p", "360p"],

            allowed_fps: isPremium
                ? [60, 30]
                : [30],

            allowed_audio_rates: isPremium
                ? [48000, 44100, 32000]
                : [44100, 32000],

            // Dynamic UI Strings
            ui: {
                upgrade_message: isPremium ? "" : "Upgrade to Premium for 4K & Unlimited Streams",
                stream_limit_message_prefix: "Max Streams allowed: "
            },

            // Granular Stream Limits per Resolution (Key = partial match)
            stream_limits: isPremium
                ? { "2160p": 2, "1440p": 3, "1080p": 5, "720p": 6, "480p": 8, "360p": 10 }
                : { "1440p": 1, "720p": 1, "default": 1 }
        };

        // 3. Return Secure Config
        res.status(200).json({
            valid: true,
            config: permissions
        });

    } catch (error) {
        console.error('Permission check error:', error);
        res.status(500).json({ valid: false, message: 'Server error' });
    }
};
