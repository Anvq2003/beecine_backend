const express = require('express');
const router = express.Router();
const { uploadImageSingle } = require('../services/uploadServices');
const { uploadImage } = require('../middlewares/multer');

router.post('/upload', uploadImage.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const uploadedFile = await uploadImageSingle(file);
    res.status(200).json({ data: uploadedFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
