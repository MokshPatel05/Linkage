"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import UserLayout from "@/layout/UserLayout/page";
import DashboardLayout from "@/layout/DashboardLayout/page";
import { getAboutUser } from "@/config/redux/action/authAction";
import { BASE_URL, clientServer } from "@/config";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  const token = authState.token;

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [userForm, setUserForm] = useState({
    name: "",
    username: "",
    email: "",
  });

  const [profileForm, setProfileForm] = useState({
    bio: "",
    currentPost: "",
    pastWork: [],
    education: [],
  });

  // redirect to login if no token once hydration is done
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Give AuthRehydrator a moment to run
    const timeout = setTimeout(() => {
      if (!authState.token) {
        router.push("/login");
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [authState.token, router]);

  // Fetch current user + profile if needed
  useEffect(() => {
    if (!token) return;
    if (!authState.profileFetched) {
      dispatch(getAboutUser({ token }));
    }
  }, [dispatch, token, authState.profileFetched]);

  // When authState.user is available, seed the forms
  useEffect(() => {
    const profile = authState.user;
    const user = profile?.userId;
    if (!profile || !user) return;

    setUserForm({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
    });

    setProfileForm({
      bio: profile.bio || "",
      currentPost: profile.currentPost || "",
      pastWork: Array.isArray(profile.pastWork) ? profile.pastWork : [],
      education: Array.isArray(profile.education) ? profile.education : [],
    });
  }, [authState.user]);

  const profilePictureSrc = useMemo(() => {
    const profile = authState.user;
    const user = profile?.userId;
    if (!user?.profilePicture) {
      return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    }
    return `${BASE_URL}/profile_pictures/${user.profilePicture}`;
  }, [authState.user]);

  const handleUserChange = (field, value) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePastWorkChange = (index, field, value) => {
    setProfileForm((prev) => {
      const next = [...prev.pastWork];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, pastWork: next };
    });
  };

  const handleEducationChange = (index, field, value) => {
    setProfileForm((prev) => {
      const next = [...prev.education];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, education: next };
    });
  };

  const addPastWork = () => {
    setProfileForm((prev) => ({
      ...prev,
      pastWork: [...prev.pastWork, { company: "", position: "", years: "" }],
    }));
  };

  const addEducation = () => {
    setProfileForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", fieldOfStudy: "", years: "" },
      ],
    }));
  };

  const handleSave = async () => {
    if (!token) return;

    // Basic front-end validation so we don't break backend "required" fields
    if (
      !userForm.name.trim() ||
      !userForm.username.trim() ||
      !userForm.email.trim()
    ) {
      setSaveError("Name, username, and email are required.");
      setSaveMessage("");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    setSaveError("");

    try {
      // Update basic user fields
      await clientServer.post("/user_update", {
        token,
        ...userForm,
      });

      // Update profile fields
      await clientServer.post("/update_profile_data", {
        token,
        ...profileForm,
      });

      setSaveMessage("Profile updated successfully.");
      // Refresh Redux user/profile data
      dispatch(getAboutUser({ token }));
    } catch (err) {
      const message =
        err?.response?.data?.Message ||
        "Something went wrong while saving your profile.";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = !authState.profileFetched || !authState.user;

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.pageWrapper}>
          <div className={styles.container}>
            {isLoading ? (
              <div className={styles.centeredState}>
                <p>Loading your profile...</p>
              </div>
            ) : (
              <>
                <section className={styles.headerCard}>
                  <div className={styles.banner} />
                  <div className={styles.headerContent}>
                    <div className={styles.avatarWrapper}>
                      <img
                        src={profilePictureSrc}
                        alt={userForm.name || "Profile picture"}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                        }}
                      />
                    </div>
                    <div className={styles.headerText}>
                      <h1>Edit Profile</h1>
                      <p className={styles.subMeta}>
                        Changes here apply only to your own account.
                      </p>
                    </div>
                  </div>
                </section>

                <div className={styles.mainLayout}>
                  <div className={styles.mainColumn}>
                    <section className={styles.card}>
                      <h2>Basic Information</h2>
                      <div className={styles.formRow}>
                        <label>Name</label>
                        <input
                          type="text"
                          value={userForm.name}
                          onChange={(e) =>
                            handleUserChange("name", e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.formRow}>
                        <label>Username</label>
                        <input
                          type="text"
                          value={userForm.username}
                          onChange={(e) =>
                            handleUserChange("username", e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.formRow}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={userForm.email}
                          onChange={(e) =>
                            handleUserChange("email", e.target.value)
                          }
                        />
                      </div>
                    </section>

                    <section className={styles.card}>
                      <h2>About</h2>
                      <div className={styles.formRow}>
                        <label>Headline / Current Role</label>
                        <input
                          type="text"
                          value={profileForm.currentPost}
                          onChange={(e) =>
                            handleProfileChange("currentPost", e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.formRow}>
                        <label>Bio</label>
                        <textarea
                          rows={4}
                          value={profileForm.bio}
                          onChange={(e) =>
                            handleProfileChange("bio", e.target.value)
                          }
                        />
                      </div>
                    </section>

                    <section className={styles.card}>
                      <div className={styles.sectionHeader}>
                        <h2>Experience</h2>
                        <button
                          type="button"
                          className={styles.smallButton}
                          onClick={addPastWork}
                        >
                          + Add
                        </button>
                      </div>
                      {profileForm.pastWork.length === 0 && (
                        <p className={styles.bodyTextMuted}>
                          Add roles you have worked in.
                        </p>
                      )}
                      {profileForm.pastWork.map((work, index) => (
                        <div
                          key={index}
                          className={styles.nestedCard}
                        >
                          <div className={styles.formRow}>
                            <label>Company</label>
                            <input
                              type="text"
                              value={work.company || ""}
                              onChange={(e) =>
                                handlePastWorkChange(
                                  index,
                                  "company",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className={styles.formRow}>
                            <label>Position</label>
                            <input
                              type="text"
                              value={work.position || ""}
                              onChange={(e) =>
                                handlePastWorkChange(
                                  index,
                                  "position",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className={styles.formRow}>
                            <label>Years</label>
                            <input
                              type="text"
                              value={work.years || ""}
                              onChange={(e) =>
                                handlePastWorkChange(
                                  index,
                                  "years",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </section>

                    <section className={styles.card}>
                      <div className={styles.sectionHeader}>
                        <h2>Education</h2>
                        <button
                          type="button"
                          className={styles.smallButton}
                          onClick={addEducation}
                        >
                          + Add
                        </button>
                      </div>
                      {profileForm.education.length === 0 && (
                        <p className={styles.bodyTextMuted}>
                          Add your education history.
                        </p>
                      )}
                      {profileForm.education.map((edu, index) => (
                        <div
                          key={index}
                          className={styles.nestedCard}
                        >
                          <div className={styles.formRow}>
                            <label>School</label>
                            <input
                              type="text"
                              value={edu.school || ""}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "school",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className={styles.formRow}>
                            <label>Degree</label>
                            <input
                              type="text"
                              value={edu.degree || ""}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "degree",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className={styles.formRow}>
                            <label>Field of Study</label>
                            <input
                              type="text"
                              value={edu.fieldOfStudy || ""}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "fieldOfStudy",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className={styles.formRow}>
                            <label>Years</label>
                            <input
                              type="text"
                              value={edu.years || ""}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "years",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </section>
                  </div>

                  <aside className={styles.sideColumn}>
                    <section className={styles.card}>
                      <h2>Save Changes</h2>
                      <p className={styles.bodyTextMuted}>
                        These settings are only available for your own account.
                        Viewing someone else&apos;s profile from Discover remains
                        read-only.
                      </p>
                      {saveMessage && (
                        <p className={styles.successText}>{saveMessage}</p>
                      )}
                      {saveError && (
                        <p className={styles.errorText}>{saveError}</p>
                      )}
                      <button
                        type="button"
                        className={styles.primaryBtn}
                        disabled={isSaving}
                        onClick={handleSave}
                      >
                        {isSaving ? "Saving..." : "Save profile"}
                      </button>
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

