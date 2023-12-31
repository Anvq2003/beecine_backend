const express = require("express");
const router = express.Router();
const GenreController = require("../controllers/GenreController");
const bindController = require("../helpers/controllerHelper");
const { validateGenreData } = require("../middlewares/validationMiddleware");
const { paginationMiddleware } = require("../middlewares/paginationMiddleware");

// Routes
router.get("/", paginationMiddleware, bindController(GenreController, "getQuery"));
router.get("/all", bindController(GenreController, "getAll"));
router.get("/check-genre-has-movie/:id", bindController(GenreController, "checkGenreHasMovie"));
router.get("/admin", paginationMiddleware, bindController(GenreController, "getAdmin"));
router.get("/trash", bindController(GenreController, "getTrash"));
router.get("/:param", bindController(GenreController, "getByParam"));
router.post("/store", validateGenreData, bindController(GenreController, "create"));
router.put("/update/:id", validateGenreData, bindController(GenreController, "update"));
router.patch("/change-status/:id", bindController(GenreController, "changeStatus"));
router.patch("/change-boolean/:id", bindController(GenreController, "changeBoolean"));
router.delete("/delete/:id", bindController(GenreController, "delete"));
router.delete("/delete-many", bindController(GenreController, "deleteMany"));
router.patch("/restore/:id", bindController(GenreController, "restore"));
router.patch("/restore-many", bindController(GenreController, "restoreMany"));
router.delete("/force/:id", bindController(GenreController, "forceDelete"));
router.delete("/force-many", bindController(GenreController, "forceDeleteMany"));

module.exports = router;
