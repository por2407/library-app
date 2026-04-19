const {
  getCategories,
  createCategory,
  addCategoriesByBookId,
  deleteCategory,
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

exports.deleteCategoryService = async (id) => {
  return deleteCategory(id);
};

