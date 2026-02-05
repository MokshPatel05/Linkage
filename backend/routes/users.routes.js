import { Router } from "express";
import { register, login, logout, updateProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUsersProfile, downloadResume, getMyConnectionRequest, getConnectionRequests, acceptConnectionRequest, sendConnectionRequest, getUserProfileAndUserBasedOnUsername, getMyConnections, getUserConnectionsByUserId } from "../controllers/users.controller.js";
import multer from 'multer';

const router = Router();

//multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile_pictures')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
//multer middleware
const upload = multer({ storage: storage })

//routes    
router.route("/update_profile_picture")
    .post(upload.single("profile_picture"), updateProfilePicture)

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/user_update").post(updateUserProfile)
router.route("/get_user_and_profile").get(getUserAndProfile)
router.route("/update_profile_data").post(updateProfileData)
router.route("/user/get_all_users_profiles").get(getAllUsersProfile)
router.route("/user/download_resume").get(downloadResume)
router.route("/user/send_connection_request").post(sendConnectionRequest)
router.route("/user/get_my_connection_request").get(getMyConnectionRequest)
router.route("/user/get_connection_requests").get(getConnectionRequests)
router.route("/user/accept_connection_request").post(acceptConnectionRequest)
router.route("/user/get_my_connections").get(getMyConnections)
router.route("/user/get_user_connections_by_user_id").get(getUserConnectionsByUserId)
router.route("/user/get_user_profile_and_user_based_on_username").get(getUserProfileAndUserBasedOnUsername)
export default router;