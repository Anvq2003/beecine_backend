const firebaseAdmin = require('firebase-admin');
const fs = require('fs');

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

module.exports = { uploadImageSingle };
