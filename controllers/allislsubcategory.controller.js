const asyncHandler = require("express-async-handler");
const IslSubCategory = require("../models/islsubcategory");

const getAllIslSubCategory= asyncHandler(async (req, res) => {
  const allIslsubcategory = await IslSubCategory.find()
    .sort({ _id: 1 });
  res.status(200).json(allIslsubcategory);
});

module.exports = {
  getAllIslSubCategory,
};
