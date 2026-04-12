const router = require("express").Router();
const { getPopularBooks, getStats } = require("../controllers/adminController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.use(roleMiddleware(["ADMIN"]));

router.get("/popular-books", getPopularBooks);
router.get("/stats", getStats);

module.exports = router;