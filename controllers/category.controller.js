const asyncHandler = require("express-async-handler");
const Category = require("../models/category");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .skip(parseInt(req.query.start))
    .limit(parseInt(req.query.limit));
  res.status(200).json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("name is mandatory !");
  }
  
  const category = await Category.create({
    name,
  });

  res.status(201).json(category);
});

module.exports = {
  getCategories,
  createCategory
};
