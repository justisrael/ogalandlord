"use client"
import React from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentUser } from '@/lib/store/slices/user.reducer';
import { selectCurrentAdmin } from '@/lib/store/slices/admin.reducer';
import { usePathname } from 'next/navigation';

const TopNav = () => {
  const pathname = usePathname();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentAdmin = useAppSelector(selectCurrentAdmin);

  const isAdminRoute = pathname?.startsWith('/admin');
  const person = isAdminRoute ? currentAdmin : currentUser;

  if (!person) return <div className="user-profile-button" />;

  return (
    <div className="user-profile-button">
      {person.photoURL ? (
        <div
          className="user-img"
          style={{
            backgroundImage: `url(${person.photoURL.url ?? person.photoURL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <span className="user-img-span">
          {person.fullName?.[0]?.toUpperCase() ?? "A"}
        </span>
      )}
      <span className="user-name">{person.fullName}</span>
    </div>
  );
};

export default TopNav;
