export type PolicyStatus = "Active" | "Pending" | "Expired" | "Cancelled" | "Quoted";
export type Channel = "Branch" | "Digital" | "Call Centre" | "Broker";
export type PolicyType = "Policy" | "Quote" | "Lead";

export type PolicyRecord = {
  id: string;
  type: PolicyType;
  name: string;
  dateOpened: string;
  number: string;
  channel: Channel;
  idNumber: string;
  status: PolicyStatus;
  premium: string;
  product: string;
};

const firstNames = ["Thabo","Nomsa","Sipho","Aisha","David","Lerato","John","Priya","Michael","Sarah","Kagiso","Zanele","Peter","Amahle","Chris","Naledi","Robert","Yolanda","Daniel","Fatima","Lunga","Bongani","Precious","Mandla","Grace"];
const lastNames = ["Mbeki","Nkosi","Dlamini","Patel","Smith","Johnson","Williams","Brown","Khumalo","Molefe","Naidoo","Van Wyk","Botha","Cele","Mthembu","Zulu","Ndlovu","Mabaso","Singh","Adams"];
const products = ["Comprehensive Vehicle","Home Building","Home Contents","Life Cover","Funeral Plan","Business Insurance","Personal Liability","Travel Cover","Extended Warranty"];
const channels: Channel[] = ["Branch","Digital","Call Centre","Broker"];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)] }
function pad(n:number,len=7){ return n.toString().padStart(len,'0') }

export function generatePolicies(count = 48): PolicyRecord[] {
  const out: PolicyRecord[] = [];
  for(let i=0;i<count;i++){
    const typeRoll = Math.random();
    let type: PolicyType = "Policy";
    if(typeRoll < 0.3) type = "Quote";
    else if(typeRoll < 0.4) type = "Lead";
    const fn = rand(firstNames);
    const ln = rand(lastNames);
    const name = `${fn} ${ln}`;
    const date = new Date(Date.now() - Math.floor(Math.random()*60)*24*60*60*1000 - Math.floor(Math.random()*24)*60*60*1000);
    const dateOpened = date.toLocaleDateString('en-GB',{day:'2-digit', month:'short', year:'numeric'});
    const number = type==="Policy" ? `POL-${pad(100000+i)}` : type==="Quote" ? `QT-${pad(200000+i)}` : `LD-${pad(300000+i)}`;
    const statuses: Record<PolicyType, PolicyStatus[]> = {
      Policy: ["Active","Active","Active","Pending","Expired"],
      Quote: ["Quoted","Pending","Quoted","Cancelled"],
      Lead: ["Pending","Quoted","Cancelled"]
    };
    const status = rand(statuses[type]);
    const premium = `R ${(Math.floor(Math.random()*3500)+450).toLocaleString('en-ZA')}`;
    const product = rand(products);
    const idNumber = `${Math.floor(8000000000000 + Math.random()*1999999999999)}`;
    out.push({ id: `${i}`, type, name, dateOpened, number, channel: rand(channels), idNumber, status, premium, product })
  }
  // sort by date desc
  return out.sort((a,b)=> new Date(b.dateOpened).getTime() - new Date(a.dateOpened).getTime());
}

export const MOCK_POLICIES = generatePolicies(52);

export const STATS = [
  { label: "Total Policies", value: "1,284", change: "+12.5%", trend: "up", sub: "vs last month" },
  { label: "Active Quotes", value: "342", change: "+8.2%", trend: "up", sub: "awaiting approval" },
  { label: "Leads Today", value: "28", change: "-3.1%", trend: "down", sub :"new leads" },
  { label: "Commission YTD", value: "R 284,500", change: "+15.3%", trend: "up", sub:"year to date" },
];
