"use client";

import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout/page'
import DashboardLayout from '../../layout/DashboardLayout/page'
import { useDispatch, useSelector } from 'react-redux';
import { getIncomingConnectionRequests, getMyConnectionRequests, getMyConnections, respondToConnectionRequest } from '@/config/redux/action/authAction';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/config';
import styles from './myConnection.module.css';

const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function MyConnectionsPage() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const router = useRouter();

    const token = authState.token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    useEffect(() => {
        if (!token) return;
        dispatch(getMyConnections({ token }));
        dispatch(getMyConnectionRequests({ token }));
        dispatch(getIncomingConnectionRequests({ token }));
    }, [dispatch, token]);

    const handleRespond = async (otherUserId, actionType) => {
        if (!token) return;
        try {
            await dispatch(
                respondToConnectionRequest({ token, otherUserId, actionType })
            ).unwrap();
            await Promise.all([
                dispatch(getMyConnections({ token })).unwrap(),
                dispatch(getMyConnectionRequests({ token })).unwrap(),
                dispatch(getIncomingConnectionRequests({ token })).unwrap(),
            ]);
        } catch (_) {
            // Silently ignore for now
        }
    };

    const meId = authState.user?.userId?._id;
    const pendingIncoming = authState.connectionRequests.filter((r) => r.status_accepted === null);
    const pendingSent = authState.sentConnectionRequests.filter((r) => r.status_accepted === null);

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    {/* ===== Page Header ===== */}
                    <div className={styles.pageHeader}>
                        <h1>
                            My Network
                            {authState.connections.length > 0 && (
                                <span className={styles.connectionCount}>
                                    {" "} · {authState.connections.length} connection{authState.connections.length !== 1 ? "s" : ""}
                                </span>
                            )}
                        </h1>
                    </div>

                    {/* ===== Pending Invitations Received ===== */}
                    {pendingIncoming.length > 0 && (
                        <div className={styles.sectionCard}>
                            <div className={styles.sectionHeader}>
                                <h2>
                                    Invitations
                                    <span className={styles.badge}>{pendingIncoming.length}</span>
                                </h2>
                            </div>
                            {pendingIncoming.map((req) => (
                                <div key={req._id} className={styles.connectionItem}>
                                    <img
                                        className={styles.profilePicture}
                                        src={`${BASE_URL}/profile_pictures/${req.userId?.profilePicture}`}
                                        alt={req.userId?.name || "User"}
                                        onError={(e) => { e.target.src = DEFAULT_AVATAR }}
                                        onClick={() => req.userId?.username && router.push(`/view_profile/${req.userId.username}`)}
                                    />
                                    <div className={styles.userInfo}>
                                        <p
                                            className={styles.userName}
                                            onClick={() => req.userId?.username && router.push(`/view_profile/${req.userId.username}`)}
                                        >
                                            {req.userId?.name}
                                        </p>
                                        <p className={styles.userUsername}>@{req.userId?.username}</p>
                                    </div>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.btnGhost}
                                            onClick={() => handleRespond(req.userId._id, "reject")}
                                        >
                                            Ignore
                                        </button>
                                        <button
                                            className={styles.btnPrimary}
                                            onClick={() => handleRespond(req.userId._id, "accept")}
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ===== Connections ===== */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <h2>Connections</h2>
                        </div>
                        {authState.connections.length === 0 ? (
                            <div className={styles.emptyState}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                                <p>No connections yet</p>
                                <p style={{ fontSize: "0.85rem", marginTop: "4px", fontWeight: 400 }}>
                                    Discover people to grow your network
                                </p>
                            </div>
                        ) : (
                            authState.connections.map((conn) => {
                                const other =
                                    conn.userId?._id === meId
                                        ? conn.connectionId
                                        : conn.userId;
                                if (!other) return null;
                                return (
                                    <div key={conn._id} className={styles.connectionItem}>
                                        <img
                                            className={styles.profilePicture}
                                            src={`${BASE_URL}/profile_pictures/${other.profilePicture}`}
                                            alt={other.name || "User"}
                                            onError={(e) => { e.target.src = DEFAULT_AVATAR }}
                                            onClick={() => other.username && router.push(`/view_profile/${other.username}`)}
                                        />
                                        <div className={styles.userInfo}>
                                            <p
                                                className={styles.userName}
                                                onClick={() => other.username && router.push(`/view_profile/${other.username}`)}
                                            >
                                                {other.name}
                                            </p>
                                            <p className={styles.userUsername}>@{other.username}</p>
                                        </div>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.btnGhost}
                                                onClick={() => other.username && router.push(`/view_profile/${other.username}`)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16" style={{ marginRight: "4px", verticalAlign: "middle" }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                                </svg>
                                                Message
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* ===== Pending Requests Sent ===== */}
                    {pendingSent.length > 0 && (
                        <div className={styles.sectionCard}>
                            <div className={styles.sectionHeader}>
                                <h2>Sent</h2>
                            </div>
                            {pendingSent.map((req) => (
                                <div key={req._id} className={styles.connectionItem}>
                                    <img
                                        className={styles.profilePicture}
                                        src={`${BASE_URL}/profile_pictures/${req.connectionId?.profilePicture}`}
                                        alt={req.connectionId?.name || "User"}
                                        onError={(e) => { e.target.src = DEFAULT_AVATAR }}
                                        onClick={() => req.connectionId?.username && router.push(`/view_profile/${req.connectionId.username}`)}
                                    />
                                    <div className={styles.userInfo}>
                                        <p
                                            className={styles.userName}
                                            onClick={() => req.connectionId?.username && router.push(`/view_profile/${req.connectionId.username}`)}
                                        >
                                            {req.connectionId?.name}
                                        </p>
                                        <p className={styles.userUsername}>@{req.connectionId?.username}</p>
                                    </div>
                                    <div className={styles.actions}>
                                        <span className={styles.pendingPill}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            Pending
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </UserLayout>
    )
}
