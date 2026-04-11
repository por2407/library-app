const {
  getCategoryByName,
  createCategory,
  addCategoriesByBookId,
} = require("../models/categoryModel");

exports.getCategoryService = async (name) => {
  return getCategoryByName(name);
};

exports.createCategoryService = async (name) => {
  return createCategory(name);
};

exports.addCategoriesByBookIdService = async (bookId, catId) => {
  return addCategoriesByBookId(bookId, catId);
};
