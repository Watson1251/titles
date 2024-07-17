const express = require("express");
const checkAuth = require("../middleware/check-auth");

const CategoriesController = require("../controllers/categories.controller");

const router = express.Router();

router.get("/", checkAuth, CategoriesController.getCategories);
router.get("/:id", checkAuth, CategoriesController.getCategory);
router.post("/create", checkAuth, CategoriesController.createCategory);
router.post("/update", checkAuth, CategoriesController.updateCategory);
router.post("/delete", checkAuth, CategoriesController.deleteCategory);

module.exports = router;