"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {

    const router = useRouter();

    //if the token not exists then redirect the user to the login page
    useEffect(() => {
        if(localStorage.getItem("token") == null) {
            router.push("/login");
        }
    },[]);
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard;