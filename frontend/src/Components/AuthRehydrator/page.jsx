"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTokenFromStorage } from "@/config/redux/reducer/authReducer";

export default function AuthRehydrator({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        // Check: Am I on the server?
        if (typeof window === "undefined") {
            // Yes, I am on the server. 
            // Stop here. Don't try to touch localStorage or the app will crash.
            return;
        }
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(setTokenFromStorage(token));
        }
    }, [dispatch]);

    return children;
}
