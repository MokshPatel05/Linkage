"use client";

import React, { Children, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, deletePost } from "@/config/redux/action/postAction";
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
    const postState = useSelector((state) => state.post);

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
            dispatch(getAllPosts());
        }
    }

    const handleDeletePost = async (post_id) => {
        const response = await dispatch(deletePost(post_id));
        if (response.meta.requestStatus === "fulfilled") {
            dispatch(getAllPosts());
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


                        <div className={styles.postsContainer}>
                            {postState.posts.length > 0 ? (
                                postState.posts.map((post) => {
                                    return (
                                        <div key={post._id} className={styles.singleCard}>
                                            <div className={styles.singleCard__header}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <img
                                                        className={styles.singleCard__profilePicture}
                                                        src={`${BASE_URL}/profile_pictures/${post.userId?.profilePicture}`}
                                                        alt="Profile"
                                                        onError={(e) => { e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }}
                                                    />
                                                    <div className={styles.headerInfo}>
                                                        <h3>{post.userId?.name || post.userId?.username || "Unknown User"}</h3>
                                                        <p>{post.userId?.email}</p>
                                                    </div>
                                                </div>
                                                {authState.user.userId.username === post.userId?.username && (
                                                    <div style={{ marginLeft: "auto", cursor: "pointer", color: "red" }} onClick={() => handleDeletePost(post._id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={styles.singleCard__postContainer}>
                                                <p className={styles.postBody}>{post.body}</p>
                                                {post.media && (
                                                    post.fileType === 'mp4' || post.fileType === 'mov' || post.fileType === 'avi' || post.fileType === 'mkv' || post.fileType === 'webm' ? (
                                                        <video className={styles.postMedia} src={`${BASE_URL}/posts/${post.media}`} controls></video>
                                                    ) : (
                                                        <img
                                                            className={styles.postMedia}
                                                            src={`${BASE_URL}/posts/${post.media}`}
                                                            alt="post content"
                                                            onError={(e) => {
                                                                e.target.onerror = null; // Prevent infinite loop
                                                                e.target.style.display = 'none'; // Hide the broken image
                                                                e.target.parentNode.innerHTML += '<p style="padding: 20px; text-align: center; color: gray; background: #f8f8f8;">Media format not supported in browser</p>';
                                                            }}
                                                        />
                                                    )
                                                )}
                                            </div>

                                            <div className={styles.actionsContainer}>
                                                <div className={styles.actionButton}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a2.25 2.25 0 012.25 2.25V7.38a2.25 2.25 0 104.5 0v8.433c0 1.248-.501 2.37-1.317 3.187l-1.028 1.029a1.125 1.125 0 00-.33 1.086c.21.954.27 1.93.179 2.9l-.025.263a2.25 2.25 0 01-3.693 1.25l-2.916-2.916A4.5 4.5 0 0010.89 19H8.25a2.25 2.25 0 01-2.25-2.25v-5.25A2.25 2.25 0 018.25 9.75h.383zM3 10.5v5.25a2.25 2.25 0 002.25 2.25h1.5a.75.75 0 00.75-.75v-6.75a.75.75 0 00-.75-.75h-1.5A2.25 2.25 0 003 10.5z" />
                                                    </svg>
                                                    Like
                                                </div>
                                                <div className={styles.actionButton}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                                    </svg>
                                                    Comment
                                                </div>
                                                <div className={styles.actionButton}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                                    </svg>
                                                    Repost
                                                </div>
                                                <div className={styles.actionButton}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                                    </svg>
                                                    Send
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <h2>No Posts Yet</h2>
                            )}
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