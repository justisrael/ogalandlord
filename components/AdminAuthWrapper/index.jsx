"use client";
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  adminAutoSignIn,
  selectCurrentAdmin,
  selectAdminIsLoading,
} from "@/lib/store/slices/admin.reducer";
import { useRouter, usePathname } from "next/navigation";
import { Navbar } from "@/components";

const AdminAuthWrapper = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const currentAdmin = useAppSelector(selectCurrentAdmin);
  const isLoading = useAppSelector(selectAdminIsLoading);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage) {
      dispatch(adminAutoSignIn());
    }
  }, [dispatch, isLoginPage]);

  // Always render login page freely
  if (isLoginPage) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="nouser">
        <Navbar />
        <span
          className="spinner dark"
          style={{ width: 40, height: 40, marginTop: 100 }}
        />
      </div>
    );
  }

  if (!currentAdmin) {
    return (
      <div className="nouser">
        <Navbar />
        <img className="no-user-img" src="/no-user.svg" alt="" />
        <h1>Admin Access Required</h1>
        <p>You must be signed in as an admin to view this page.</p>
        <button onClick={() => router.push("/admin/login")}>
          <img src="/user.svg" alt="" /> Admin Sign In
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthWrapper;

