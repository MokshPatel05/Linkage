"use client"
import React, { useRef } from 'react'
import { flushSync } from 'react-dom'
import styles from './navbar.module.css'
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';
import { logoutUser } from '@/config/redux/action/authAction';

const Navbar = () => {

    const authState = useSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();
    const isLoggingOut = useRef(false);

    const handleLogout = async () => {
        if (isLoggingOut.current) return;
        isLoggingOut.current = true;
        try {
            await dispatch(logoutUser());
            // Flush reset so Navbar re-renders to "Login" before we navigate (no double-tap needed)
            flushSync(() => {
                dispatch(reset());
            });
            router.push("/login");
        } finally {
            isLoggingOut.current = false;
        }
    };

    return (
        <div className={styles.container}>
            <nav className={styles.Navbar}>
                <img src="/images/Linkage Logo.png" alt="Linkage" onClick={() => router.push("/")} />


                <div className={styles.NavbarOptionsContainer}>
                    {
                        authState.loggedIn ? (
                            <div
                                style={{ display: "flex", gap: "1rem" }}>
                                <p>Hey, {authState.user?.userId?.name || "Guest"}</p>
                                <p style={{ color: "#000", cursor: "pointer", fontWeight: "bold" }}>Profile</p>
                                <p onClick={handleLogout}>Logout</p>
                            </div>
                        ) : (
                            <div
                                onClick={() => { router.push("/login") }}
                                className={styles.buttonJoin}>
                                Login
                            </div>
                        )
                    }
                </div>
            </nav>
        </div>
    )
}

export default Navbar;