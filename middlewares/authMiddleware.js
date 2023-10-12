const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send({ message: 'Token not found' });
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken) {
      return res.status(401).send({ message: 'Token is invalid' });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Authentication failed' });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      const uid = req.user.uid;
      const user = await admin.auth().getUser(uid);
      if (!user) {
        return res.status(401).send({ message: 'User not found' });
      }
      const isAdmin = user.customClaims?.admin;
      if (!isAdmin) {
        return res.status(401).send({ message: 'Access denied' });
      }
      next();
    });
  } catch (error) {
    res.status(401).send({ message: 'Authentication failed' });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
