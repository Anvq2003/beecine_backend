require('dotenv').config();
const { JWT_ACCESS_KEY, JWT_REFRESH_KEY } = process.env;
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

class AuthController {
  async signUp(req, res) {
    try {
      const { token, name } = req.body;
      const decodedToken = await this.verifyToken(token);

      if (!decodedToken) return res.status(404).json({ message: 'User not found' });

      await admin.auth().updateUser(decodedToken.uid, { displayName: name });
      await this.createData(decodedToken, name);

      return res.status(200).json('Create user successfully');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async signIn(req, res) {
    try {
      const { token } = req.body;
      const decodedToken = await this.verifyToken(token);
      if (!decodedToken) return res.status(404).json({ message: 'User not found' });

      const user = await UserModel.findOne({ uid: decodedToken.uid });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const { accessToken, refreshToken } = this.createTokens(decodedToken, user);

      this.setRefreshTokenCookie(res, refreshToken);

      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async signInWithGoogle(req, res) {
    try {
      const { token } = req.body;
      const decodedToken = await this.verifyToken(token);
      if (!decodedToken) return res.status(404).json({ message: 'User not found' });

      const user = await UserModel.findOne({ uid: decodedToken.uid });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const data = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.displayName,
        imageUrl: decodedToken.photoURL,
      };

      await this.createData(decodedToken, decodedToken.displayName);

      const { accessToken, refreshToken } = this.createTokens(decodedToken, user);

      this.setRefreshTokenCookie(res, refreshToken);

      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(404).json({ message: 'Refresh token not found' });

      const decodedToken = jwt.verify(refreshToken, JWT_REFRESH_KEY);
      if (!decodedToken) return res.status(404).json({ message: 'Refresh token not found' });

      this.createTokens(decodedToken, decodedToken);

      const newAccessToken = jwt.sign(decodedToken, JWT_ACCESS_KEY, { expiresIn: '30s' });
      const newRefreshToken = jwt.sign(decodedToken, JWT_REFRESH_KEY, { expiresIn: '365d' });

      this.setRefreshTokenCookie(res, newRefreshToken);

      res.status(200).json({ newAccessToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      if (!req.user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(req.user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async verifyToken(token) {
    return await admin.auth().verifyIdToken(token);
  }

  async createData(decodedToken, name) {
    const data = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: name,
    };
    await UserModel.create(data);
  }

  createTokens(decodedToken, user) {
    const payload = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      _id: user._id,
      role: user.role,
      permissions: user.permissions,
    };

    const accessToken = jwt.sign(payload, JWT_ACCESS_KEY, { expiresIn: '30s' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_KEY, { expiresIn: '365d' });

    return { accessToken, refreshToken };
  }

  setRefreshTokenCookie(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
  }
}

module.exports = new AuthController();
