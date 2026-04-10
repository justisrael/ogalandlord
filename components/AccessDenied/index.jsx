"use client";
import React from "react";

const AccessDenied = ({ requiredRole }) => (
  <div className="team-page">
    <div className="team-table-container team-empty" style={{ marginTop: 48, flexDirection: "column", gap: 12 }}>
      <img src="/no-user.svg" alt="" style={{ width: 90, opacity: 0.25 }} />
      <h2 style={{ color: "#03045e", margin: 0 }}>Access Denied</h2>
      <p style={{ color: "#888", margin: 0, fontSize: 14 }}>
        You don&apos;t have the necessary permissions to view this page.
        {requiredRole && (
          <> Required role: <strong>{requiredRole}</strong>.</>
        )}
      </p>
    </div>
  </div>
);

export default AccessDenied;
