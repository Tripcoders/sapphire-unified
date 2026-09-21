/**
 * Mock DB — in-memory + localStorage persistence for demo
 * Mirrors the schema in schema.ts and exposes TanStack Query fetchers.
 * Real app would swap this for Prisma/Supabase/Drizzle.
 */
import { generateSAId, type Agent, type PolicyRecord, type Customer, type Claim, type Activity, BRANCHES, PRODUCTS } from "./schema";

const LS_POLICIES = "sapphire_mock_policies";
const LS_CUSTOMERS = "sapphire_mock_customers";

const firstNames = ["Thabo","Nomsa","Sipho","Aisha","David","Lerato","John","Priya","Michael","Sarah","Kagiso","Zanele","Peter","Amahle","Chris","Naledi","Robert","Yolanda","Daniel","Fatima","Lunga","Bongani","Precious","Mandla","Grace","Ayanda","Thando","Sbusiso","Noluthando"];
const lastNames = ["Mbeki","Nkosi","Dlamini","Patel","Smith","Johnson","Williams","Brown","Khumalo","Molefe","Naidoo","Van Wyk","Botha","Cele","Mthembu","Zulu","Ndlovu","Mabaso","Singh","Adams","Khumalo","Hassal","Dlamini","Mitchell"];

function rand<T>(a: T[]): T { return a[Math.floor(Math.random()*a.length)] }
function pad(n:number,len=7){ return String(n).padStart(len,"0") }

/** Seed customers */
function seedCustomers(count=60): Customer[] {
  const cached = localStorage.getItem(LS_CUSTOMERS);
  if (cached) try { return JSON.parse(cached); } catch {}
  const out: Customer[] = [];
  for(let i=0;i<count;i++){
    const name = rand(firstNames);
    const surname = rand(lastNames);
    out.push({
      id: `cust_${pad(i,4)}`,
      idNumber: generateSAId(),
      name, surname, fullName: `${name} ${surname}`,
      phone: `+27 ${82+Math.floor(Math.random()*3)} ${pad(Math.floor(Math.random()*9000000)+1000000,7)}`,
      dateOfBirth: new Date(Date.now()- (18+Math.floor(Math.random()*50))*365*24*60*60*1000).toISOString(),
      kycVerified: Math.random()>0.15,
      riskRating: rand(["LOW","MEDIUM","HIGH"] as const),
      createdAt: new Date(Date.now()-Math.floor(Math.random()*90)*24*60*60*1000).toISOString(),
      assignedAgentId: `agent_${Math.floor(Math.random()*4)}`,
    });
  }
  localStorage.setItem(LS_CUSTOMERS, JSON.stringify(out));
  return out;
}

/** Seed policies/quotes/leads linked to customers + agents */
function seedPolicies(customers: Customer[], count=64): PolicyRecord[] {
  const cached = localStorage.getItem(LS_POLICIES);
  if (cached) try { return JSON.parse(cached); } catch {}
  const channels = ["Branch","Digital","Call Centre","Broker"] as const;
  const agents = ["C1234567","C7654321","C8472910","C0000001"];
  const out: PolicyRecord[] = [];
  for(let i=0;i<count;i++){
    const c = rand(customers);
    const prod = rand(PRODUCTS);
    const typeRoll = Math.random();
    let type: PolicyRecord["type"] = "Policy";
    if (typeRoll < 0.30) type = "Quote";
    else if (typeRoll < 0.42) type = "Lead";
    const number = type==="Policy" ? `POL-${pad(100000+i)}` : type==="Quote" ? `QT-${pad(200000+i)}` : `LD-${pad(300000+i)}`;
    const statuses: Record<string,string[]> = {
      Policy: ["Active","Active","Active","Pending","Expired"],
      Quote: ["Quoted","Pending","Quoted","Cancelled"],
      Lead: ["Pending","Quoted","Cancelled"]
    };
    const status = rand(statuses[type] as any);
    const premiumCents = (450+ Math.floor(Math.random()*3500))*100;
    const dateOpened = new Date(Date.now() - Math.floor(Math.random()*70)*24*60*60*1000);
    out.push({
      id: `pol_${pad(i,4)}`,
      type, number,
      customerId: c.id, customerName: c.fullName, idNumber: c.idNumber,
      productCode: prod.code, productName: prod.name,
      channel: rand([...channels]),
      status: status as any,
      premiumCents, premiumDisplay: `R ${(premiumCents/100).toLocaleString("en-ZA")}`,
      branchCode: rand(Object.keys(BRANCHES) as any),
      agentId: rand(agents),
      dateOpened: dateOpened.toISOString(),
      dateOpenedDisplay: dateOpened.toLocaleDateString("en-GB",{day:"2-digit", month:"short", year:"numeric"}),
      createdAt: dateOpened.toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  const sorted = out.sort((a,b)=> new Date(b.dateOpened).getTime() - new Date(a.dateOpened).getTime());
  localStorage.setItem(LS_POLICIES, JSON.stringify(sorted));
  return sorted;
}

// Public API for TanStack Query
let _customers: Customer[] | null = null;
let _policies: PolicyRecord[] | null = null;

function ensureSeed(){
  if (typeof window==="undefined") return { customers: [] as Customer[], policies: [] as PolicyRecord[] };
  if (!_customers) _customers = seedCustomers();
  if (!_policies) _policies = seedPolicies(_customers);
  return { customers: _customers, policies: _policies };
}

export async function fetchPolicies(): Promise<PolicyRecord[]> {
  const { policies } = ensureSeed();
  await new Promise(r=>setTimeout(r, 750));
  return policies;
}

export async function fetchCustomers(): Promise<Customer[]> {
  const { customers } = ensureSeed();
  await new Promise(r=>setTimeout(r, 600));
  return customers;
}

export async function fetchClaims(): Promise<Claim[]> {
  // lightweight mock — derive from policies
  const { policies } = ensureSeed();
  await new Promise(r=>setTimeout(r, 500));
  return policies.slice(0,12).map((p,i)=>({
    id: `clm_${pad(i,4)}`,
    claimNumber: `CLM-${pad(300000+i)}`,
    policyId: p.id, customerId: p.customerId, agentId: p.agentId,
    status: rand(["Open","Assessing","Approved","Paid"] as const),
    amountCents: Math.floor(Math.random()*80000+5000)*100,
    description: `${p.productName} claim — ${p.customerName}`,
    dateLodged: new Date(Date.now()-Math.floor(Math.random()*30)*24*60*60*1000).toISOString(),
  }));
}

export async function fetchActivities(): Promise<Activity[]> {
  const { policies } = ensureSeed();
  await new Promise(r=>setTimeout(r, 400));
  return policies.slice(0,8).map((p,i)=>({
    id: `act_${i}`, type: rand(["QUOTE_CREATED","POLICY_ISSUED","CLAIM_LODGED","LEAD_ASSIGNED"] as const),
    agentId: p.agentId, customerId: p.customerId, policyId: p.id,
    description: `${p.type} ${p.number} for ${p.customerName}`,
    createdAt: p.dateOpened,
  }));
}

// ─────────────── Extended entities for new pages ───────────────
export type VaultDoc = {
  id: string;
  name: string;
  customer: string;
  type: "ID Copy" | "Proof of Address" | "Signed Mandate" | "KYC Pack" | "Claim Evidence" | "Policy Schedule";
  size: string;
  uploadedAt: string;
  status: "Verified" | "Pending" | "Expired";
};

export type CalendarTask = {
  id: string;
  title: string;
  customer: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: "Renewal" | "Callback" | "KYC Follow-up" | "Claim Update" | "Meeting";
  priority: "High" | "Medium" | "Low";
  done: boolean;
};

const LS_DOCS = "sapphire_mock_docs";
const LS_TASKS = "sapphire_mock_tasks";

function seedDocs(customers: Customer[]): VaultDoc[] {
  const cached = localStorage.getItem(LS_DOCS);
  if (cached) try { return JSON.parse(cached); } catch {}
  const types: VaultDoc["type"][] = ["ID Copy","Proof of Address","Signed Mandate","KYC Pack","Claim Evidence","Policy Schedule"];
  const statuses: VaultDoc["status"][] = ["Verified","Pending","Expired"];
  const out: VaultDoc[] = Array.from({length: 24}).map((_, i)=>{
    const c = rand(customers);
    return {
      id: `doc_${pad(i,4)}`,
      name: `${types[i % types.length]} — ${c.fullName}.pdf`,
      customer: c.fullName,
      type: rand(types),
      size: `${(0.3 + Math.random()*4).toFixed(1)} MB`,
      uploadedAt: new Date(Date.now() - Math.floor(Math.random()*40)*24*60*60*1000).toISOString(),
      status: rand(statuses),
    };
  });
  localStorage.setItem(LS_DOCS, JSON.stringify(out));
  return out;
}

function seedTasks(customers: Customer[]): CalendarTask[] {
  const cached = localStorage.getItem(LS_TASKS);
  if (cached) try { return JSON.parse(cached); } catch {}
  const types: CalendarTask["type"][] = ["Renewal","Callback","KYC Follow-up","Claim Update","Meeting"];
  const priorities: CalendarTask["priority"][] = ["High","Medium","Low"];
  const today = new Date();
  const out: CalendarTask[] = Array.from({length: 28}).map((_, i)=>{
    const c = rand(customers);
    const offset = Math.floor(Math.random()*20) - 5; // -5 to +15 days
    const d = new Date(today); d.setDate(today.getDate()+offset);
    const hh = String(8 + Math.floor(Math.random()*9)).padStart(2,"0");
    const mm = Math.random()>0.5 ? "00" : "30";
    return {
      id: `task_${pad(i,4)}`,
      title: `${rand(types)} — ${c.fullName}`,
      customer: c.fullName,
      date: d.toISOString().slice(0,10),
      time: `${hh}:${mm}`,
      type: rand(types),
      priority: rand(priorities),
      done: Math.random() < 0.25,
    };
  });
  out.sort((a,b)=> (a.date + a.time).localeCompare(b.date + b.time));
  localStorage.setItem(LS_TASKS, JSON.stringify(out));
  return out;
}

let _docs: VaultDoc[] | null = null;
let _tasks: CalendarTask[] | null = null;

export async function fetchDocuments(): Promise<VaultDoc[]> {
  const { customers } = ensureSeed();
  if (!_docs) _docs = seedDocs(customers);
  await new Promise(r=>setTimeout(r, 550));
  return _docs;
}

export async function fetchTasks(): Promise<CalendarTask[]> {
  const { customers } = ensureSeed();
  if (!_tasks) _tasks = seedTasks(customers);
  await new Promise(r=>setTimeout(r, 500));
  return _tasks;
}

export function toggleTaskDone(id: string) {
  if (!_tasks) return;
  _tasks = _tasks.map(t=> t.id===id ? {...t, done: !t.done} : t);
  localStorage.setItem(LS_TASKS, JSON.stringify(_tasks));
}

// Helpers for search
export function searchPolicies(policies: PolicyRecord[], q: string): PolicyRecord[] {
  if (!q) return policies;
  const s = q.toLowerCase();
  return policies.filter(p =>
    p.customerName.toLowerCase().includes(s) ||
    p.number.toLowerCase().includes(s) ||
    p.idNumber.includes(s) ||
    p.productName.toLowerCase().includes(s)
  );
}
