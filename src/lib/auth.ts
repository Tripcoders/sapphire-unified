import type { Agent, AgentRole, BranchCode } from "./schema";
import { BRANCHES } from "./schema";

// Re-export Agent as AgentUser for UI (adds-friendly role string)
export type AgentUser = {
  id: string;
  cNumber: string; // C + 7 digits, UNIQUE
  name: string;
  email: string; // @standardbank.co.za
  role: string; // display string
  roleCode: AgentRole;
  branch: string;
  branchCode: BranchCode;
  avatar: string;
  phone: string;
};

function toUser(a: Agent & { password: string }): AgentUser & { password: string } {
  return {
    id: a.id,
    cNumber: a.cNumber,
    name: a.name,
    email: a.email,
    role: a.role === "SENIOR_CONSULTANT" ? "Senior Insurance Consultant" : a.role === "LEAD_CONSULTANT" ? "Lead Consultant" : a.role === "ADMIN" ? "System Administrator" : "Insurance Consultant",
    roleCode: a.role,
    branch: BRANCHES[a.branchCode],
    branchCode: a.branchCode,
    avatar: a.avatar,
    phone: a.phone,
    password: a.password,
  };
}

// Mock agents table — mirrors `agents` in schema.ts
const AGENTS_RAW: Array<Agent & { password: string }> = [
  { id: "agent_001", cNumber: "C1234567", email: "tal.hassal@standardbank.co.za", passwordHash: "Sapphire123", password: "Sapphire123", name: "Tal Hassal", role: "SENIOR_CONSULTANT", branchCode: "JHB_CENTRAL", branchName: BRANCHES.JHB_CENTRAL, avatar: "TH", phone: "+27 82 123 4567", isActive: true, createdAt: new Date().toISOString(), lastLoginAt: null },
  { id: "agent_002", cNumber: "C7654321", email: "noluthando.d@standardbank.co.za", passwordHash: "Test1234", password: "Test1234", name: "Noluthando Dlamini", role: "CONSULTANT", branchCode: "CPT_WATERFRONT", branchName: BRANCHES.CPT_WATERFRONT, avatar: "ND", phone: "+27 83 987 6543", isActive: true, createdAt: new Date().toISOString(), lastLoginAt: null },
  { id: "agent_003", cNumber: "C8472910", email: "james.mitchell@standardbank.co.za", passwordHash: "Sapphire2024", password: "Sapphire2024", name: "James Mitchell", role: "LEAD_CONSULTANT", branchCode: "DBN_NORTH", branchName: BRANCHES.DBN_NORTH, avatar: "JM", phone: "+27 84 555 0199", isActive: true, createdAt: new Date().toISOString(), lastLoginAt: null },
  { id: "agent_004", cNumber: "C0000001", email: "admin@standardbank.co.za", passwordHash: "Admin123!", password: "Admin123!", name: "Admin User", role: "ADMIN", branchCode: "HEAD_OFFICE", branchName: BRANCHES.HEAD_OFFICE, avatar: "AD", phone: "+27 11 000 0000", isActive: true, createdAt: new Date().toISOString(), lastLoginAt: null },
];

export const TEST_ACCOUNTS = AGENTS_RAW.map(toUser);

export function validateLogin(identifier: string, password: string): AgentUser | null {
  const norm = identifier.trim();
  const isEmail = norm.includes("@");
  const account = TEST_ACCOUNTS.find(a => isEmail ? a.email.toLowerCase() === norm.toLowerCase() : a.cNumber.toUpperCase() === norm.toUpperCase());
  if (account && account.password === password) {
    const { password: _p, ...user } = account;
    // persist lastLogin
    const raw = AGENTS_RAW.find(r => r.cNumber === user.cNumber);
    if (raw) raw.lastLoginAt = new Date().toISOString();
    return user;
  }
  return null;
}

export function validateCNumber(c: string): boolean {
  return /^C\d{7}$/i.test(c.trim());
}
export function validateSBEmail(email: string): boolean {
  return /^[a-z0-9._%+-]+@standardbank\.co\.za$/i.test(email.trim());
}
