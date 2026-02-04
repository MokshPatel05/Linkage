"use client";

import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout/page'
import DashboardLayout from '../../layout/DashboardLayout/page'
import { useSelector, useDispatch } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import styles from "./discover.module.css"
import { BASE_URL } from '@/config';
import { useRouter } from 'next/navigation';  

export default function DiscoverPage() {

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  
  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h1>Discover People</h1>

          <div className={styles.allUserProfile}>
            {
              authState.all_profile_fetched && authState.all_users.map((user) => {
                return (
                  <div key={user._id} className={styles.userCard} onClick={() => {router.push(`/view_profile/${user.userId.username}`)}}>
                    {/* Background Banner (Optional: purely decorative for now) */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '60px',
                      background: '#a0b4b7', opacity: 0.3, zIndex: 0
                    }}></div>

                    <img
                      style={{ zIndex: 1 }} // Ensures image sits on top of banner
                      src={`${BASE_URL}/profile_pictures/${user.userId.profilePicture}`}
                      alt="profile"
                      onError={(e) => { e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }}
                    />

                    <p style={{ zIndex: 1 }}>{user.userId.name}</p>
                    <p style={{ zIndex: 1 }}>@{user.userId.username}</p>

                    {/* Connect Button */}
                    <button className={styles.connectBtn} style={{ zIndex: 1 }}>
                      Connect
                    </button>
                  </div>
                )
              })
            }
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}