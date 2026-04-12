const {asyncHandler} = require("../utils/asyncHandler");
const {
  getAuthorsService,
  addAuthorsService,
  addAuthorsByBookIdService,
} = require("../services/authorsService");

exports.getAuthors = asyncHandler(async (req, res, next) => {
  const authors = await getAuthorsService();
  return res.status(200).json({
    message: "Authors retrieved successfully",
    data: authors,
  });
});

exports.addAuthors = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const author = await addAuthorsService(name);
  return res.status(200).json({
    message: "Author added successfully",
    data: author,
  });
});

exports.addAuthorsByBookId = asyncHandler(async (req, res, next) => {
  const { bookId, authorId } = req.body;
  await addAuthorsByBookIdService(bookId, authorId);
  return res.status(200).json({
    message: "Author added to book successfully",
  });
});
