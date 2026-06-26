const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Not authorized, no token' });
        }

        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the current user (password exlcuded by the schema's select: false)
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Not authorized, user not found' });
        }

        req.user = user; // hand the user to downstream routes
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Not authorized, token failed' });
    }
};

const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized' });
        }
        if (!allowedRoles.includes(req.user.type)) {
            return res.status(403).json({ error: 'Forbidden: insufficient permissions'});
        }
        next();
    }
}

module.exports = { protect, restrictTo };