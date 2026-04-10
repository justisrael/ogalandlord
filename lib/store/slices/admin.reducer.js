import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import bcryptjs from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import {
  fetchAllUnverifiedListings,
  fetchAllTransactions,
  fetchAllUnverifiedUsers,
  updateListings,
  updateUsers,
  fetchAdminByEmail,
  createAdminDocument,
  fetchAllAdmins,
  deleteAdminDocument,
  updateAdminDocument,
  saveAuditLog,
  fetchAuditLogs as fetchAuditLogsFromFirebase,
} from "@/lib/firebase/firebase.utils";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "ogalandlord_admin_secret";
const ADMIN_TOKEN_KEY = "ogalandlord_admin_token";

// Roles definition
export const ADMIN_ROLES = ["kyc", "payments", "listings"];
export const SUPER_ADMIN_ROLE = "super_admin";

// Role helpers
export const isSuperAdmin = (admin) =>
  Array.isArray(admin?.roles) && admin.roles.includes(SUPER_ADMIN_ROLE);

export const hasRole = (admin, role) =>
  isSuperAdmin(admin) || (Array.isArray(admin?.roles) && admin.roles.includes(role));

// JWT helpers
const getSecret = () => new TextEncoder().encode(JWT_SECRET);

const signAdminToken = async (payload) =>
  await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());

const verifyAdminToken = async (token) => {
  const { payload } = await jwtVerify(token, getSecret());
  return payload;
};

// ---- AUTH THUNKS ----

export const adminSignIn = createAsyncThunk(
  "admin/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const admin = await fetchAdminByEmail(email);
      const passwordMatch = bcryptjs.compareSync(password, admin.passwordHash);
      if (!passwordMatch) return rejectWithValue("Invalid email or password");

      const tokenPayload = {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        roles: admin.roles ?? [],
      };
      const token = await signAdminToken(tokenPayload);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);

      const { passwordHash, ...safeAdmin } = admin;
      await saveAuditLog({ action: "Admin signed in", adminId: safeAdmin.id, adminName: safeAdmin.fullName, adminEmail: safeAdmin.email });
      return { admin: safeAdmin, token };
    } catch (error) {
      return rejectWithValue(error.message || "Sign in failed");
    }
  }
);

export const adminSignOut = createAsyncThunk("admin/signOut", async (_, { dispatch }) => {
  await dispatch(logAuditAction({ action: "Admin signed out" }));
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  return null;
});

export const adminAutoSignIn = createAsyncThunk(
  "admin/autoSignIn",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) return rejectWithValue("No token");
      const payload = await verifyAdminToken(token);
      return {
        admin: {
          id: payload.id,
          email: payload.email,
          fullName: payload.fullName,
          roles: payload.roles ?? [],
        },
        token,
      };
    } catch {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      return rejectWithValue("Session expired");
    }
  }
);

// ---- ADMIN MANAGEMENT THUNKS ----

export const createAdmin = createAsyncThunk(
  "admin/createAdmin",
  async ({ email, password, fullName, roles = [] }, { rejectWithValue, dispatch }) => {
    try {
      const passwordHash = bcryptjs.hashSync(password, 10);
      const admin = await createAdminDocument({ email, passwordHash, fullName, roles });
      const { passwordHash: _, ...safeAdmin } = admin;
      await dispatch(fetchAdmins());
      await dispatch(logAuditAction({ action: "Created admin", details: { targetEmail: email, targetName: fullName, roles } }));
      return safeAdmin;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create admin");
    }
  }
);

export const fetchAdmins = createAsyncThunk(
  "admin/fetchAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const admins = await fetchAllAdmins();
      return admins.map(({ passwordHash, ...safe }) => safe);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  "admin/deleteAdmin",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await deleteAdminDocument(id);
      await dispatch(fetchAdmins());
      await dispatch(logAuditAction({ action: "Deleted admin", details: { targetId: id } }));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAdmin = createAsyncThunk(
  "admin/updateAdmin",
  async ({ id, fullName, roles, password }, { rejectWithValue, dispatch }) => {
    try {
      const updates = { id, fullName, roles };
      if (password) {
        updates.passwordHash = bcryptjs.hashSync(password, 10);
      }
      await updateAdminDocument(updates);
      await dispatch(fetchAdmins());
      await dispatch(logAuditAction({ action: "Updated admin", details: { targetId: id, fullName, roles, passwordChanged: !!password } }));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ---- EXISTING ADMIN DATA THUNKS ----

export const fetchUnverifiedListings = createAsyncThunk(
  "admin/fetchUnverifiedListings",
  async (_, { rejectWithValue }) => {
    try {
      const listings = await fetchAllUnverifiedListings();
      return listings.map((listing) => {
        if (listing.uploadDate?.seconds) {
          listing.uploadDate = new Date(listing.uploadDate.seconds * 1000).toISOString();
        }
        if (Array.isArray(listing.updatedPrice)) {
          listing.updatedPrice = listing.updatedPrice.map((p) => {
            if (p.date?.seconds) p.date = new Date(p.date.seconds * 1000).toISOString();
            return p;
          });
        }
        return listing;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUnverifiedUsers = createAsyncThunk(
  "admin/fetchUnverifiedUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllUnverifiedUsers();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const adminEditListings = createAsyncThunk(
  "admin/updateListing",
  async (listing, { rejectWithValue, dispatch }) => {
    try {
      const status = await updateListings(listing);
      await dispatch(fetchUnverifiedListings());
      await dispatch(logAuditAction({ action: "Updated listing", details: { listingId: listing.id, stage: listing.stage } }));
      return status;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const adminEditUsers = createAsyncThunk(
  "admin/updateUser",
  async (user, { rejectWithValue, dispatch }) => {
    try {
      const status = await updateUsers(user);
      await dispatch(fetchUnverifiedUsers());
      await dispatch(logAuditAction({ action: "Updated user KYC", details: { userId: user.id, verified: user.verified } }));
      return status;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  "admin/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllTransactions();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ---- AUDIT LOG THUNKS ----

export const logAuditAction = createAsyncThunk(
  "admin/logAuditAction",
  async ({ action, details = {} }, { getState }) => {
    const state = getState();
    const admin = state.admin.currentAdmin;
    const log = await saveAuditLog({
      action,
      adminId: admin?.id ?? "unknown",
      adminName: admin?.fullName ?? "Unknown",
      adminEmail: admin?.email ?? "unknown",
      details,
    });
    return log;
  }
);

export const fetchAuditLogs = createAsyncThunk(
  "admin/fetchAuditLogs",
  async (_, { rejectWithValue }) => {
    try {
      const logs = await fetchAuditLogsFromFirebase();
      return logs.sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ---- SLICE ----

const INITIAL_STATE = {
  currentAdmin: null,
  adminToken: null,
  adminIsLoading: true,
  adminError: null,
  admins: [],
  adminsLoading: false,
  adminsError: null,
  createAdminLoading: false,
  createAdminError: null,
  unverifiedListings: null,
  unVerifiedUsers: null,
  transactions: [],
  auditLogs: [],
  auditLogsLoading: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState: INITIAL_STATE,
  reducers: {
    clearAdminError: (state) => { state.adminError = null; },
    clearCreateAdminError: (state) => { state.createAdminError = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminSignIn.pending,  (state) => { state.adminIsLoading = true; state.adminError = null; })
      .addCase(adminSignIn.fulfilled, (state, { payload }) => {
        state.adminIsLoading = false;
        state.currentAdmin = payload.admin;
        state.adminToken = payload.token;
      })
      .addCase(adminSignIn.rejected, (state, { payload }) => {
        state.adminIsLoading = false;
        state.adminError = payload;
      })
      .addCase(adminSignOut.fulfilled, (state) => {
        state.currentAdmin = null;
        state.adminToken = null;
      })
      .addCase(adminAutoSignIn.pending,  (state) => { state.adminIsLoading = true; })
      .addCase(adminAutoSignIn.fulfilled, (state, { payload }) => {
        state.adminIsLoading = false;
        state.currentAdmin = payload.admin;
        state.adminToken = payload.token;
      })
      .addCase(adminAutoSignIn.rejected, (state) => {
        state.adminIsLoading = false;
        state.currentAdmin = null;
        state.adminToken = null;
      })
      .addCase(fetchAdmins.pending,    (state) => { state.adminsLoading = true; state.adminsError = null; })
      .addCase(fetchAdmins.fulfilled,  (state, { payload }) => { state.adminsLoading = false; state.admins = payload; })
      .addCase(fetchAdmins.rejected,   (state, { payload }) => { state.adminsLoading = false; state.adminsError = payload; })
      .addCase(createAdmin.pending,    (state) => { state.createAdminLoading = true; state.createAdminError = null; })
      .addCase(createAdmin.fulfilled,  (state) => { state.createAdminLoading = false; })
      .addCase(createAdmin.rejected,   (state, { payload }) => { state.createAdminLoading = false; state.createAdminError = payload; })
      .addCase(deleteAdmin.rejected,   (state, { payload }) => { state.adminsError = payload; })
      .addCase(updateAdmin.rejected,   (state, { payload }) => { state.adminsError = payload; })
      .addCase(fetchUnverifiedListings.fulfilled, (state, { payload }) => { state.unverifiedListings = payload; })
      .addCase(fetchUnverifiedUsers.fulfilled,    (state, { payload }) => { state.unVerifiedUsers = payload; })
      .addCase(fetchTransactions.fulfilled,       (state, { payload }) => { state.transactions = payload; })
      .addCase(fetchAuditLogs.pending,   (state) => { state.auditLogsLoading = true; })
      .addCase(fetchAuditLogs.fulfilled, (state, { payload }) => { state.auditLogsLoading = false; state.auditLogs = payload; })
      .addCase(fetchAuditLogs.rejected,  (state) => { state.auditLogsLoading = false; })
      .addCase(logAuditAction.fulfilled, (state, { payload }) => {
        if (payload) state.auditLogs = [payload, ...state.auditLogs];
      });
  },
});

export const adminReducer = adminSlice.reducer;
export const { clearAdminError, clearCreateAdminError } = adminSlice.actions;

// ---- SELECTORS ----
const selectAdminSlice = (state) => state.admin;

export const selectCurrentAdmin      = createSelector([selectAdminSlice], (a) => a.currentAdmin);
export const selectAdminIsLoading    = createSelector([selectAdminSlice], (a) => a.adminIsLoading);
export const selectAdminError        = createSelector([selectAdminSlice], (a) => a.adminError);
export const selectAdminToken        = createSelector([selectAdminSlice], (a) => a.adminToken);
export const selectAdmins            = createSelector([selectAdminSlice], (a) => a.admins);
export const selectAdminsLoading     = createSelector([selectAdminSlice], (a) => a.adminsLoading);
export const selectCreateAdminLoading = createSelector([selectAdminSlice], (a) => a.createAdminLoading);
export const selectCreateAdminError  = createSelector([selectAdminSlice], (a) => a.createAdminError);
export const selectUnverfiedListings = createSelector([selectAdminSlice], (a) => a.unverifiedListings);
export const selectUnverfiedUsers    = createSelector([selectAdminSlice], (a) => a.unVerifiedUsers);
export const selectAllTransactions   = createSelector([selectAdminSlice], (a) => a.transactions);
export const selectAuditLogs         = createSelector([selectAdminSlice], (a) => a.auditLogs ?? []);
export const selectAuditLogsLoading  = createSelector([selectAdminSlice], (a) => a.auditLogsLoading ?? false);
