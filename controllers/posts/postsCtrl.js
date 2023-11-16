const expressAsyncHandler = require('express-async-handler');
const Post = require('../../model/post/Post');
const User = require('../../model/user/User');

//-------------------------------------
// Create Post
//-------------------------------------
const createPostCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const post = await Post.create({
			user: req.user,
			category: req?.body?.category,
			description: req?.body?.description,
			isDisLiked: false,
			isLiked: false,
			image: req?.file?.filename,
			numViews: 0,
			title: req?.body?.title,
		});
		res.json(post);
	} catch (error) {
		res.json(error);
	}
});

//-------------------------------------
// Fetch All Posts
//-------------------------------------
const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
	try{
		const allPosts = await Post.find({}).populate('user').populate('category').sort({ updatedAt: 'DESC' })
		return res.json(allPosts)
	  }
	  catch(error){
		return res.json(error)
	  }
});

//-------------------------------------
// Fetch a Single Post
//-------------------------------------
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const getPostById = await Post.findById(req.params.id).populate('user').populate('category');
		return res.json({ post: getPostById });
	} catch (error) {
		res.json(error);
	}
});

//-------------------------------------
// Update Post
//-------------------------------------
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const getPostById = await Post.findById(req.params.id);
		if (req.user._id.toString() !== getPostById.user.toString()) {
			return res.json({
				message: "unable to edit other user's post",
			});
		}
		getPostById.title = req?.body?.title;
		getPostById.category = req?.body?.category;
		getPostById.description = req?.body?.description;

		// console.log(getPostById)
		const updatePost = await Post.updateOne(
			{ _id: req.params.id },
			getPostById
		);
		return res.json(updatePost);
	} catch (error) {
		return res.json(error);
	}
});

//-------------------------------------
// Delete Post
//-------------------------------------
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const deletePost = await Post.deleteOne({ _id: req.params.id });

		return res.json(deletePost);
	} catch (error) {
		return res.json(error);
	}
});

//-------------------------------------
// Likes
//-------------------------------------
const toggleAddLikeToPostCtrl = expressAsyncHandler(
	async (req, res) => {
		try{

			const findPost = await Post.findById(req.body._id);
	
			// 2. Find the login user
			const user = req.user;
			const hasUserLiked = findPost.likes.indexOf(user._id);
			console.log(hasUserLiked);
			// 3. Find is this user has liked this post?
			if (hasUserLiked === -1) {
				findPost.isLiked = true;
				findPost.likes.push(user);
				const idx = findPost.disLikes.indexOf(user._id);
				if (idx !== -1) {
					findPost.disLikes.splice(idx, 1);
				}
			} else {
				// 4. Check if this user has dislikes this post?
				// 5. Remove the user from dislikes array if exists
				findPost.isLiked = false;
				const idx = findPost.likes.indexOf(user);
				findPost.likes.splice(idx, 1);
			}
	
			const updatedPost = await Post.updateOne({ _id: req.body._id }, findPost);
			return res.json(updatedPost);
		}catch(error){
			return res.json(error)
		}
		// 1. Find the post to be liked

	}

	// Toggle
	// 6 Remove the user if he has liked the post
);

//-------------------------------------
// Dislikes
//-------------------------------------
const toggleAddDislikeToPostCtrl = expressAsyncHandler(async (req, res) => {
	const findPost = await Post.findById(req.body._id);

	// 2. Find the login user
	const user = req.user;
	const hasUserDisliked = findPost.disLikes.indexOf(user._id);
	// 3. Find is this user has disliked this post?
	if (hasUserDisliked === -1) {
		findPost.isDisLiked = true;
		findPost.disLikes.push(user);
		const idx = findPost.likes.indexOf(user._id);
		if (idx !== -1) {
			findPost.likes.splice(idx, 1);
		}
	} else {
		// 4. Check if this user has likes this post?
		// 5. Remove the user from likes array if exists
		findPost.isDisLiked = false;
		const idx = findPost.disLikes.indexOf(user);
		findPost.disLikes.splice(idx, 1);
	}

	const updatedPost = await Post.updateOne({ _id: req.body._id }, findPost);

	return res.json(updatedPost);
});

module.exports = {
	createPostCtrl,
	fetchPostsCtrl,
	fetchPostCtrl,
	updatePostCtrl,
	deletePostCtrl,
	toggleAddLikeToPostCtrl,
	toggleAddDislikeToPostCtrl,
};
