"use client";

import React, { useEffect, useState } from 'react'
import UserLayout from '@/layout/UserLayout/page'
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { clearMessage } from '@/config/redux/reducer/authReducer';

const Login = () => {

    const authState = useSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();
    //useStates
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (authState.loggedIn) {
            router.push('/dashboard');
        }
    }, [authState.loggedIn]);

    //check if the token assists then redirect the user into the "/dashboard"
    useEffect(() => {
        if (authState.token) {
            router.push('/dashboard');
        }
    }, []);

    //clear the error or success message in the form if the form has been chagned
    useEffect(() => {
        dispatch(clearMessage());
    }, [isLogin]);

    //Register Handler Logic
    const handleRegister = () => {
        dispatch(registerUser({ username, name, email, password }));
    }

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    }
    return (
        <UserLayout>
            <div className={styles.container}>

                <div className={styles.cardContainer}>
                    <div className={styles.cardContainer__left}>
                        <p className={styles.cardLeft__heading}>{isLogin ? "Login" : "Register"}</p>
                        <p style={{ color: authState.isError ? "red" : "green" }}>
                            {typeof authState.message === 'string' ? authState.message : authState.message.Message}
                        </p>
                        <div className={styles.inputContainers}>

                            {!isLogin && (
                                <div className={styles.inputRow}>
                                    <input className={styles.inputFields} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                                    <input className={styles.inputFields} type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                                </div>
                            )}

                            <input className={styles.inputFields} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                            <input className={styles.inputFields} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />


                            <div
                                onClick={() => {
                                    if (isLogin) {
                                        handleLogin();
                                    } else {
                                        handleRegister();
                                    }
                                }}
                                className={styles.buttonWithOutline}>
                                {isLogin ? "Login" : "Register"}
                            </div>
                        </div>
                    </div>
                    <div className={styles.cardContainer__right}>
                        <div>
                            {isLogin ? <p style={{ marginBottom: '1rem' }}>Don't have an account?</p> : <p style={{ marginBottom: '1rem' }}>Already have an account?</p>}
                            <div
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                }}
                                className={styles.buttonWithOutline}>{isLogin ? "Register" : "Login"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default Login