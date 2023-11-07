const express = require("express");
const router = express.Router();
const ArtistController = require("../controllers/ArtistController");
const bindController = require("../helpers/controllerHelper");
const { validationArtistData } = require("../middlewares/validationMiddleware");
const { paginationMiddleware } = require("../middlewares/paginationMiddleware");
const { convertData } = require("../middlewares/convertDataMiddleware");
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require("../middlewares/uploadMiddleware");

const upload = uploadMulter.single("image");

// Routes
router.get("/", paginationMiddleware, bindController(ArtistController, "getQuery"));
router.get("/admin", paginationMiddleware, bindController(ArtistController, "getAdmin"));
router.get("/trash", bindController(ArtistController, "getTrash"));
router.get("/search", paginationMiddleware, bindController(ArtistController, "getByKeyword"));
router.get("/:param", bindController(ArtistController, "getByParam"));
router.post(
  "/store",
  upload,
  convertData,
  validationArtistData,
  handleUploadOrUpdateImage,
  bindController(ArtistController, "create"),
);
router.put(
  "/update/:id",
  upload,
  convertData,
  handleUploadOrUpdateImage,
  bindController(ArtistController, "update"),
);
router.patch("/change-status/:id", bindController(ArtistController, "changeStatus"));
router.patch("/change-boolean/:id", bindController(ArtistController, "changeBoolean"));
router.delete("/delete/:id", bindController(ArtistController, "delete"));
router.delete("/delete-many", bindController(ArtistController, "deleteMany"));
router.patch("/restore/:id", bindController(ArtistController, "restore"));
router.patch("/restore-many", bindController(ArtistController, "restoreMany"));
router.delete("/force/:id", handleDeleteImage, bindController(ArtistController, "forceDelete"));
router.delete(
  "/force-many",
  handleDeleteMultipleImages,
  bindController(ArtistController, "forceDeleteMany"),
);

module.exports = router;
