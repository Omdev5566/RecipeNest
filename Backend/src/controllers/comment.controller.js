const commentService = require("../services/comment.service");

const getCommentsByRecipe = async (req, res) => {
	try {
		const recipeId = req.params.recipeId || req.params.id;
		const viewerId = req.query.viewerId ? Number(req.query.viewerId) : null;

		if (!recipeId) {
			return res.status(400).json({ message: "Recipe id is required" });
		}

		const comments = await commentService.getCommentsByRecipe(recipeId, viewerId || null);
		return res.status(200).json(comments);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Failed to fetch comments" });
	}
};

const addComment = async (req, res) => {
	try {
		const { recipe_id, comment, rating } = req.body;

		if (!recipe_id || !comment) {
			return res.status(400).json({ message: "recipe_id and comment are required" });
		}

		const result = await commentService.addComment({
			recipe_id,
			comment,
			rating,
			user_id: req.user.id,
		});

		return res.status(201).json(result);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Failed to add comment" });
	}
};

const deleteComment = async (req, res) => {
	try {
		const commentId = req.params.id;

		if (!commentId) {
			return res.status(400).json({ message: "Comment id is required" });
		}

		const result = await commentService.deleteComment(commentId, req.user);
		return res.status(200).json(result);
	} catch (error) {
		console.error(error);
		const statusCode = error.statusCode || 500;
		return res.status(statusCode).json({
			message: error.message || "Failed to delete comment",
		});
	}
};

const toggleCommentLike = async (req, res) => {
	try {
		const commentId = req.params.id;

		if (!commentId) {
			return res.status(400).json({ message: "Comment id is required" });
		}

		const result = await commentService.toggleCommentLike(commentId, req.user.id);
		return res.status(200).json(result);
	} catch (error) {
		console.error(error);
		const statusCode = error.statusCode || 500;
		return res.status(statusCode).json({
			message: error.message || "Failed to toggle like",
		});
	}
};

module.exports = {
	getCommentsByRecipe,
	addComment,
	deleteComment,
	toggleCommentLike,
};
