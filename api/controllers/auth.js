const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/user'); // Adjust path as needed

exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    res.json({ message: 'Username and password are required' });
    return next();
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.status(401);
      res.json({ message: 'Invalid credentials' });
      return next();
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401);
      res.json({ message: 'Invalid credentials' });
      return next();
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200);
    res.json({ token });
    return next();

  } catch (error) {
    console.error('Login error:', error);
    res.status(500);
    res.json({ message: 'Internal server error' });
    return next();
  }
};
