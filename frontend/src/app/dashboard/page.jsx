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

const Dashboard = () => {

    const router = useRouter();

    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);


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

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.scrollComponent}>
                    <div className={styles.createPostContainer}>
                        <img src={`${BASE_URL}/profile_pictures/${authState.user.userId?.profilePicture}`} alt="Profile Photo" /> {/* i have mounted the uploads folder in the backend main file thats why i can directly access the uploads folder from the base url and thats why i dont need to write the/uploads in the url */}
                        <input type="text" placeholder="What's on your mind?" />
                        <button>Post</button>
                    </div>
                </div>
            </DashboardLayout>
        </UserLayout>
    )
}

export default Dashboard;