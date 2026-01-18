"use client";

import React from 'react'
import Navbar from '@/Components/Navbar/page'
function UserLayout({children}) {
  return (
    <div>
    <Navbar />
    {children}
    </div>
  )
}

export default UserLayout;