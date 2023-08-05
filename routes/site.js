const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.post('/upload-image', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image file found' });
    }

    const imageFile = req.files.image;
    const imageFileName = imageFile.name;
    const imagePath = `images/${imageFileName}`;

    // Upload ảnh lên Firebase Storage
    await bucket.upload(imageFile.tempFilePath, {
      destination: imagePath,
      contentType: imageFile.mimetype,
    });

    // Lấy URL tới ảnh đã upload
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${imagePath}`;

    // Lưu URL vào MongoDB bằng Mongoose
    const newImage = new ImageModel({ url: imageUrl });
    await newImage.save();

    res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
