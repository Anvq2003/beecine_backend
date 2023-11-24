const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const historySchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  episodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode', default: null },
  minutes: { type: Number, required: true },
  watchedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, default: null },
    name: { type: String, required: true, trim: true, minLength: 3, maxLength: 255 },
    role: { type: String, required: true, enum: ['ADMIN', 'USER'], default: 'USER', trim: true },
    email: { type: String, required: true, unique: true, trim: true, minLength: 3, maxLength: 255 },
    uid: { type: String, required: true, unique: true, trim: true, minLength: 3, maxLength: 255 },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null },
    permissions: { type: [String], default: [] },
    favoriteMovies: [
      {
        type: {
          movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
          createdAt: { type: Date, default: Date.now },
        },
        default: [],
      },
    ],
    watchedList: { type: [historySchema], default: [] },
    watchLaterList: [
      {
        type: {
          movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
          createdAt: { type: Date, default: Date.now },
        },
        default: [],
      },
    ],
    status: { type: Boolean, default: true },

    lastCheckIn: { type: Date, default: null }, // Ngày điểm danh gần nhất
    checkInStreak: { type: Number, default: 0 }, // Số ngày điểm danh liên tiếp
    
    totalCheckIns: { type: Number, default: 0 }, // Tổng số lần điểm danh 
    points: { type: Number, default: 0 } // Điểm tích lũy
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

module.exports = User;
