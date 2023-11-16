const expressAsyncHandler = require('express-async-handler');
const { where } = require('../../model/comment/Comment');
const Comment = require('../../model/comment/Comment');
const Post = require('../../model/post/Post');

//-------------------------------------
// Create Comment
//-------------------------------------
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
	try {
		// 1. Get The User
		const user = req.user;
		// 2. Get The Post Id
		const postId = req.body.postId;
		const commentDescription = req.body.description;

		const getThePost = await Post.findById(postId);

		const createComment = await Comment.create({
			user: user,
			post: getThePost,
			description: commentDescription,
		});

		return res.json({
			message: 'Comment successfully added',
			...createComment,
		});
	} catch (error) {
		return res.json(error);
	}
});

//-------------------------------------
// Fetch All Comments
//-------------------------------------
const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const postId = req.body.postId;
		if (!postId) {
			throw new Error('commentId required');
		}
		const getAllComments = await Comment.find().where({
			post: postId,
		});
		return res.json(getAllComments);
	} catch (error) {
		return res.json(error);
	}
});

//-------------------------------------
// Comment Details
//-------------------------------------
const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const commentId = req.params.id;

		const getCommentById = await Comment.findById(commentId);
		return res.json(getCommentById);
	} catch (error) {
		return res.json(error);
	}
});

//-------------------------------------
// Update
//-------------------------------------
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const commentId = req.params.id;

		const updateComment = await Comment.updateOne({
			description: req.body.description,
		}).where({_id: commentId});

		return res.json({
			message: 'Comment successfully updated',
			...updateComment,
		});
	} catch (error) {
		return res.json(error);
	}
});

//-------------------------------------
// Delete Comment
//-------------------------------------
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
	const commentId = req.params.id;
	const deleteComment = await Comment.deleteOne({
		_id: commentId,
	});
	return res.json({
		message: 'Message successfully deleted!',
		...deleteComment,
	});
});

module.exports = {
	createCommentCtrl,
	fetchAllCommentsCtrl,
	fetchCommentCtrl,
	updateCommentCtrl,
	deleteCommentCtrl,
};
