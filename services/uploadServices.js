const fs = require('fs');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const firebaseAdmin = require('firebase-admin');

const credentials = require('../beecine-key.json');
const bucketName = 'beecine_data';
const projectId = 'beecine';

const storage = new Storage({
  projectId,
  credentials,
});

const uploadVideo = multer({
  storage: storage.bucket(bucketName),
});

const uploadImageSingle = async (file) => {
  try {
    const bucket = firebaseAdmin.storage().bucket();
    await bucket.upload(file.path, {
      destination: file.originalname, // Use the original filename as the destination
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: file.originalname,
        },
      },
    });

    // Lấy URL của avatar từ Firebase
    const avatarUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      file.originalname,
    )}?alt=media&token=${file.originalname}`;

    // Xóa file tạm trên server sau khi upload lên Firebase
    fs.unlinkSync(file.path);

    return avatarUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const uploadVideoSingle = async (file) => {
  try {
    storage.bucket(bucketName).upload(file.path, {
      name: file.filename,
    });
    const videoUrl = `https://storage.googleapis.com/${bucketName}/${file.filename}`;
    return videoUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('An error occurred while uploading the video.');
  }
};

module.exports = { uploadImageSingle, uploadVideoSingle, uploadVideo };
