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
// Base func
const uploadFileToBucketAndGetPath = async (bucket, file) => {
  try {
    const isImage = file.mimetype.startsWith('image/');
    const folder = isImage ? 'images' : 'sounds';

    const filePath = `${folder}/${Date.now()}_${file.originalname}`;
    const uploadFile = bucket.file(filePath);

    await uploadFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const uniqueToken = uuidv4(); // Generate a unique UUID
    const pathUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(filePath)}?alt=media&token=${uniqueToken}`;
    return pathUrl;
  } catch (error) {
    throw error;
  }
};

const deleteFileFromBucket = async (bucket, image) => {
  try {
    if (!image) return;

    const imageParts = image.split('?alt=media&token=');
    const imagePath = decodeURIComponent(
      imageParts[0].replace(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`, ''),
    );
    const file = bucket.file(imagePath);
    const [exists] = await file.exists();

    if (exists) {
      await file.delete().catch((error) => {
        console.error('Error deleting file:', error);
      });
    }
  } catch (error) {
    throw error;
  }
};

// Image
const handleUploadOrUpdateImage = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      // No new file uploaded, use the existing image URL
      req.body.imageUrl = req.body.oldImage;
      return next();
    }

    const bucket = firebaseAdmin.storage().bucket();
    const oldImage = req.body.oldImage;

    if (oldImage) {
      // Delete the old image if it exists
      await deleteFileFromBucket(bucket, oldImage);
    }

    req.body.imageUrl = await uploadFileToBucketAndGetPath(bucket, file);
    next();
  } catch (error) {
    console.error('Error handling file upload:', error);
    next(error);
  }
};

const handleDeleteImage = async (req, res, next) => {
  try {
    const oldImage = req.body.image;
    if (oldImage) {
      const bucket = firebaseAdmin.storage().bucket();
      await deleteFileFromBucket(bucket, oldImage);
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteMultipleImages = async (req, res, next) => {
  try {
    const isArray = req.body.imageList && Array.isArray(req.body.imageList);
    if (isArray) {
      const bucket = firebaseAdmin.storage().bucket();
      const deletePromises = req.body.imageList.map((item) => deleteFileFromBucket(bucket, item));
      await Promise.all(deletePromises);
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadMulter,
  handleDeleteImage,
  handleUploadOrUpdateImage,
  handleDeleteMultipleImages,
};
