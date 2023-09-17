const AgeGroupModel = require('../models/ageGroup');

class CommonController {
  async search(req, res) {}
  async stats(req, res) {
    res.json('Success');
    // try {
    //   // Sử dụng Mongoose để truy vấn cơ sở dữ liệu và đếm số lượng bản ghi
    //   const totalSongs = await SongModel.countDocuments();
    //   const totalArtists = await ArtistModel.countDocuments();
    //   const totalAlbums = await AlbumModel.countDocuments();
    //   const totalUsers = await UserModel.countDocuments();
    //   // Trả về thông tin thống kê dưới dạng JSON
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
}

module.exports = new CommonController();
