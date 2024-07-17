const express = require("express");
const checkAuth = require("../middleware/check-auth");

const TitlesController = require("../controllers/titles.controller");

const router = express.Router();

router.get("/", checkAuth, TitlesController.getTitles);
router.get("/:id", checkAuth, TitlesController.getTitle);
router.post("/create", checkAuth, TitlesController.createTitle);
router.post("/update", checkAuth, TitlesController.updateTitle);
router.post("/delete", checkAuth, TitlesController.deleteTitle);

module.exports = router;