const express = require("express");
const router = express.Router();
const KeywordController = require("../controllers/KeywordController");
const bindController = require("../helpers/controllerHelper");

// Routes
router.get("/", bindController(KeywordController, "getQuery"));
router.get("/search", bindController(KeywordController, "getByKeyword"));
router.post("/store", bindController(KeywordController, "create"));
router.post("/store-many", bindController(KeywordController, "createMany"));
router.put("/update/:id", bindController(KeywordController, "update"));
router.delete("/delete/:id", bindController(KeywordController, "delete"));

module.exports = router;
