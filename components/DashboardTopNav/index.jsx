"use client"
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { selectCurrentUser } from '@/lib/store/slices/user.reducer';




import React from 'react'


const TopNav = () => {
    const currentUser = useAppSelector(selectCurrentUser)

    // const { photoURL, fullName } = currentUser;
  return (
    <div className='user-profile-button' >
        { currentUser?.photoURL? <div className='user-img' style={{
          backgroundImage: `url(${currentUser?.photoURL.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}  alt="" /> : <span className='user-img-span' >{fullName[0]}</span> }
        <span className='user-name' >{currentUser?.fullName}</span>
    </div>
  )
}

export default TopNav