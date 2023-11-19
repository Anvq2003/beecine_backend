const mongoose = require('mongoose');
const MovieModel = require('../models/movie');
const EpisodeModel = require('../models/episode');

class CommonController {
  async search(req, res) {

    try {
      
      res.status(200).json("ok");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async stats(req, res) {
    // try {
    //   // Sử dụng Mongoose để truy vấn cơ sở dữ liệu và đếm số lượng bản ghi
    //  const totalMovies = await MovieModel.countDocuments();
    //
    //   res.json({
    //     totalSongs,
    //     totalArtists,
    //     totalAlbums,
    //     totalUsers,
    //   });
    // } catch (error) {
    //   // Xử lý lỗi nếu có
    //   res.status(500).json({ error: error.message });
    // }
  }

  async getTopMovie(req, res) {
    try {
      const movies = await MovieModel.find();

      const promises = movies.map(async (movie) => {
        const currentDate = new Date();
        const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const result = await EpisodeModel.aggregate([
          {
            $match: {
              movieId: movie._id,
              views: { $gte: sevenDaysAgo, $lte: currentDate },
            },
          },
          {
            $group: {
              _id: null,
              totalViews: { $sum: '$views' },
            },
          },
        ]);

        return { movie, totalViews: result.length > 0 ? result[0].totalViews : 0 };
      });

      const results = await Promise.all(promises);
      res.status(200).json(results);
      mongoose.connection.close();
    } catch (error) {
      mongoose.connection.close();
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {}
}

module.exports = new CommonController();
