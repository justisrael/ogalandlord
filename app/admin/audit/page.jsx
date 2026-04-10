"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchAuditLogs,
  selectAuditLogs,
  selectAuditLogsLoading,
  selectCurrentAdmin,
  isSuperAdmin,
} from "@/lib/store/slices/admin.reducer";
import { AccessDenied } from "@/components";

const ACTION_COLORS = {
  "Admin signed in":   "audit-badge green",
  "Admin signed out":  "audit-badge grey",
  "Created admin":     "audit-badge blue",
  "Updated admin":     "audit-badge yellow",
  "Deleted admin":     "audit-badge red",
  "Updated listing":   "audit-badge blue",
  "Updated user KYC":  "audit-badge green",
};

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

const DetailPills = ({ details }) => {
  if (!details || !Object.keys(details).length) return <span style={{ color: "#bbb", fontSize: 12 }}>—</span>;
  return (
    <div className="audit-details">
      {Object.entries(details).map(([k, v]) => (
        <span key={k} className="audit-detail-pill">
          <span className="audit-detail-key">{k}:</span>{" "}
          <span className="audit-detail-val">{String(v)}</span>
        </span>
      ))}
    </div>
  );
};

export default function AuditLogPage() {
  const dispatch = useAppDispatch();
  const currentAdmin = useAppSelector(selectCurrentAdmin);
  const logs = useAppSelector(selectAuditLogs);
  const loading = useAppSelector(selectAuditLogsLoading);

  if (currentAdmin && !isSuperAdmin(currentAdmin)) {
    return <AccessDenied requiredRole="super_admin" />;
  }

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const uniqueActions = [...new Set(logs.map((l) => l.action))].sort();

  const filtered = logs.filter((log) => {
    const matchesSearch =
      !search ||
      log.adminName?.toLowerCase().includes(search.toLowerCase()) ||
      log.adminEmail?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase());
    const matchesAction = !actionFilter || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="team-page">
      {/* Header */}
      <div className="team-header">
        <div className="team-header-left">
          <h1>Audit Log</h1>
          <p>A record of all admin actions performed on the platform</p>
        </div>
        <button className="create-admin-btn" onClick={() => dispatch(fetchAuditLogs())}>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="team-stats-row">
        <div className="team-stat-card">
          <span className="stat-label">Total Events</span>
          <span className="stat-value">{logs.length}</span>
        </div>
        <div className="team-stat-card">
          <span className="stat-label">Today</span>
          <span className="stat-value">
            {logs.filter((l) => {
              const d = new Date(l.performedAt);
              const now = new Date();
              return d.toDateString() === now.toDateString();
            }).length}
          </span>
        </div>
        <div className="team-stat-card">
          <span className="stat-label">Unique Admins</span>
          <span className="stat-value">
            {new Set(logs.map((l) => l.adminId)).size}
          </span>
        </div>
        <div className="team-stat-card">
          <span className="stat-label">Action Types</span>
          <span className="stat-value">{uniqueActions.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="audit-filters">
        <input
          className="audit-search"
          type="text"
          placeholder="Search by admin name, email or action..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="audit-select"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="">All actions</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="team-table-container team-loading">
          <span className="spinner dark" />
          <p>Loading audit logs...</p>
        </div>
      ) : !filtered.length ? (
        <div className="team-table-container team-empty">
          <p style={{ color: "#bbb" }}>No audit log entries found.</p>
        </div>
      ) : (
        <div className="team-table-container">
          <table className="team-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Performed By</th>
                <th>Email</th>
                <th>Details</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className={ACTION_COLORS[log.action] ?? "audit-badge grey"}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <div className="admin-name-cell">
                      <span className="admin-avatar-circle">
                        {log.adminName?.[0]?.toUpperCase() ?? "A"}
                      </span>
                      <span>{log.adminName}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: "#666" }}>{log.adminEmail}</td>
                  <td><DetailPills details={log.details} /></td>
                  <td style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>
                    {formatDate(log.performedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
