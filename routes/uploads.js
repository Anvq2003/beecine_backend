const express = require('express');
const router = express.Router();
// const { uploadVideo } = require('../middlewares/multer');
const { uploadVideoSingle, uploadVideo } = require('../services/uploadServices');

router.post('/video', uploadVideo.single('video'), async (req, res) => {
  const video = req.file;
  if (!video) {
    return res.status(400).send(video);
  }

  try {
    const videoUrl = await uploadVideoSingle(video);
    return res.status(200).send(videoUrl);
  } catch (error) {
    console.log(error);
    return res.status(400).send('Error uploading video.');
  }
});

module.exports = router;
