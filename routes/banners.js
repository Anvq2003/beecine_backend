const express = require("express");
const router = express.Router();
const BannerController = require("../controllers/BannerController");
const bindController = require("../helpers/controllerHelper");
const { validationBannerData } = require("../middlewares/validationMiddleware");
const { paginationMiddleware } = require("../middlewares/paginationMiddleware");
const { convertData } = require("../middlewares/convertDataMiddleware");
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require("../middlewares/uploadMiddleware");

router.get("/", paginationMiddleware, bindController(BannerController, "getQuery"));
router.get("/admin", paginationMiddleware, bindController(BannerController, "getAdmin"));
router.get("/trash", bindController(BannerController, "getTrash"));
router.get("/:param", bindController(BannerController, "getByParam"));
router.post(
  "/store",
  uploadMulter.single("imageUrl"),
  convertData,
  validationBannerData,
  handleUploadOrUpdateImage,
  bindController(BannerController, "create"),
);
router.put(
  "/update/:id",
  uploadMulter.single("imageUrl"),
  convertData,
  validationBannerData,
  handleUploadOrUpdateImage,
  bindController(BannerController, "update"),
);
router.patch("/change-status/:id", bindController(BannerController, "changeStatus"));
router.patch("/change-boolean/:id", bindController(BannerController, "changeBoolean"));
router.delete("/delete/:id", bindController(BannerController, "delete"));
router.delete("/delete-many", bindController(BannerController, "deleteMany"));
router.patch("/restore/:id", bindController(BannerController, "restore"));
router.patch("/restore-many", bindController(BannerController, "restoreMany"));
router.delete("/force/:id", handleDeleteImage, bindController(BannerController, "forceDelete"));
router.delete(
  "/force-many",
  handleDeleteMultipleImages,
  bindController(BannerController, "forceDeleteMany"),
);

module.exports = router;
