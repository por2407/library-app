const { asyncHandler } = require("../utils/asyncHandler");
const {
  getCategoryService,
  createCategoryService,
  addCategoriesByBookIdService,
  deleteCategoryService,
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

exports.addCategoriesByBookId = asyncHandler(async (req, res, next) => {
  const { bookId, categoryId } = req.body;
  await addCategoriesByBookIdService(bookId, categoryId);
  return res.status(200).json({
    message: "Category added to book successfully"
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await deleteCategoryService(id);
  return res.status(200).json({
    message: "Category deleted successfully"
  });
});
