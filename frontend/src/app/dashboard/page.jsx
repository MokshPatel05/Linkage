"use client";

import React, { Children, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import UserLayout from '@/layout/UserLayout/page'
import DashboardLayout from '@/layout/DashboardLayout/page'
import styles from './dashboard.module.css'
import { BASE_URL } from "@/config/index";
import { createPost } from "@/config/redux/action/postAction";

const Dashboard = () => {

    const router = useRouter();

    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    //useStates
    const [postContent, setPostContent] = useState("");
    const [fileContent, setFileContent] = useState(null);

    //get all posts from the server logic
    useEffect(() => {
        if (authState.isTokenThere) {
            dispatch(getAllPosts());
            dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        }

        if (!authState.all_profile_fetched) {
            dispatch(getAllUsers());
        }
    }, [authState.isTokenThere]);

    //handle upload
    const handleUpload = async () => {
        const response = await dispatch(createPost({ body: postContent, file: fileContent }))
        if (response.meta.requestStatus === "fulfilled") {
            setPostContent("")
            setFileContent(null)
        }
    }


    if (authState.user) {


        return (
            <UserLayout>
                <DashboardLayout>
                    <div className={styles.scrollComponent}>


                        <div className={styles.createPostContainer}>
                            <img className={styles.userProfile} width={200} src={`${BASE_URL}/profile_pictures/${authState.user.userId?.profilePicture}`} alt="Profile Photo" /> {/*i have mounted the uploads folder in the backend main file thats why i can directly access the uploads folder from the base url and thats why i dont need to write the/uploads in the url */}
                            <textarea onChange={(e) => setPostContent(e.target.value)} value={postContent} placeholder="What's on your mind?" className={styles.textArea} name="" id=""></textarea>
                            <label htmlFor="fileUpload">
                                <div className={styles.Fab}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </div>
                            </label>
                            <input onChange={(e) => setFileContent(e.target.files[0])} type="file" hidden id="fileUpload" />

                            {postContent.length > 0 && <div className={styles.postButton} onClick={handleUpload}>Post</div>}
                        </div>


                    </div>
                </DashboardLayout>
            </UserLayout>
        )
    } else {
        return (
            <UserLayout>
                <DashboardLayout>
                    <h2>Loading...</h2>
                </DashboardLayout>
            </UserLayout>
        )
    }
}

export default Dashboard;