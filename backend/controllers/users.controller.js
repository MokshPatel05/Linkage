import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";
import PDFDocument from "pdfkit";


//convert profile to pdf
const convertProfileToPDF = async (profileData) => {
    const pdf = new PDFDocument();
    
    const outPutPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outPutPath);
    pdf.pipe(stream);

    pdf.image(`uploads/${profileData.userId.profilePicture}`,{align:"center", valign:"center", fit:[250,300]});
    pdf.fontSize(16).text(`Name : ${profileData.userId.name}`, { align: "center" }); 
    pdf.fontSize(16).text(`Username : ${profileData.userId.username}`, { align: "center" }); 
    pdf.fontSize(16).text(`Email : ${profileData.userId.email}`, { align: "center" }); 
    pdf.fontSize(16).text(`Bio : ${profileData.bio}`, { align: "center" }); 
    pdf.fontSize(16).text(`Current Post : ${profileData.currentPost}`, { align: "center" }); 
    pdf.fontSize(16).text(`Past Work : `)
    profileData.pastWork.forEach((work,index) =>{
        pdf.fontSize(16).text(`Company : ${work.company}`, { align: "center" });
        pdf.fontSize(16).text(`Position : ${work.position}`, { align: "center" });
        pdf.fontSize(16).text(`Years : ${work.years}`, { align: "center" });
    })
    pdf.fontSize(16).text(`Education : `)
    profileData.education.forEach((education,index) =>{
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

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ Message: "User already exists" });
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
        await User.updateOne({ _id: user._id, $set: { token } });

        return res.status(200).json({ Message: "User logged in successfully" });
    } catch (e) {
        return res.status(500).json({ Message: "Something went wrong in login controller : " + e.message });
    }
}

//Update Profile Picture Controller
export const updateProfilePicture = async (req, res) => {
    const { Token } = req.body;

    try {
        const user = await User.findOne({ Token });
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

    const { Token, ...newUserData } = req.body;
    try {

        const user = await User.findOne({ Token });

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
    const { Token } = req.query;
    try {
        const user = await User.findOne({ Token });
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
    const { Token, ...newProfileData } = req.body;
    try {
        const user = await User.findOne({ Token });
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