"use client";

import React, { useEffect, useState } from 'react'
import UserLayout from '@/layout/UserLayout/page'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

const Login = () => {

    const authState = useSelector((state) => state.auth);
    const router = useRouter();

    //useStates
    const [isLogin, setIsLogin] = useState(false);


    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (authState.loggedIn) {
            router.push('/dashboard');
        }
    });

    //Register Handler Logic
    const handleRegister = () => {
        setIsLogin(!isLogin);
    }

    return (
        <UserLayout>
            <div className={styles.container}>

                <div className={styles.cardContainer}>
                    <div className={styles.cardContainer__left}>
                        <p className={styles.cardLeft__heading}>{isLogin ? "Login" : "Register"}</p>

                        <div className={styles.inputContainers}>

                            <div className={styles.inputRow}>
                                <input className={styles.inputFields} type="text" placeholder="Username" />
                                <input className={styles.inputFields} type="text" placeholder="Name" />
                            </div>

                            <input className={styles.inputFields} type="email" placeholder="Email" />
                            <input className={styles.inputFields} type="password" placeholder="Password" />


                            <div
                                onClick={handleRegister}
                                className={styles.buttonWithOutline}>
                                {isLogin ? "Login" : "Register"}
                            </div>
                        </div>
                    </div>
                    <div className={styles.cardContainer__right}>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default Login