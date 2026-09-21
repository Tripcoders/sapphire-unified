/**
 * Sapphire — Standard Bank Internal Insurance Tool
 * Database Schema & Domain Model
 * ------------------------------------------------------------
 * Designed for Postgres + Prisma (or local mock). All tables use ULID/cuid
 * and are mapped to TanStack Query keys below.
 *
 * ER: Agent 1—* Policy/Quote/Lead/Claim • Customer 1—* Policy/Quote • Product 1—* Policy
 */

// ───────────────────── Enums ─────────────────────
export type AgentRole = "CONSULTANT" | "SENIOR_CONSULTANT" | "LEAD_CONSULTANT" | "ADMIN";
export type BranchCode = "JHB_CENTRAL" | "CPT_WATERFRONT" | "DBN_NORTH" | "PTA_CENTRAL" | "HEAD_OFFICE";
export type Channel = "Branch" | "Digital" | "Call Centre" | "Broker";
export type PolicyStatus = "Active" | "Pending" | "Expired" | "Cancelled" | "Quoted" | "Lapsed";
export type PolicyType = "Policy" | "Quote" | "Lead";
export type ProductCode = "VEH_COMPREHENSIVE" | "HOME_BUILDING" | "HOME_CONTENTS" | "LIFE_COVER" | "FUNERAL" | "BUSINESS" | "LIABILITY" | "TRAVEL" | "WARRANTY";
export type ClaimStatus = "Open" | "Assessing" | "Approved" | "Rejected" | "Paid";
export type ActivityType = "QUOTE_CREATED" | "POLICY_ISSUED" | "CLAIM_LODGED" | "LEAD_ASSIGNED" | "KYC_VERIFIED";

// ───────────────────── Tables ─────────────────────

/** agents — Standard Bank staff, auth via C-Number (C + 7 digits) or SB email */
export type Agent = {
  id: string;               // cuid
  cNumber: string;          // UNIQUE, regex ^C\d{7}$ — e.g. C1234567
  email: string;            // UNIQUE, @standardbank.co.za
  passwordHash: string;     // bcrypt (mock: plain for demo)
  name: string;
  role: AgentRole;
  branchCode: BranchCode;
  branchName: string;
  avatar: string;           // initials 2 chars
  phone: string;
  isActive: boolean;
  createdAt: string;        // ISO
  lastLoginAt: string | null;
};

/** customers — KYC'd individuals searched by ID/passport/policy */
export type Customer = {
  id: string;
  idNumber: string;         // 13-digit SA ID — indexed
  passportNumber?: string;
  name: string;
  surname: string;
  fullName: string;         // denormalized
  email?: string;
  phone: string;
  dateOfBirth: string;
  kycVerified: boolean;
  riskRating: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  assignedAgentId: string;  // FK → agents.id
};

/** products — catalog, drives premium calculation */
export type Product = {
  code: ProductCode;
  name: string;             // e.g. "Comprehensive Vehicle"
  category: "VEHICLE" | "PROPERTY" | "LIFE" | "BUSINESS" | "OTHER";
  basePremium: number;      // ZAR cents
  commissionRate: number;   // 0.12 = 12%
  isActive: boolean;
};

/** policies/quotes/leads — single table with type discriminator (STI) */
export type PolicyRecord = {
  id: string;
  type: PolicyType;         // discriminator
  number: string;           // UNIQUE: POL-*, QT-*, LD-* — indexed
  customerId: string;       // FK → customers.id
  customerName: string;     // denormalized for fast search
  idNumber: string;         // denormalized
  productCode: ProductCode;
  productName: string;
  channel: Channel;
  status: PolicyStatus;
  premiumCents: number;     // monthly
  premiumDisplay: string;   // "R 1,450"
  sumAssuredCents?: number;
  branchCode: BranchCode;
  agentId: string;          // FK → agents.id (owner)
  dateOpened: string;       // ISO
  dateOpenedDisplay: string;// "12 Jan 2024"
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
};

/** claims — linked to policy */
export type Claim = {
  id: string;
  claimNumber: string;      // CLM-*
  policyId: string;         // FK → policies.id
  customerId: string;
  agentId: string;
  status: ClaimStatus;
  amountCents: number;
  description: string;
  dateLodged: string;
  dateResolved?: string;
};

/** commissions — per policy per month */
export type Commission = {
  id: string;
  agentId: string;
  policyId: string;
  month: string;            // YYYY-MM
  premiumCents: number;
  commissionCents: number;
  isPaid: boolean;
};

/** activities — audit log / recent activity feed */
export type Activity = {
  id: string;
  type: ActivityType;
  agentId: string;
  customerId?: string;
  policyId?: string;
  claimId?: string;
  description: string;
  createdAt: string;
};

/** documents — vault, S3 key */
export type Document = {
  id: string;
  customerId: string;
  policyId?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  uploadedByAgentId: string;
  createdAt: string;
};

// ───────────────────── Relations (for ORM) ─────────────────────
// Agent 1—* PolicyRecord (agentId)
// Agent 1—* Claim (agentId)
// Agent 1—* Activity (agentId)
// Customer 1—* PolicyRecord (customerId)
// Customer 1—* Claim (customerId)
// Product 1—* PolicyRecord (productCode)
// PolicyRecord 1—* Claim (policyId)
// PolicyRecord 1—* Commission (policyId)

// ───────────────────── Indexes ─────────────────────
// agents: UNIQUE(cNumber), UNIQUE(email), INDEX(branchCode)
// customers: UNIQUE(idNumber), INDEX(assignedAgentId), INDEX(fullName)
// policies: UNIQUE(number), INDEX(customerId), INDEX(agentId), INDEX(type,status), INDEX(dateOpened)
// claims: INDEX(policyId), INDEX(status)
// activities: INDEX(agentId, createdAt DESC)

// ───────────────────── Seed helpers ─────────────────────
export const BRANCHES: Record<BranchCode, string> = {
  JHB_CENTRAL: "Johannesburg Central",
  CPT_WATERFRONT: "Cape Town Waterfront",
  DBN_NORTH: "Durban North",
  PTA_CENTRAL: "Pretoria Central",
  HEAD_OFFICE: "Head Office",
};

export const PRODUCTS: Product[] = [
  { code: "VEH_COMPREHENSIVE", name: "Comprehensive Vehicle", category: "VEHICLE", basePremium: 145000, commissionRate: 0.15, isActive: true },
  { code: "HOME_BUILDING", name: "Home Building", category: "PROPERTY", basePremium: 89000, commissionRate: 0.12, isActive: true },
  { code: "HOME_CONTENTS", name: "Home Contents", category: "PROPERTY", basePremium: 65000, commissionRate: 0.12, isActive: true },
  { code: "LIFE_COVER", name: "Life Cover", category: "LIFE", basePremium: 210000, commissionRate: 0.18, isActive: true },
  { code: "FUNERAL", name: "Funeral Plan", category: "LIFE", basePremium: 25000, commissionRate: 0.10, isActive: true },
  { code: "BUSINESS", name: "Business Insurance", category: "BUSINESS", basePremium: 320000, commissionRate: 0.16, isActive: true },
  { code: "LIABILITY", name: "Personal Liability", category: "OTHER", basePremium: 45000, commissionRate: 0.11, isActive: true },
  { code: "TRAVEL", name: "Travel Cover", category: "OTHER", basePremium: 55000, commissionRate: 0.13, isActive: true },
  { code: "WARRANTY", name: "Extended Warranty", category: "VEHICLE", basePremium: 75000, commissionRate: 0.14, isActive: true },
];

// Realistic SA ID generator (YYMMDD GSSS C A Z)
export function generateSAId(): string {
  const yy = String(Math.floor(Math.random()*30)+70).padStart(2,"0");
  const mm = String(Math.floor(Math.random()*12)+1).padStart(2,"0");
  const dd = String(Math.floor(Math.random()*28)+1).padStart(2,"0");
  const gsss = String(Math.floor(Math.random()*9000)+1000);
  const c = Math.floor(Math.random()*2);
  const a = 8 + Math.floor(Math.random()*2);
  const z = Math.floor(Math.random()*10);
  return `${yy}${mm}${dd}${gsss}${c}${a}${z}`;
}
