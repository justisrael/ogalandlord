"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchAdmins,
  createAdmin,
  deleteAdmin,
  updateAdmin,
  selectAdmins,
  selectAdminsLoading,
  selectCreateAdminLoading,
  selectCreateAdminError,
  selectCurrentAdmin,
  clearCreateAdminError,
  ADMIN_ROLES,
  SUPER_ADMIN_ROLE,
  isSuperAdmin,
} from "@/lib/store/slices/admin.reducer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { AccessDenied } from "@/components";

const ALL_ROLES = ADMIN_ROLES; // ['kyc', 'payments', 'listings']

const defaultForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  roles: [],
};

const RoleCheckboxes = ({ selectedRoles, onChange, disabled }) => (
  <div className="role-checkboxes">
    {ALL_ROLES.map((role) => (
      <label key={role} className={`role-checkbox-label ${disabled ? "disabled" : ""}`}>
        <input
          type="checkbox"
          checked={selectedRoles.includes(role)}
          disabled={disabled}
          onChange={() => {
            if (disabled) return;
            onChange(
              selectedRoles.includes(role)
                ? selectedRoles.filter((r) => r !== role)
                : [...selectedRoles, role]
            );
          }}
        />
        <span className="role-checkbox-custom" />
        <span className="role-checkbox-text">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
      </label>
    ))}
  </div>
);

const RoleBadges = ({ roles }) => {
  if (!roles?.length) return <span style={{ color: "#aaa", fontSize: 13 }}>No roles</span>;
  return (
    <div className="role-badges-row">
      {roles.includes(SUPER_ADMIN_ROLE) && (
        <span className="role-badge super">Super Admin</span>
      )}
      {roles.filter((r) => r !== SUPER_ADMIN_ROLE).map((r) => (
        <span key={r} className={`role-badge ${r}`}>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
      ))}
    </div>
  );
};

export default function TeamPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const admins = useAppSelector(selectAdmins);
  const adminsLoading = useAppSelector(selectAdminsLoading);
  const createLoading = useAppSelector(selectCreateAdminLoading);
  const createError = useAppSelector(selectCreateAdminError);
  const currentAdmin = useAppSelector(selectCurrentAdmin);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [editForm, setEditForm] = useState({ fullName: "", roles: [], password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const currentIsSuperAdmin = isSuperAdmin(currentAdmin);

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  useEffect(() => {
    if (createError) {
      toast.error(createError);
      dispatch(clearCreateAdminError());
    }
  }, [createError, dispatch]);

  if (currentAdmin && !currentIsSuperAdmin) {
    return <AccessDenied requiredRole="super_admin" />;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!form.roles.length) {
      toast.error("Please assign at least one role");
      return;
    }
    const result = await dispatch(
      createAdmin({ email: form.email, password: form.password, fullName: form.fullName, roles: form.roles })
    );
    if (!result.error) {
      toast.success("Admin created successfully!");
      setForm(defaultForm);
      setShowCreateModal(false);
    }
  };

  const handleEditOpen = (admin) => {
    setEditModal(admin);
    setEditForm({
      fullName: admin.fullName,
      roles: [...(admin.roles ?? [])],
      password: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.fullName) { toast.error("Full name is required"); return; }

    // If editing a non-super-admin, require at least one role
    const isTargetSuperAdmin = editModal.roles?.includes(SUPER_ADMIN_ROLE);
    if (!isTargetSuperAdmin && !editForm.roles.length) {
      toast.error("Please assign at least one role");
      return;
    }

    // Keep super_admin in roles if the target is a super admin (can't remove it via this form)
    const finalRoles = isTargetSuperAdmin
      ? [SUPER_ADMIN_ROLE, ...editForm.roles.filter((r) => r !== SUPER_ADMIN_ROLE)]
      : editForm.roles;

    const result = await dispatch(
      updateAdmin({ id: editModal.id, fullName: editForm.fullName, roles: finalRoles, password: editForm.password || undefined })
    );
    if (!result.error) {
      toast.success("Admin updated!");
      setEditModal(null);
    } else {
      toast.error("Failed to update admin");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const result = await dispatch(deleteAdmin(deleteConfirm));
    if (!result.error) toast.success("Admin removed");
    else toast.error("Failed to delete admin");
    setDeleteConfirm(null);
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const superAdmins = admins?.filter((a) => a.roles?.includes(SUPER_ADMIN_ROLE)) ?? [];
  const regularAdmins = admins?.filter((a) => !a.roles?.includes(SUPER_ADMIN_ROLE)) ?? [];

  return (
    <div className="team-page">
      <ToastContainer position="top-right" autoClose={4000} />

      {/* Header */}
      <div className="team-header">
        <div className="team-header-left">
          <h1>Team Management</h1>
          <p>Manage admin accounts and role-based permissions</p>
        </div>
        <button className="create-admin-btn" onClick={() => setShowCreateModal(true)} id="create-admin-btn">
          + Add Admin
        </button>
      </div>

      {/* Stats */}
      <div className="team-stats-row">
        <div className="team-stat-card">
          <span className="stat-label">Total Admins</span>
          <span className="stat-value">{admins?.length ?? 0}</span>
        </div>
        <div className="team-stat-card">
          <span className="stat-label">Super Admins</span>
          <span className="stat-value">{superAdmins.length}</span>
        </div>
        <div className="team-stat-card">
          <span className="stat-label">KYC Admins</span>
          <span className="stat-value">{admins?.filter((a) => a.roles?.includes("kyc")).length ?? 0}</span>
        </div>
        <div className="team-stat-card">
          <span className="stat-label">Logged in as</span>
          <span className="stat-value" style={{ fontSize: 14 }}>{currentAdmin?.fullName ?? "—"}</span>
        </div>
      </div>

      {/* Super Admins Table */}
      <div className="team-section-label">Super Admins</div>
      <AdminTable
        admins={superAdmins}
        loading={adminsLoading}
        currentAdmin={currentAdmin}
        onEdit={handleEditOpen}
        onDelete={setDeleteConfirm}
        formatDate={formatDate}
        isSuperSection
      />

      {/* Regular Admins Table */}
      <div className="team-section-label">Admins</div>
      <AdminTable
        admins={regularAdmins}
        loading={adminsLoading}
        currentAdmin={currentAdmin}
        onEdit={handleEditOpen}
        onDelete={setDeleteConfirm}
        formatDate={formatDate}
      />

      {/* ── CREATE MODAL ── */}
      {showCreateModal && (
        <div className="team-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="team-modal" onClick={(e) => e.stopPropagation()}>
            <div className="team-modal-header">
              <h2>Create New Admin</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate} className="team-modal-form">
              <div className="modal-input-group">
                <label>Full Name *</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="modal-input-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@example.com" required />
              </div>
              <div className="modal-input-group">
                <label>Roles * <span style={{ color: "#aaa", fontWeight: 400 }}>(select all that apply)</span></label>
                <RoleCheckboxes selectedRoles={form.roles} onChange={(r) => setForm({ ...form, roles: r })} />
              </div>
              <div className="modal-input-group">
                <label>Password *</label>
                <div className="modal-pwd-group">
                  <input type={showPwd ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required />
                  <img src={showPwd ? "/eye.svg" : "/eye-slash.svg"} alt="toggle" onClick={() => setShowPwd(!showPwd)} style={{ cursor: "pointer" }} />
                </div>
              </div>
              <div className="modal-input-group">
                <label>Confirm Password *</label>
                <div className="modal-pwd-group">
                  <input type={showConfirmPwd ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" required />
                  <img src={showConfirmPwd ? "/eye.svg" : "/eye-slash.svg"} alt="toggle" onClick={() => setShowConfirmPwd(!showConfirmPwd)} style={{ cursor: "pointer" }} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="modal-create-btn" disabled={createLoading} id="confirm-create-admin">
                  {createLoading ? <span className="spinner" /> : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editModal && (
        <div className="team-modal-overlay" onClick={() => setEditModal(null)}>
          <div className="team-modal" onClick={(e) => e.stopPropagation()}>
            <div className="team-modal-header">
              <h2>Edit Admin</h2>
              <button className="modal-close" onClick={() => setEditModal(null)}>✕</button>
            </div>
            <form onSubmit={handleUpdate} className="team-modal-form">
              <div className="modal-input-group">
                <label>Full Name *</label>
                <input type="text" name="fullName" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} required />
              </div>
              <div className="modal-input-group">
                <label>Email</label>
                <input type="email" value={editModal.email} disabled className="disabled-input" />
              </div>
              {editModal.roles?.includes(SUPER_ADMIN_ROLE) ? (
                <div className="modal-input-group">
                  <label>Role</label>
                  <div className="super-admin-note">
                    <span className="role-badge super">Super Admin</span>
                    <span style={{ fontSize: 13, color: "#888", marginLeft: 8 }}>Super admin role cannot be changed</span>
                  </div>
                </div>
              ) : (
                <div className="modal-input-group">
                  <label>Roles * <span style={{ color: "#aaa", fontWeight: 400 }}>(select all that apply)</span></label>
                  <RoleCheckboxes
                    selectedRoles={editForm.roles.filter(r => r !== SUPER_ADMIN_ROLE)}
                    onChange={(r) => setEditForm({ ...editForm, roles: r })}
                  />
                </div>
              )}
              <div className="modal-input-group">
                <label>New Password <span style={{ color: "#aaa", fontWeight: 400 }}>(leave blank to keep current)</span></label>
                <div className="modal-pwd-group">
                  <input type={showPwd ? "text" : "password"} name="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} placeholder="New password (optional)" />
                  <img src={showPwd ? "/eye.svg" : "/eye-slash.svg"} alt="toggle" onClick={() => setShowPwd(!showPwd)} style={{ cursor: "pointer" }} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setEditModal(null)}>Cancel</button>
                <button type="submit" className="modal-create-btn" id="confirm-edit-admin">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div className="team-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="team-modal team-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="team-modal-header">
              <h2>Remove Admin</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <p style={{ padding: "0 24px 16px", color: "#555" }}>
              Are you sure you want to remove this admin? This action cannot be undone.
            </p>
            <div className="modal-actions" style={{ padding: "0 24px 24px" }}>
              <button className="modal-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="modal-delete-btn" onClick={handleDelete} id="confirm-delete-admin">Remove Admin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component: shared admin table
function AdminTable({ admins, loading, currentAdmin, onEdit, onDelete, formatDate, isSuperSection }) {
  if (loading) {
    return (
      <div className="team-table-container team-loading">
        <span className="spinner dark" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!admins?.length) {
    return (
      <div className="team-table-container team-empty">
        <p style={{ color: "#bbb" }}>
          {isSuperSection ? "No super admins found." : "No admins found."}
        </p>
      </div>
    );
  }

  return (
    <div className="team-table-container">
      <table className="team-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className={admin.id === currentAdmin?.id ? "current-admin-row" : ""}>
              <td>
                <div className="admin-name-cell">
                  <span className="admin-avatar-circle">
                    {admin.fullName?.charAt(0)?.toUpperCase() ?? "A"}
                  </span>
                  <span>
                    {admin.fullName}
                    {admin.id === currentAdmin?.id && <span className="you-badge">You</span>}
                  </span>
                </div>
              </td>
              <td>{admin.email}</td>
              <td><RoleBadges roles={admin.roles} /></td>
              <td>{formatDate(admin.createdAt)}</td>
              <td>
                <div className="admin-actions">
                  <button className="action-btn edit-btn" onClick={() => onEdit(admin)} id={`edit-admin-${admin.id}`}>
                    Edit
                  </button>
                  {admin.id !== currentAdmin?.id && (
                    <button className="action-btn delete-btn" onClick={() => onDelete(admin.id)} id={`delete-admin-${admin.id}`}>
                      Remove
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

