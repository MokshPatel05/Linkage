"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from '@/layout/UserLayout/page.jsx'
import DashboardLayout from '@/layout/DashboardLayout/page'
import { BASE_URL, clientServer } from "@/config";
import { getAboutUser } from "@/config/redux/action/authAction";
import styles from "./viewProfile.module.css";

export default function ViewProfilePage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const rawUsername = params?.username;

    // Next can sometimes return an array – normalise to string
    const username = useMemo(() => {
        if (Array.isArray(rawUsername)) return rawUsername[0];
        return rawUsername || "";
    }, [rawUsername]);

    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Ensure we know who is logged in (so we can show "Edit profile" only for own page)
    useEffect(() => {
        const token = authState.token;
        if (!token) return;
        if (!authState.profileFetched) {
            dispatch(getAboutUser({ token }));
        }
    }, [authState.token, authState.profileFetched, dispatch]);

    useEffect(() => {
        if (!username) return;

        let cancelled = false;
        setIsLoading(true);
        setError("");

        clientServer
            .get("/user/get_user_profile_and_user_based_on_username", {
                params: { username },
            })
            .then((res) => {
                if (cancelled) return;
                setProfile(res.data.profile);
            })
            .catch((err) => {
                if (cancelled) return;
                const message =
                    err?.response?.data?.Message ||
                    "Unable to load profile. Please try again.";
                setError(message);
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [username]);

    const user = profile?.userId;

    const profilePictureSrc = user?.profilePicture
        ? `${BASE_URL}/profile_pictures/${user.profilePicture}`
        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    const isOwnProfile =
        !!authState.user?.userId?.username &&
        authState.user.userId.username === user?.username;

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.pageWrapper}>
                    <div className={styles.container}>
                        {isLoading && (
                            <div className={styles.centeredState}>
                                <p>Loading profile...</p>
                            </div>
                        )}

                        {!isLoading && error && (
                            <div className={styles.centeredState}>
                                <p className={styles.errorText}>{error}</p>
                            </div>
                        )}

                        {!isLoading && !error && profile && (
                            <>
                                {/* Top profile header (similar to LinkedIn) */}
                                <section className={styles.headerCard}>
                                    <div className={styles.banner} />

                                    <div className={styles.headerContent}>
                                        <div className={styles.avatarWrapper}>
                                            <img
                                                src={profilePictureSrc}
                                                alt={user?.name || "Profile picture"}
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                                                }}
                                            />
                                        </div>

                                        <div className={styles.headerText}>
                                            <h1>{user?.name}</h1>
                                            <p className={styles.headline}>
                                                {profile.currentPost || "Member of Linkage community"}
                                            </p>
                                            <p className={styles.subMeta}>
                                                @{user?.username}
                                                {user?.email ? (
                                                    <span className={styles.dotSeparator}>
                                                        {user.email}
                                                    </span>
                                                ) : null}
                                            </p>
                                        </div>

                                        <div className={styles.headerActions}>
                                            {isOwnProfile ? (
                                                <button
                                                    className={styles.primaryBtn}
                                                    onClick={() => router.push("/profile")}
                                                >
                                                    Edit profile
                                                </button>
                                            ) : (
                                                <>
                                                    <button className={styles.primaryBtn}>Connect</button>
                                                    <button className={styles.secondaryBtn}>Message</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                <div className={styles.mainLayout}>
                                    {/* Left column: About, Experience, Education */}
                                    <div className={styles.mainColumn}>
                                        {/* About */}
                                        <section className={styles.card}>
                                            <h2>About</h2>
                                            <p className={styles.bodyText}>
                                                {profile.bio || "This member has not added a bio yet."}
                                            </p>
                                        </section>

                                        {/* Experience */}
                                        <section className={styles.card}>
                                            <h2>Experience</h2>
                                            {profile.pastWork && profile.pastWork.length > 0 ? (
                                                <ul className={styles.experienceList}>
                                                    {profile.pastWork.map((work, index) => (
                                                        <li key={index} className={styles.experienceItem}>
                                                            <div className={styles.expTitleRow}>
                                                                <span className={styles.expPosition}>
                                                                    {work.position || "Position"}
                                                                </span>
                                                                {work.years && (
                                                                    <span className={styles.expYears}>
                                                                        {work.years}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={styles.expCompany}>
                                                                {work.company || "Company"}
                                                            </p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className={styles.bodyTextMuted}>
                                                    No experience information added yet.
                                                </p>
                                            )}
                                        </section>

                                        {/* Education */}
                                        <section className={styles.card}>
                                            <h2>Education</h2>
                                            {profile.education && profile.education.length > 0 ? (
                                                <ul className={styles.experienceList}>
                                                    {profile.education.map((edu, index) => (
                                                        <li key={index} className={styles.experienceItem}>
                                                            <div className={styles.expTitleRow}>
                                                                <span className={styles.expPosition}>
                                                                    {edu.school || "School"}
                                                                </span>
                                                                {edu.years && (
                                                                    <span className={styles.expYears}>
                                                                        {edu.years}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={styles.expCompany}>
                                                                {[edu.degree, edu.fieldOfStudy]
                                                                    .filter(Boolean)
                                                                    .join(" • ") || "Education details"}
                                                            </p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className={styles.bodyTextMuted}>
                                                    No education information added yet.
                                                </p>
                                            )}
                                        </section>
                                    </div>

                                    {/* Right column: Profile sidebar like LinkedIn */}
                                    <aside className={styles.sideColumn}>
                                        <section className={styles.card}>
                                            <h2>Profile Info</h2>
                                            <div className={styles.sideInfoRow}>
                                                <span className={styles.sideLabel}>Name</span>
                                                <span className={styles.sideValue}>
                                                    {user?.name || "-"}
                                                </span>
                                            </div>
                                            <div className={styles.sideInfoRow}>
                                                <span className={styles.sideLabel}>Username</span>
                                                <span className={styles.sideValue}>
                                                    @{user?.username || "-"}
                                                </span>
                                            </div>
                                            {user?.email && (
                                                <div className={styles.sideInfoRow}>
                                                    <span className={styles.sideLabel}>Email</span>
                                                    <span className={styles.sideValue}>
                                                        {user.email}
                                                    </span>
                                                </div>
                                            )}
                                        </section>
                                    </aside>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}