const express = require("express");
const router = express.Router();
const CountryController = require("../controllers/CountryController");
const bindController = require("../helpers/controllerHelper");
const { validateCountryData } = require("../middlewares/validationMiddleware");
const { paginationMiddleware } = require("../middlewares/paginationMiddleware");

// Routes
router.get("/", paginationMiddleware, bindController(CountryController, "getQuery"));
router.get("/all", bindController(CountryController, "getAll"));
router.get("/admin", paginationMiddleware, bindController(CountryController, "getAdmin"));
router.get("/trash", bindController(CountryController, "getTrash"));
router.get("/:param", bindController(CountryController, "getByParam"));
router.post("/store", validateCountryData, bindController(CountryController, "create"));
router.put("/update/:id", validateCountryData, bindController(CountryController, "update"));
router.patch("/change-status/:id", bindController(CountryController, "changeStatus"));
router.delete("/delete/:id", bindController(CountryController, "delete"));
router.delete("/delete-many", bindController(CountryController, "deleteMany"));
router.patch("/restore/:id", bindController(CountryController, "restore"));
router.patch("/restore-many", bindController(CountryController, "restoreMany"));
router.delete("/force/:id", bindController(CountryController, "forceDelete"));
router.delete("/force-many", bindController(CountryController, "forceDeleteMany"));

module.exports = router;
