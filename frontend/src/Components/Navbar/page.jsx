"use client"
import React from 'react'
import styles from './navbar.module.css'
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <nav className={styles.Navbar}>
                <img src="/images/Linkage Logo.png" alt="Linkage" onClick={() => router.push("/")} />


                <div className={styles.NavbarOptionsContainer}>
                    <div
                        onClick={() => { router.push("/login") }}
                        className={styles.buttonJoin}
                    >
                        Login</div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;