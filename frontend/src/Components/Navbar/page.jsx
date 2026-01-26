"use client"
import React from 'react'
import styles from './navbar.module.css'
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

const Navbar = () => {

    const authState = useSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();

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
                                <p onClick={() => {
                                    localStorage.removeItem("token");
                                    router.push("/login");
                                    dispatch(reset());
                                }}>Logout</p>
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