#!/usr/bin/env node
/**
 * seed-superadmin.js
 * One-time script to create the Super Admin account in Firestore.
 *
 * Usage:
 *   node scripts/seed-superadmin.js
 *
 * Or with custom credentials via env vars:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword ADMIN_NAME="Your Name" node scripts/seed-superadmin.js
 *
 * Requirements:
 *   npm install --save-dev firebase bcryptjs
 *   (firebase is already installed; bcryptjs was installed in the previous step)
 */

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} = require("firebase/firestore");
const bcryptjs = require("bcryptjs");
const { v4: uuid } = require("uuid");
const readline = require("readline");

// ── Firebase config (same as your app) ───────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBfEm2cI9XRAv-Y9pwNhQuNDyhXbS8O7Mo",
  authDomain: "ogalandlord-afe9d.firebaseapp.com",
  projectId: "ogalandlord-afe9d",
  storageBucket: "ogalandlord-afe9d.appspot.com",
  messagingSenderId: "758303739722",
  appId: "1:758303739722:web:d4a4ba27f7b3e522ee7bb3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Helpers ───────────────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

function validatePassword(pw) {
  if (pw.length < 8) return "Password must be at least 8 characters";
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function seedSuperAdmin() {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║   Oga Landlord — Super Admin Seed Script     ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  // Check if a super admin already exists
  const adminsRef = collection(db, "admins");
  const existingQuery = query(adminsRef, where("roles", "array-contains", "super_admin"));
  const existingSnap = await getDocs(existingQuery);

  if (!existingSnap.empty) {
    console.log("⚠️  A super admin already exists:");
    existingSnap.forEach((d) => {
      const data = d.data();
      console.log(`   → ${data.fullName} (${data.email})`);
    });
    const overwrite = await ask("\nDo you want to create another super admin anyway? (yes/no): ");
    if (overwrite.trim().toLowerCase() !== "yes") {
      console.log("✋  Aborted. No changes made.\n");
      rl.close();
      process.exit(0);
    }
  }

  // Collect credentials (env vars or interactive)
  let email    = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;
  let fullName = process.env.ADMIN_NAME;

  if (!email)    email    = (await ask("Super admin email:    ")).trim();
  if (!fullName) fullName = (await ask("Super admin name:     ")).trim();
  if (!password) password = (await ask("Super admin password: ")).trim();

  rl.close();

  // Validate
  if (!email || !fullName || !password) {
    console.error("\n❌  All fields are required. Aborting.\n");
    process.exit(1);
  }

  const pwErr = validatePassword(password);
  if (pwErr) {
    console.error(`\n❌  ${pwErr}\n`);
    process.exit(1);
  }

  // Check if email already taken
  const emailQuery = query(adminsRef, where("email", "==", email));
  const emailSnap  = await getDocs(emailQuery);
  if (!emailSnap.empty) {
    console.error(`\n❌  An admin with email "${email}" already exists.\n`);
    process.exit(1);
  }

  // Hash & store
  console.log("\n⏳  Hashing password and writing to Firestore...");
  const passwordHash = bcryptjs.hashSync(password, 12);
  const id = uuid();
  const adminData = {
    id,
    email,
    fullName,
    passwordHash,
    roles: ["super_admin"],
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "admins", id), adminData);

  console.log("\n✅  Super admin created successfully!");
  console.log(`   Name:  ${fullName}`);
  console.log(`   Email: ${email}`);
  console.log(`   Roles: [super_admin]`);
  console.log("\n👉  You can now sign in at /admin/login\n");
  process.exit(0);
}

seedSuperAdmin().catch((err) => {
  console.error("\n❌  Unexpected error:", err.message);
  process.exit(1);
});
