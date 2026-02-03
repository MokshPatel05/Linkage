import User from "../models/user.model.js";
import ConnectionRequest from "../models/connections.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";
import PDFDocument from "pdfkit";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

//convert profile to pdf
const convertProfileToPDF = async (profileData) => {
    const pdf = new PDFDocument();

    const outPutPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outPutPath);
    pdf.pipe(stream);

    pdf.image(`uploads/profile_pictures/${profileData.userId.profilePicture}`, { align: "center", valign: "center", fit: [250, 300] });
    pdf.fontSize(16).text(`Name : ${profileData.userId.name}`, { align: "center" });
    pdf.fontSize(16).text(`Username : ${profileData.userId.username}`, { align: "center" });
    pdf.fontSize(16).text(`Email : ${profileData.userId.email}`, { align: "center" });
    pdf.fontSize(16).text(`Bio : ${profileData.bio}`, { align: "center" });
    pdf.fontSize(16).text(`Current Post : ${profileData.currentPost}`, { align: "center" });
    pdf.fontSize(16).text(`Past Work : `)
    profileData.pastWork.forEach((work, index) => {
        pdf.fontSize(16).text(`Company : ${work.company}`, { align: "center" });
        pdf.fontSize(16).text(`Position : ${work.position}`, { align: "center" });
        pdf.fontSize(16).text(`Years : ${work.years}`, { align: "center" });
    })
    pdf.fontSize(16).text(`Education : `)
    profileData.education.forEach((education, index) => {
        pdf.fontSize(16).text(`School : ${education.school}`, { align: "center" });
        pdf.fontSize(16).text(`Degree : ${education.degree}`, { align: "center" });
        pdf.fontSize(16).text(`Field of Study : ${education.fieldOfStudy}`, { align: "center" });
        pdf.fontSize(16).text(`Years : ${education.years}`, { align: "center" });
    })
    pdf.end();

    return outPutPath;
};


//Register Controller
export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({ Message: "All fields are required" });
        }

        const existingByEmail = await User.findOne({ email });
        if (existingByEmail) {
            return res.status(400).json({ Message: "A user with this email already exists" });
        }

        const existingByUsername = await User.findOne({ username });
        if (existingByUsername) {
            return res.status(400).json({ Message: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();

        const profile = new Profile({
            userId: newUser._id,
        });
        await profile.save();
        return res.status(201).json({ Message: "User created successfully" });

    } catch (e) {
        return res.status(500).json({ Message: "Something went wrong in register controller : " + e.message });
    }
}

//Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ Message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ Message: "Invalid Credentials" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        await User.updateOne({ _id: user._id }, { $set: { token } });

        return res.json({
            Message: "User logged in successfully",
            token
        });
    } catch (e) {
        return res.status(500).json({ Message: "Something went wrong in login controller : " + e.message });
    }
}

//Logout Controller - clear token in DB so session is invalidated
export const logout = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ Message: "Token is required" });
        }
        await User.updateOne({ token }, { $set: { token: "" } });
        return res.json({ Message: "Logged out successfully" });
    } catch (e) {
        return res.status(500).json({ Message: "Something went wrong in logout controller : " + e.message });
    }
};

//Update Profile Picture Controller
export const updateProfilePicture = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }

        user.profilePicture = req.file.filename;
        await user.save();

        return res.status(200).json({ Message: "Profile picture updated successfully" });
    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong in updateProfilePicture controller : " + error.message });
    }
}

//Update User Profile Controller
export const updateUserProfile = async (req, res) => {

    const { token, ...newUserData } = req.body;
    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }
        //getting username and email from newUserData to check if user exists
        const { username, email } = newUserData;

        const exitingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (exitingUser) {
            //if user exists and user id is not the same then give error else let the user update the profile
            if (exitingUser && String(exitingUser._id) !== String(user._id)) {
                return res.status(400).json({ Message: "User already exists" });
            }
        }
        Object.assign(user, newUserData);
        await user.save();

        return res.status(200).json({ Message: "User updated successfully" });
    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong in updateUserProfile controller : " + error.message });
    }
}

//Get User and Profile Controller
export const getUserAndProfile = async (req, res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }
        const userProfile = await Profile.findOne({ userId: user._id })
            .populate("userId", "name username profilePicture");
        return res.status(200).json({ user, userProfile });
    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong in getUserAndProfile controller : " + error.message });
    }
}

//Update Profile Data Controller
export const updateProfileData = async (req, res) => {
    const { token, ...newProfileData } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }
        const profile = await Profile.findOne({ userId: user._id });
        if (!profile) {
            return res.status(404).json({ Message: "Profile not found" });
        }
        Object.assign(profile, newProfileData);
        await profile.save();
        return res.status(200).json({ Message: "Profile updated successfully" });
    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong in updateProfileData controller : " + error.message });
    }
}

//Get All Users Profile Controller
export const getAllUsersProfile = async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate("userId", "name username email profilePicture");

        return res.status(200).json({ profiles });
    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong in getAllUsersProfile controller : " + error.message });
    }

}

//Download Resume Controller
export const downloadResume = async (req, res) => {
    const user_id = req.query.id;
    const userProfile = await Profile.findOne({ userId: user_id })
        .populate("userId", "name username email profilePicture");

    let outPutPath = await convertProfileToPDF(userProfile);

    return res.json({ "Message": outPutPath });
}

//Send Connection Request Controller
export const sendConnectionRequest = async (req, res) => {
    const { token, ConnectionId } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }

        const ConnectionUser = await User.findOne({ _id: ConnectionId });

        if (!ConnectionUser) {
            return res.status(400).json({ Message: "Connection User is not available" });
        }
        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: ConnectionUser._id,
        })
        if (existingRequest) {
            return res.status(400).json({ Message: "Connection Request already sent" });
        }
        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: ConnectionUser._id,
        });

        await request.save();

        return res.status(200).json({ Message: "Connection Request sent successfully" });

    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong in sendConnectionRequest controller : " + error.message });
    }
}

//get My sent connection requests controller
export const getMyConnectionRequest = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }
        const connectionRequests = await ConnectionRequest.find({ userId: user._id }) //list of connection requests sent by the current user
            .populate("connectionId", "name username email profilePicture");
        return res.status(200).json(connectionRequests);
    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong in getMyConnectionRequest controller : " + error.message });
    }
}

//What are my connections requests controller
export const getConnectionRequests = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }
        const connectionRequests = await ConnectionRequest.find({ connectionId: user._id }) //list of connection requests received by the current user
            .populate("userId", "name username email profilePicture");
        return res.status(200).json(connectionRequests);
    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong in getConnectionRequests controller : " + error.message });
    }
}

//accept connection request controller
export const acceptConnectionRequest = async (req, res) => {
    const { token, connectionId, action_type } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }
        const connectionRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionId,
        })
        if (!connectionRequest) {
            return res.status(404).json({ Message: "Connection Request not found" });
        }
        if (action_type === "accept") {
            connectionRequest.status_accepted = true;
            await connectionRequest.save();
            return res.status(200).json({ Message: "Connection Request accepted successfully" });
        } else if (action_type === "reject") {
            connectionRequest.status_accepted = false;
            await connectionRequest.save();
            return res.status(200).json({ Message: "Connection Request rejected successfully" });
        }
    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong in acceptConnectionRequest controller : " + error.message });
    }
}

//comment on post controller
export const commentPost = async (req, res) => {
    const { token, postId, commentBody } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ Message: "Post not found" });
        }
        const comment = new Comment({
            userId: user._id,
            postId: postId,
            comment: commentBody,
        })
        await comment.save();
        return res.status(200).json({ Message: "Comment added successfully" });
    } catch (error) {
        return res.status(500).json({ Message: "Something went wrong in commentPost controller : " + error.message });
    }
}