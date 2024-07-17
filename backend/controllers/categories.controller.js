const Category = require("../models/category.model");

exports.getCategories = (req, res, next) => {

  const categoryQuery = Category.find();

  categoryQuery
    .then(fetchedCategories => {
      res.status(200).json({
        message: "Categories fetched successfully!",
        categories: fetchedCategories
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching categories failed!"
      });
    });

};

exports.getCategory = (req, res, next) => {
  Category.findById(req.params.id)
    .then(category => {
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: "Category not found!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching category failed!"
      });
    });
};

exports.createCategory = (req, res, next) => {

  const category = new Category({
    index: Number(req.body.index),
    categoryAr: req.body.categoryAr,
    categoryEn: req.body.categoryEn,
    totalTitles: Number(req.body.totalTitles),
  });

  category
    .save()
    .then(createdCategory => {
      res.status(201).json({
        message: "Category added successfully",
        category: {
          ...createdCategory,
          id: createdCategory._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Creating a category failed!"
      });
    });

};

exports.updateCategory = (req, res, next) => {

  const category = new Category({
    _id: req.body.id,
    index: Number(req.body.index),
    categoryAr: req.body.categoryAr,
    categoryEn: req.body.categoryEn,
    totalTitles: Number(req.body.totalTitles),
  });

  Category.updateOne({ _id: category._id }, category)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Update failed!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't udpate category!"
      });
    });
};

exports.deleteCategory = (req, res, next) => {

  Category.deleteOne({ _id: req.body.id })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Deletion failed!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Deleting category failed!"
      });
    });
};