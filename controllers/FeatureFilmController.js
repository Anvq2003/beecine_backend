const EpisodeModel = require('../models/episode');
const MovieModel = require('../models/movie');

class FeatureFilmController {
  async create(req, res) {
    try {
      const movieData = req.body;

      const newMovie = new MovieModel(movieData);
      const savedMovie = await newMovie.save();

      const movieId = savedMovie._id;

      const episodeData = {
        movieId,
        title: movieData.title,
        videoUrl: movieData.videoUrl,
      };

      const newEpisode = new EpisodeModel(episodeData);
      const savedEpisode = await newEpisode.save();

      res.status(200).json({
        movie: savedMovie,
        episode: savedEpisode,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async update(req, res) {
    try {
      const movieId = req.params.id;
      const movieDataToUpdate = req.body;

      const updatedMovie = await MovieModel.findByIdAndUpdate(
        episodeId,
        { $set: movieDataToUpdate },
        { new: true },
      );

      const episodeData = {
        movieId,
        title: movieDataToUpdate.title,
        videoUrl: movieDataToUpdate.videoUrl,
      };

      const updatedEpisode = await EpisodeModel.findByIdAndUpdate(
        episodeIdToUpdate._id,
        { $set: episodeData },
        { new: true },
      );

      res.status(200).json({
        updatedMovie,
        updatedEpisode,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async delete(req, res) {
    try {
      const movieIdToDelete = req.params.id;
      await MovieModel.findByIdAndRemove(movieIdToDelete);
      await EpisodeModel.deleteMany({ movieId: movieIdToDelete });
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async deleteMany(req, res) {
    const { ids } = req.body;
    try {
      await MovieModel.deleteMany({ _id: { $in: ids } });
      await EpisodeModel.deleteMany({ movieId: { $in: ids } });
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new FeatureFilmController();
