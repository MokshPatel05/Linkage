import Post from "../models/posts.model.js";
import User from "../models/user.model.js";

import bcrypt from "bcrypt";
import crypto from "crypto";

export const activeCheck = (req, res) => {
    return res.status(200).json({ message: "posts are active" });
}

// create post controller
export const createPost = async (req, res) => {
    const { token } = req.body;

    try {
        const user = User.findOne({ token });
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
        return res.status(500).json({ message: "Something went wrong in create post controller" + error.message });
    }
}