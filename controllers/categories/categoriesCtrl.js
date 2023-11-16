const expressAsyncHandler = require('express-async-handler');
const Category = require('../../model/category/Category');

const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const user = req.user;
		const title = req.body.title;

		const createCategory = await Category.create({
			title,
			user,
		});

		return res.json({
			message: 'Category successfully created',
			...createCategory,
		});
	} catch (error) {
		return res.json(error);
	}
});

// Fetch Category
const fetchCategoriesCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const allCategories = await Category.find({}).populate('user').sort({ updatedAt: 'DESC' });
		return res.json(allCategories);
	} catch (error) {
		return res.json(error);
	}
});

// Fetch All Categories
const fetchCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const title = req.query.title;

	try {
		const categoryByTitle = await Category.find({
			title: title,
		});
		const categoryById = await Category.findById(req.params.id);
		return res.json(categoryById);
	} catch (error) {
		return res.json(error);
	}
});

// Update Category
const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const title = req.body.title;
	const user = req.user;
	console.log(req.params.id);

	try {
		const updateCategory = await Category.updateOne(
			{
				_id: req.params.id,
			},
			{
				title: title,
				user: user,
			}
		);

		return res.json(updateCategory);
	} catch (error) {
		return res.json(error);
	}
});

// Delete Category
const deleteCategoryCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const { id } = req.params;
		const deleteCategory = await Category.deleteOne({
			_id: id,
		});

		return res.json(deleteCategory);
	} catch (error) {
		return res.json(error);
	}
});

module.exports = {
	createCategoryCtrl,
	fetchCategoriesCtrl,
	fetchCategoryCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
};
