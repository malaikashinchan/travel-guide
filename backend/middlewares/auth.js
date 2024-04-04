const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token.');
        }
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next(); 
    });
}

module.exports = verifyToken;