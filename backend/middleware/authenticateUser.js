const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  // Check if the token exists and is in the correct format
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Extract the token by removing 'Bearer ' prefix
    const tokenWithoutBearer = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET); // Corrected here
    req.user = decoded; // Add decoded user info to the request object
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateUser };
