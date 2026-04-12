const {
  getCategories,
  createCategory,
  addCategoriesByBookId,
} = require("../models/categoryModel");

exports.getCategoryService = async () => {
  return getCategories();
};

exports.createCategoryService = async (name) => {
  return createCategory(name);
};

exports.addCategoriesByBookIdService = async (bookId, categoryId) => {
  return addCategoriesByBookId(bookId, categoryId);
};

