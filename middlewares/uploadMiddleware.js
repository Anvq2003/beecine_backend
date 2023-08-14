const multer = require('multer');
const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Set multer upload image to firebase storage
const uploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // no larger than 50mb
  },
});

// Upload file
const handleUploadOrUpdateFile = (nameField, oldImageUrlField) => async (req, res, next) => {
  try {
    const bucket = firebaseAdmin.storage().bucket();
    let file = null;

    // Kiểm tra req.file cho trường hợp single file upload
    if (req.file) {
      file = req.file;
    }
    // Kiểm tra req.files cho trường hợp multiple files upload
    else if (req.files && req.files[nameField]) {
      [file] = req.files[nameField]; // Lấy file đầu tiên trong mảng
    }

    if (file) {
      // Xử lý logic upload và xóa file cũ
      if (req.body[oldImageUrlField]) {
        const oldImageUrl = req.body[oldImageUrlField];
        const oldImageUrlParts = oldImageUrl.split('?alt=media&token=');
        const oldImagePath = decodeURIComponent(
          oldImageUrlParts[0].replace(
            `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`,
            '',
          ),
        );
        const oldFile = bucket.file(oldImagePath);
        const [exists] = await oldFile.exists();
        if (exists) {
          await oldFile.delete().catch((error) => {
            console.error('Error deleting old file:', error);
          });
        }
      }

      const isImage = file.mimetype.startsWith('image/');
      const folder = isImage ? 'images' : 'sounds';

      const filePath = `${folder}/${Date.now()}_${file.originalname}`;
      const uploadFile = bucket.file(filePath);

      // Upload file lên Firebase Storage
      await uploadFile.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      const uniqueToken = uuidv4(); // Generate a unique UUID
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(filePath)}?alt=media&token=${uniqueToken}`;

      req.body[nameField] = imageUrl;
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const handleDeleteFile = (oldImageUrlField) => async (req, res, next) => {
  try {
    if (req.body[oldImageUrlField]) {
      const bucket = firebaseAdmin.storage().bucket();

      const oldImageUrl = req.body[oldImageUrlField];
      const oldImageUrlParts = oldImageUrl.split('?alt=media&token=');
      const oldImagePath = decodeURIComponent(
        oldImageUrlParts[0].replace(
          `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`,
          '',
        ),
      );

      const oldFile = bucket.file(oldImagePath);
      const [exists] = await oldFile.exists();
      if (exists) {
        await oldFile.delete().catch((error) => {
          console.error('Error deleting old file:', error);
        });
      }
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteMultipleFiles = (oldImageUrlsField) => async (req, res, next) => {
  const bucket = firebaseAdmin.storage().bucket();

  try {
    if (req.body[oldImageUrlsField] && Array.isArray(req.body[oldImageUrlsField])) {
      const oldImageUrls = req.body[oldImageUrlsField];

      const deletePromises = oldImageUrls.map(async (oldImageUrl) => {
        const oldImageUrlParts = oldImageUrl.split('?alt=media&token=');
        const oldImagePath = decodeURIComponent(
          oldImageUrlParts[0].replace(
            `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`,
            '',
          ),
        );

        const oldFile = bucket.file(oldImagePath);
        try {
          const [exists] = await oldFile.exists();
          if (exists) {
            await oldFile.delete().catch((error) => {
              console.error('Error deleting old file:', error);
            });
          }
          await oldFile.delete();
        } catch (error) {
          console.error('Error deleting old file:', error);
        }
      });

      await Promise.all(deletePromises);
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadMulter,
  handleDeleteFile,
  handleUploadOrUpdateFile,
  handleDeleteMultipleFiles,
};
