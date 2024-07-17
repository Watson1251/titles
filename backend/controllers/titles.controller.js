const Title = require("../models/title.model");

exports.getTitles = (req, res, next) => {

  const titleQuery = Title.find();

  titleQuery
    .then(fetchedTitles => {
      res.status(200).json({
        message: "Titles fetched successfully!",
        titles: fetchedTitles
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching titles failed!"
      });
    });

};

exports.getTitle = (req, res, next) => {
  Title.findById(req.params.id)
    .then(title => {
      if (title) {
        res.status(200).json(title);
      } else {
        res.status(404).json({ message: "Title not found!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching title failed!"
      });
    });
};

exports.createTitle = (req, res, next) => {

  const title = new Title({
    index: Number(req.body.index),
    categoryId: req.body.categoryId,
    nameAr: req.body.nameAr,
    nameEn: req.body.nameEn,
    rarity: req.body.rarity,
    points: Number(req.body.points),
    outof: Number(req.body.outof),
    descriptionAr: req.body.descriptionAr,
    descriptionEn: req.body.descriptionEn,
    notes: req.body.notes
  });

  title
    .save()
    .then(createdTitle => {
      res.status(201).json({
        message: "Title added successfully",
        title: {
          ...createdTitle,
          id: createdTitle._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Creating a title failed!"
      });
    });

};

exports.updateTitle = (req, res, next) => {

  const title = new Title({
    _id: req.body.id,
    index: Number(req.body.index),
    categoryId: req.body.categoryId,
    nameAr: req.body.nameAr,
    nameEn: req.body.nameEn,
    rarity: req.body.rarity,
    points: Number(req.body.points),
    outof: Number(req.body.outof),
    descriptionAr: req.body.descriptionAr,
    descriptionEn: req.body.descriptionEn,
    notes: req.body.notes
  });

  Title.updateOne({ _id: title._id }, title)
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
        message: "Couldn't udpate title!"
      });
    });
};

exports.deleteTitle = (req, res, next) => {

  Title.deleteOne({ _id: req.body.id })
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
        message: "Deleting title failed!"
      });
    });
};