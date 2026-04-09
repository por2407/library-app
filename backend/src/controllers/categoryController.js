const { asyncHandler } = require("../utils/asyncHandler");
const {
  getCategoryService,
  createCategoryService,
} = require("../services/categoryService");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await getCategoryService();
  return res.status(200).json({
    message: "Categories retrieved successfully",
    data: categories,
  });
});

exports.addCategories = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const category = await createCategoryService(name);
  return res.status(200).json({
    message: "Category added successfully",
    data: category,
  });
});
