import { z } from "zod";

export type User = {
  id: string;
  email: string;
  name?: string;
};

export type AccountRecord = {
  passwordHash: string;
  name?: string;
  plan?: string; // e.g., Trial, Free, Pro
  purchasedAt?: string; // ISO date
  expiresAt?: string; // ISO date
};

const CREDENTIALS_KEY = "app_credentials"; // map of email -> AccountRecord
const SESSION_KEY = "app_session"; // stores current user email

const authSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Include letters and numbers"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

function readCreds(): Record<string, AccountRecord> {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCreds(data: Record<string, AccountRecord>) {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(data));
}

function ensureAccountDefaults(rec: AccountRecord): AccountRecord {
  // Ensure plan and dates exist for older records
  if (!rec.plan || !rec.purchasedAt || !rec.expiresAt) {
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return {
      ...rec,
      plan: rec.plan ?? "Trial",
      purchasedAt: rec.purchasedAt ?? now.toISOString(),
      expiresAt: rec.expiresAt ?? expires.toISOString(),
    };
  }
  return rec;
}

export function getCurrentUser(): User | null {
  try {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const creds = readCreds();
    if (!creds[email]) return null;
    const rec = ensureAccountDefaults(creds[email]);
    // Persist defaults if added
    if (creds[email] !== rec) {
      creds[email] = rec;
      writeCreds(creds);
    }
    const name = rec.name;
    return { id: email, email, name };
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function login(input: { email: string; password: string }): User {
  const parsed = authSchema.pick({ email: true, password: true }).safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Invalid credentials";
    throw new Error(message);
  }
  const { email, password } = parsed.data;
  const creds = readCreds();
  const record = creds[email];
  if (!record) throw new Error("Account not found");
  if (record.passwordHash !== hash(password)) throw new Error("Incorrect password");
  // Ensure defaults and persist
  const rec = ensureAccountDefaults(record);
  creds[email] = rec;
  writeCreds(creds);
  localStorage.setItem(SESSION_KEY, email);
  return { id: email, email, name: rec.name };
}

export function signup(input: { email: string; password: string; name?: string }): User {
  const parsed = authSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Invalid input";
    throw new Error(message);
  }
  const { email, password, name } = parsed.data;
  const creds = readCreds();
  if (creds[email]) throw new Error("Email already registered");
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  creds[email] = {
    passwordHash: hash(password),
    name,
    plan: "Trial",
    purchasedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
  writeCreds(creds);
  localStorage.setItem(SESSION_KEY, email);
  return { id: email, email, name };
}

export function demoLogin(): User {
  const email = "demo@builderone.app";
  const name = "Demo User";
  const creds = readCreds();
  if (!creds[email]) {
    const now = new Date();
    const expires = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    creds[email] = { passwordHash: hash("demo1234"), name, plan: "Trial", purchasedAt: now.toISOString(), expiresAt: expires.toISOString() };
    writeCreds(creds);
  }
  localStorage.setItem(SESSION_KEY, email);
  return { id: email, email, name };
}

export type AccountDetails = {
  email: string;
  name?: string;
  plan: string;
  purchasedAt: string;
  expiresAt: string;
  daysLeft: number;
  active: boolean;
};
export const demoAccount: AccountDetails = {
  email: "john.doe@example.com",
  name: "John Doe",
  plan: "Pro",
  purchasedAt: "2025-09-01T10:15:00Z",
  expiresAt: "2026-09-01T10:15:00Z",
  daysLeft: 328,
  active: true,
};

export function getAccount(): AccountDetails | null {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  const creds = readCreds();
  let rec = creds[email];
  if (!rec) return null;
  rec = ensureAccountDefaults(rec);
  const now = Date.now();
  const expiresAtMs = new Date(rec.expiresAt!).getTime();
  const daysLeft = Math.max(0, Math.ceil((expiresAtMs - now) / (24 * 60 * 60 * 1000)));
  const active = expiresAtMs > now;
  return {
    email,
    name: rec.name,
    plan: rec.plan!,
    purchasedAt: rec.purchasedAt!,
    expiresAt: rec.expiresAt!,
    daysLeft,
    active,
  };
}

export function renewPlan(days = 30): AccountDetails | null {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  const creds = readCreds();
  let rec = creds[email];
  if (!rec) return null;
  rec = ensureAccountDefaults(rec);
  const currentExpiry = new Date(rec.expiresAt!);
  const base = currentExpiry.getTime() > Date.now() ? currentExpiry : new Date();
  const newExpiry = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
  rec.expiresAt = newExpiry.toISOString();
  creds[email] = rec;
  writeCreds(creds);
  return getAccount();
}

export function upgradePlan(plan = "Pro", months = 12): AccountDetails | null {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  const creds = readCreds();
  let rec = creds[email];
  if (!rec) return null;
  const now = new Date();
  const newExpiry = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);
  rec = {
    ...ensureAccountDefaults(rec),
    plan,
    purchasedAt: now.toISOString(),
    expiresAt: newExpiry.toISOString(),
  };
  creds[email] = rec;
  writeCreds(creds);
  return getAccount();
}
