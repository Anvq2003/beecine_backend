require('dotenv').config();
const { JWT_ACCESS_KEY, JWT_REFRESH_KEY, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } =
  process.env;
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const OTPModel = require('../models/otp');
const RefreshTokenModel = require('../models/refreshToken');
const { getMillisecondsInDuration } = require('../utils/format');
const generateOTP = require('../helpers/generateOTP');
const { sendMail } = require('../helpers/sender');

class AuthController {
  async signUp(req, res) {
    try {
      const { token, name } = req.body;
      const decodedToken = await this.verifyTokenFirebase(token);

      if (!decodedToken) return res.status(404).json({ message: 'User not found' });

      await admin.auth().updateUser(decodedToken.uid, { displayName: name });
      await this.createUser({ ...decodedToken, name });

      return res.status(200).json('Sign up successfully');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async signIn(req, res) {
    try {
      const { token } = req.body;
      const decodedToken = await this.verifyTokenFirebase(token);
      if (!decodedToken) return res.status(404).json({ message: 'User not found' });

      const user = await UserModel.findOne({ uid: decodedToken.uid });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const { accessToken, refreshToken } = this.createTokens(user);

      const exitsRefreshToken = await RefreshTokenModel.findOne({ userId: user._id });
      if (exitsRefreshToken) {
        await RefreshTokenModel.deleteOne({ userId: user._id });
      }
      this.createNewRefreshToken(refreshToken, user._id);

      res.status(200).json({ token: { accessToken, refreshToken } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async signInAdmin(req, res) {
    try {
      const { token } = req.body;
      const decodedToken = await this.verifyTokenFirebase(token);
      if (!decodedToken) return res.status(404).json({ message: 'User not found' });

      const user = await UserModel.findOne({ uid: decodedToken.uid });
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (user.role !== 'ADMIN') return res.status(404).json({ message: 'You are not admin' });

      const { accessToken, refreshToken } = this.createTokens(user);

      const exitsRefreshToken = await RefreshTokenModel.findOne({ userId: user._id });
      if (exitsRefreshToken) {
        await RefreshTokenModel.deleteOne({ userId: user._id });
      }
      this.createNewRefreshToken(refreshToken, user._id);

      res.status(200).json({ token: { accessToken, refreshToken } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async sendOtpToEmail(req, res) {
    try {
      const { email } = req.body;
      const user = await admin.auth().getUserByEmail(email);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const otpCode = generateOTP();
      const now = Date.now();
      await OTPModel.findByIdAndDelete({ email });
      const otp = await OTPModel.create({
        email,
        code: otpCode,
        issuedAt: now,
        expiresAt: now + 600000,
      });

      const info = {
        from: {
          name: 'Beecine',
          address: process.env.EMAIL,
        },
        to: user.email,
        subject: 'Mã OTP',
        text: `Mã OTP của bạn là ${otpCode} và sẽ hết hạn trong 10 phút`,
      };
      await sendMail(info);
      res.status(200).json({ message: 'Send OTP successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      if(!email || !otp) return res.status(404).json({ message: 'Email and OTP are required' });
      const now = Date.now();
      const data = await OTPModel.findOne({ email });
      if (!data) return res.status(404).json({ message: 'OTP not found' });
      if (data.expiresAt < now) return res.status(404).json({ message: 'OTP has expired' });
      if (data.code !== otp) return res.status(404).json({ message: 'OTP is incorrect' });
      await OTPModel.findByIdAndDelete(data._id);
      res.status(200).json({ message: 'Verify OTP successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { uid, oldPassword, newPassword } = req.body;
      if (oldPassword === newPassword)
        return res
          .status(500)
          .json({ message: 'New password must be different from old password' });

      const user = await admin.auth().getUser(uid);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const validPassword = await admin.auth().verifyPassword(oldPassword, user.passwordHash);

      if (!validPassword) {
        return res.status(500).json({ message: 'Old password is incorrect' });
      }

      await admin.auth().updateUser(uid, { password: newPassword });

      res.status(200).json('Change password successfully');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async forgotPassword(req, res) {}

  async signInWithGoogle(req, res) {
    try {
      const { token } = req.body;
      const decodedToken = await this.verifyTokenFirebase(token);
      if (!decodedToken) return res.status(404).json({ message: 'User not found' });

      let user = await UserModel.findOne({ email: decodedToken.email });
      if (!user) {
        const dataFirebase = {
          ...decodedToken,
          imageUrl: decodedToken.picture,
        };
        user = await this.createUser(dataFirebase);
      }

      const { accessToken, refreshToken } = this.createTokens(user);
      const exitsRefreshToken = await RefreshTokenModel.findOne({ userId: user._id });
      if (exitsRefreshToken) {
        await RefreshTokenModel.deleteOne({ userId: user._id });
      }
      this.createNewRefreshToken(refreshToken, user._id);

      res.status(200).json({ token: { accessToken, refreshToken } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(404).json({ message: 'Refresh token is required' });

      const storedRefreshToken = await RefreshTokenModel.findOne({ token: refreshToken });
      if (!storedRefreshToken)
        return res.status(404).json({ message: 'Refresh  1223 token not found' });

      const currentTimestamp = Date.now();

      if (storedRefreshToken.expiresAt < currentTimestamp) {
        return res.status(404).json({ message: 'Refresh token has expired' });
      }

      const decodedToken = jwt.verify(refreshToken, JWT_REFRESH_KEY);
      if (!decodedToken) return res.status(404).json({ message: 'Refresh token is invalid' });

      const newTokens = this.createTokens(decodedToken);
      this.createNewRefreshToken(newTokens.refreshToken, decodedToken._id);

      await RefreshTokenModel.deleteOne({ token: refreshToken });

      res.status(200).json({
        token: { accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const { _id } = req.user;
      const user = await UserModel.findById(_id).populate('subscription');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async verifyTokenFirebase(token) {
    return await admin.auth().verifyIdToken(token);
  }

  async createUser(payload) {
    const data = Object.assign(
      {
        uid: '',
        email: '',
        name: '',
        imageUrl: null,
      },
      payload,
    );
    const user = await UserModel.create(data);
    return user;
  }

  createNewRefreshToken(refreshToken, userId) {
    const issuedAt = Date.now();
    const expiresAt = issuedAt + getMillisecondsInDuration(REFRESH_TOKEN_EXPIRATION);

    const refreshTokenData = new RefreshTokenModel({
      token: refreshToken,
      userId: userId,
      issuedAt: issuedAt,
      expiresAt: expiresAt,
    });

    refreshTokenData.save();
  }

  createTokens(user) {
    const payload = {
      _id: user._id,
      role: user.role,
      uid: user.uid,
    };

    const accessToken = jwt.sign(payload, JWT_ACCESS_KEY, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    return { accessToken, refreshToken };
  }
}

module.exports = new AuthController();
