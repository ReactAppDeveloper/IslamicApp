const asyncHandler = require("express-async-handler");
const Category = require("../models/category");

//@desc Get all categories
//@route GET /api/categories
//@access private
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .skip(parseInt(req.query.start))
    .limit(parseInt(req.query.limit));
  res.status(200).json(categories);
});

//@desc Create New category
//@route POST /api/categories
//@access private
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
