const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
let uniqueValidator = require('mongoose-unique-validator');

// Create Schema
const userSchema = new mongoose.Schema(
	{
		username: {
			required: [true, 'Username is required'],
			unique: true,
			type: String,
		},
		firstName: {
			required: [true, 'First name is required'],
			type: String,
		},
		lastName: {
			required: [true, 'Last name is required'],
			type: String,
		},
		profilePhoto: {
			type: String,
			default:
				'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
		},
		email: {
			type: String,
			unique: true,
			required: [true, 'Email is required'],
		},
		bio: {
			type: String,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
		},
		postCount: {
			type: Number,
			default: 0,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			enum: ['Admin', 'Guest', 'Blogger'],
		},
		isFollowing: {
			type: Boolean,
			default: false,
		},
		isUnFollowing: {
			type: Boolean,
			default: false,
		},
		isAccountVerified: {
			type: Boolean,
			default: false,
		},
		str_code: {
			type: String,
			default: '10.10.20.2020',
		},
		qualification: {
			type: String,
		},
		file_code: {
			type: String,
		},
		str_file: {
			type: String,
		},
		accountVerificationToken: String,
		accountVerificationTokenExpires: Date,
		viewedBy: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},
		followers: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},
		following: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},
		passwordChangeAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		active: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		timestamps: true,
	}
);

// Virtual Method To Populate Created Post
userSchema.virtual('posts', {
	ref: 'Post',
	foreignField: 'user',
	localField: '_id',
});

// Hash password
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	//hash password
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Match Password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Verify Account
userSchema.methods.createAccountVerificationToken = async function () {
	// Create a Token
	const verificationToken = crypto.randomBytes(32).toString('hex');
	this.accountVerificationToken = crypto
		.createHash('sha256')
		.update(verificationToken)
		.digest('hex');

	// 10 Minutes
	this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;

	return verificationToken;
};

// Password reset/forget
userSchema.methods.createPasswordResetToken = async function () {
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// 10 Minutes
	this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

	return resetToken;
};

//unique validator
userSchema.plugin(uniqueValidator);

// Compile schema into model
const User = mongoose.model('User', userSchema);

module.exports = User;
