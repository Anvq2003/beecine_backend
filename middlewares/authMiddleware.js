require('dotenv').config();
const { JWT_ACCESS_KEY } = process.env;
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ message: 'Token not found' });
    }
    const accessToken = token.split(' ')[1];
    const decodedToken = jwt.verify(accessToken, JWT_ACCESS_KEY);
    if (!decodedToken) {
      return res.status(401).send({ message: 'Token invalid' });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send({ message: 'You are not authenticated' });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      const { role } = req.user;
      if (role !== 'ADMIN') {
        return res.status(401).send({ message: 'You are not authorized' });
      }
      next();
    });
  } catch (error) {
    res.status(401).send({ message: 'You are not authenticated' });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
