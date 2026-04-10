"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  adminSignIn,
  selectAdminIsLoading,
  selectAdminError,
  selectCurrentAdmin,
  clearAdminError,
} from "@/lib/store/slices/admin.reducer";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector(selectAdminIsLoading);
  const adminError = useAppSelector(selectAdminError);
  const currentAdmin = useAppSelector(selectCurrentAdmin);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (currentAdmin) router.push("/admin");
  }, [currentAdmin, router]);

  useEffect(() => {
    if (adminError) {
      toast.error(adminError);
      dispatch(clearAdminError());
    }
  }, [adminError, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("No email or password");
      return;
    }
    dispatch(adminSignIn({ email: form.email, password: form.password }));
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <p>Kindly fill the following details to log into your account</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">E-mail Address</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            placeholder="example@gmail.com"
            autoComplete="email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="pwd-group">
            <input
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder=""
              autoComplete="current-password"
            />
            <img
              onClick={() => setShowPassword(!showPassword)}
              src={!showPassword ? "/eye-slash.svg" : "/eye.svg"}
              alt=""
            />
          </div>
        </div>

        <button type="submit" className="login-btn" id="admin-login-submit" disabled={isLoading}>
          {!isLoading ? "Log in" : <span className="spinner"></span>}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
