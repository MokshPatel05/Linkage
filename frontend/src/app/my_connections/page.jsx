"use client";

import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout/page'
import DashboardLayout from '../../layout/DashboardLayout/page'
import { useDispatch, useSelector } from 'react-redux';
import { getIncomingConnectionRequests, getMyConnectionRequests, getMyConnections, respondToConnectionRequest } from '@/config/redux/action/authAction';

export default function MyConnectionsPage() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const token = authState.token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    useEffect(() => {
        if (!token) return;
        // Make sure data is up to date when visiting this page
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

    return (
        <UserLayout>
            <DashboardLayout>
                <div>
                    <h1>My Connections</h1>

                    <section style={{ marginTop: "1rem" }}>
                        <h2>Connections</h2>
                        {authState.connections.length === 0 ? (
                            <p>You have no connections yet.</p>
                        ) : (
                            <ul>
                                {authState.connections.map((conn) => {
                                    const meId = authState.user?.userId?._id;
                                    const other =
                                        conn.userId?._id === meId
                                            ? conn.connectionId
                                            : conn.userId;
                                    if (!other) return null;
                                    return (
                                        <li key={conn._id}>
                                            {other.name} @{other.username}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>

                    <section style={{ marginTop: "1rem" }}>
                        <h2>Pending requests received</h2>
                        {authState.connectionRequests.filter(
                            (r) => r.status_accepted === null
                        ).length === 0 ? (
                            <p>No incoming requests.</p>
                        ) : (
                            <ul>
                                {authState.connectionRequests
                                    .filter((r) => r.status_accepted === null)
                                    .map((req) => (
                                        <li key={req._id}>
                                            {req.userId?.name} @{req.userId?.username}{" "}
                                            <button
                                                onClick={() =>
                                                    handleRespond(req.userId._id, "accept")
                                                }
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRespond(req.userId._id, "reject")
                                                }
                                                style={{ marginLeft: "0.5rem" }}
                                            >
                                                Ignore
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </section>

                    <section style={{ marginTop: "1rem" }}>
                        <h2>Pending requests sent</h2>
                        {authState.sentConnectionRequests.filter(
                            (r) => r.status_accepted === null
                        ).length === 0 ? (
                            <p>No requests sent.</p>
                        ) : (
                            <ul>
                                {authState.sentConnectionRequests
                                    .filter((r) => r.status_accepted === null)
                                    .map((req) => (
                                        <li key={req._id}>
                                            {req.connectionId?.name} @{req.connectionId?.username}
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </section>
                </div>
            </DashboardLayout>
        </UserLayout>
    )
}
