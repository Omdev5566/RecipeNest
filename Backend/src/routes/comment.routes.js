const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/recipe/:recipeId", commentController.getCommentsByRecipe);
router.post("/", protect, commentController.addComment);
router.post("/:id/like", protect, commentController.toggleCommentLike);
router.delete("/:id", protect, commentController.deleteComment);

module.exports = router;
