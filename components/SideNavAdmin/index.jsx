"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { adminSignOut, selectCurrentAdmin, hasRole, SUPER_ADMIN_ROLE } from "@/lib/store/slices/admin.reducer";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Home",      href: "/admin",          icon: "/dashboard.svg", iconActive: "/dashboard-w.svg", requiredRole: null },
  { label: "Listings",  href: "/admin/listings",  icon: "/listings.svg",  iconActive: "/listings-w.svg",  requiredRole: "listings" },
  { label: "KYC",       href: "/admin/kyc",       icon: "/profile.svg",   iconActive: "/profile-w.svg",   requiredRole: "kyc" },
  { label: "Payments",  href: "/admin/payments",  icon: "/profile.svg",   iconActive: "/profile-w.svg",   requiredRole: "payments" },
  { label: "Team",      href: "/admin/team",      icon: "/profile.svg",   iconActive: "/profile-w.svg",   requiredRole: SUPER_ADMIN_ROLE },
  { label: "Audit Log", href: "/admin/audit",     icon: "/profile.svg",   iconActive: "/profile-w.svg",   requiredRole: SUPER_ADMIN_ROLE },
];

const SideNavAdmin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const currentAdmin = useAppSelector(selectCurrentAdmin);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = async () => {
    await dispatch(adminSignOut());
    router.push("/admin/login");
  };

  const isActive = (href) => pathname === href;

  if (!currentAdmin) return <div className="sidebar" />;

  const visibleItems = navItems.filter((item) => {
    if (!item.requiredRole) return true;
    return hasRole(currentAdmin, item.requiredRole);
  });

  return (
    <div className="sidebar">
      <ul className="menu">
        {visibleItems.map((item) => (
          <li
            key={item.href}
            className={`menu-item ${isActive(item.href) ? "active" : ""}`}
            onMouseEnter={() => setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <a href={item.href} className="menu-link">
              <img
                src={
                  isActive(item.href) || hoveredItem === item.href
                    ? item.iconActive
                    : item.icon
                }
                alt={item.label}
              />
              {item.label}
            </a>
          </li>
        ))}

        <li
          className="menu-item logout"
          onClick={handleLogout}
          onMouseEnter={() => setHoveredItem("logout")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <a className="menu-link">
            <img
              src={hoveredItem === "logout" ? "/logout-w.svg" : "/logout.svg"}
              alt="Logout"
            />
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SideNavAdmin;
