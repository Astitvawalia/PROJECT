const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = function jwtAuth(req, res, next) {
  const authHeader = req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.send(401, { message: 'Missing or invalid Authorization header' });
    return next(false);
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload; 
    return next();
  } catch (err) {
    res.send(401, { message: 'Invalid or expired token' });
    return next(false);
  }
};
