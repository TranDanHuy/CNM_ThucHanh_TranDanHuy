/**
 * Session Configuration
 */

module.exports = {
    secret: process.env.SESSION_SECRET || 'lab4-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set true nếu dùng HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};