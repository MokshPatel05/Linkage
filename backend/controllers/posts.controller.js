import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";

import bcrypt from "bcrypt";
import crypto from "crypto";

export const activeCheck = (req, res) => {
    return res.status(200).json({ message: "posts are active" });
}

// create post controller
export const createPost = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token }); // await is CRITICAL here!
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = new Post({
            userId: user._id,
            // ...req.body, : we can user this to get all the data from the request body but in this case we need something to check before saving the post so we dont use this.
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
        })

        await post.save();

        return res.status(200).json({ message: "Post created successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong in create post controller : " + error.message });
    }
}

//get all posts controller
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'name username email profilePicture')
            .sort({ createdAt: -1 });

        return res.status(200).json({ posts });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong in get all posts controller : " + error.message });
    }
}

//delete post controller
export const deletePost = async (req, res) => {
    const { token, post_id } = req.body;

    try {
        const user = await User.findOne({ token }); // await is CRITICAL here!
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Post.deleteOne({ _id: post_id });

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong in delete post controller : " + error.message });
    }
}

//get comment by post
export const getCommentByPost = async (req, res) => {
    const { post_id } = req.query;
    //we dont need token here because even if we are unauthorized we can get the comments
    try {
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = await Comment.find({ postId: post_id })
            .populate('userId', 'name username email profilePicture');

        return res.status(200).json({ comments: post.comments });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong in get comment by post controller : " + error.message });
    }
}

//delete comment controller
export const deleteComment = async (req, res) => {
    const { token, comment_id } = req.body;
    try {
        const user = await User.findOne({ token }); // await is CRITICAL here!
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const comment = await Comment.findById(comment_id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await comment.remove();

        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong in delete comment controller : " + error.message });
    }
}

//increament likes controller
export const increamentLikes = async (req, res) => {
    const { post_id } = req.body; //we dont need user token here because even if we are no the owner of the post we can like the post.
    try {
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.likes = post.likes + 1;
        await post.save();

        return res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong in increament likes controller : " + error.message });
    }
}