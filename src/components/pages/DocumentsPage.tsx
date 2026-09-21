import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDocuments } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Search, Upload, Filter, FileText, Image, ShieldCheck, Clock, AlertTriangle, Download, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export function DocumentsPage({ globalSearch }: { globalSearch:string }) {
  const { data, isLoading } = useQuery({ queryKey: ["vault-docs"], queryFn: fetchDocuments });
  const [q,setQ]=useState("");
  const search=globalSearch||q;
  const [typeFilter,setTypeFilter]=useState("All");
  const [statusFilter,setStatusFilter]=useState("All");
  const [page,setPage]=useState(1);
  const pageSize=8;
  const [preview,setPreview]=useState<any>(null);
  const [uploading,setUploading]=useState(false);

  const filtered = useMemo(()=>{
    if(!data) return [];
    let out=[...data];
    if(typeFilter!=="All") out=out.filter(d=>d.type===typeFilter);
    if(statusFilter!=="All") out=out.filter(d=>d.status===statusFilter);
    if(search){ const s=search.toLowerCase(); out=out.filter(d=> d.name.toLowerCase().includes(s) || d.customer.toLowerCase().includes(s) || d.type.toLowerCase().includes(s));}
    return out;
  },[data,typeFilter,statusFilter,search]);
  const totalPages=Math.ceil(filtered.length/pageSize);
  const pageData=filtered.slice((page-1)*pageSize, page*pageSize);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? Array.from({length:3}).map((_,i)=><div key={i} className="sapphire-card p-5"><Skeleton className="h-6 w-20"/></div>) : [
          {label:"Verified", value: data?.filter(d=>d.status==="Verified").length ?? 0, icon: ShieldCheck, cls:"bg-emerald-50 text-emerald-700 border-emerald-100"},
          {label:"Pending Review", value: data?.filter(d=>d.status==="Pending").length ?? 0, icon: Clock, cls:"bg-amber-50 text-amber-700 border-amber-100"},
          {label:"Vault Size", value:`${(data?.length ?? 0) * 1.8 | 0} files • ${(data?.reduce((s,d)=> s+ parseFloat(d.size),0) ?? 0).toFixed(1)} MB`, small:true, icon: FolderOpen, cls:"bg-[#2563eb] text-white border-[#2563eb]"},
        ].map(s=>(
          <div key={s.label} className="sapphire-card p-5 flex justify-between items-center">
            <div><p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{s.label}</p><p className={`${(s as any).small?"text-sm":"text-2xl"} font-bold mt-2 text-slate-900`}>{s.value}</p></div>
            <span className={`h-9 w-9 rounded-[16px] flex items-center justify-center border ${s.cls}`}><s.icon className="h-4.5 w-4.5"/></span>
          </div>
        ))}
      </div>

      <div className="sapphire-card p-6">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <h3 className="text-[15px] font-bold flex items-center gap-2"><FolderOpen className="h-4.5 w-4.5 text-[#2563eb]"/> Document Vault — Encrypted at rest</h3>
          <label className="h-10 px-5 rounded-[16px] bg-[#2563eb] text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer hover:bg-[#1d4ed8]">
            <Upload className="h-4 w-4"/> Upload Document
            <input type="file" className="hidden" onChange={()=>{setUploading(true); setTimeout(()=>setUploading(false), 1200);}}/>
          </label>
        </div>
        {uploading && <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden"><motion.div initial={{width:"0%"}} animate={{width:"100%"}} transition={{duration:1.2}} className="h-full bg-[#2563eb]"/></div>}
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2563eb]"/>
            <input value={q} onChange={e=>{setQ(e.target.value); setPage(1)}} placeholder="Search by file name, customer, type..." className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] pl-10 pr-4 text-sm font-medium outline-none focus:border-[#2563eb]"/>
          </div>
          <select value={typeFilter} onChange={e=>{setTypeFilter(e.target.value); setPage(1)}} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold"><option value="All">All types</option><option>ID Copy</option><option>Proof of Address</option><option>Signed Mandate</option><option>KYC Pack</option><option>Policy Schedule</option></select>
          <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value); setPage(1)}} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold"><option value="All">All statuses</option><option>Verified</option><option>Pending</option><option>Expired</option></select>
        </div>
        <p className="text-xs text-slate-500 mt-3 flex items-center gap-2"><Filter className="h-3.5 w-3.5"/> {filtered.length} documents • S3 encrypted • POPIA compliant</p>
      </div>

      <div className="sapphire-card overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_140px_110px_130px_120px] gap-0 bg-slate-50/70 border-b border-[#F1F5F9] text-[11px] font-bold tracking-widest text-slate-500">
          <div className="px-6 py-3">FILE</div>
          <div className="px-4 py-3">CUSTOMER</div>
          <div className="px-4 py-3">SIZE</div>
          <div className="px-4 py-3">STATUS</div>
          <div className="px-4 py-3 text-right">ACTIONS</div>
        </div>
        <div className="divide-y divide-slate-100">
          {isLoading ? Array.from({length:6}).map((_,i)=><div key={i} className="px-6 py-4"><Skeleton className="h-4 w-full"/></div>) : pageData.length===0 ? <div className="py-16 text-center"><p className="text-sm font-bold">No documents</p></div> :
            pageData.map(doc=>(
              <motion.div key={doc.id} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} onClick={()=>setPreview(doc)} className="px-6 py-4 hover:bg-slate-50/70 cursor-pointer grid lg:grid-cols-[1fr_140px_110px_130px_120px] gap-2 lg:gap-0 items-center">
                <div className="flex items-center gap-3">
                  <span className={`h-10 w-10 rounded-[16px] flex items-center justify-center border ${doc.type==="ID Copy"?"bg-blue-50 text-blue-700 border-blue-100": doc.type==="Policy Schedule"?"bg-emerald-50 text-emerald-700 border-emerald-100":"bg-slate-50 text-slate-600 border-slate-100"}`}>
                    {doc.type==="ID Copy" ? <FileText className="h-5 w-5"/> : <FolderOpen className="h-5 w-5"/>}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.type} • {new Date(doc.uploadedAt).toLocaleDateString("en-GB")}</p>
                  </div>
                </div>
                <div className="hidden lg:block text-sm font-medium text-slate-700 truncate">{doc.customer}</div>
                <div className="hidden lg:block text-sm text-slate-600">{doc.size}</div>
                <div className="hidden lg:block"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold border ${doc.status==="Verified"?"bg-emerald-50 text-emerald-700 border-emerald-100": doc.status==="Pending"?"bg-amber-50 text-amber-700 border-amber-100":"bg-red-50 text-red-700 border-red-100"}`}>{doc.status}</span></div>
                <div className="hidden lg:flex justify-end gap-1.5">
                  <button className="h-8 w-8 rounded-[16px] bg-white border flex items-center justify-center hover:bg-slate-900 hover:text-white"><Eye className="h-3.5 w-3.5"/></button>
                  <button className="h-8 w-8 rounded-[16px] bg-white border flex items-center justify-center hover:bg-slate-50"><Download className="h-3.5 w-3.5"/></button>
                </div>
                <div className="lg:hidden col-span-full flex flex-wrap gap-2 items-center text-xs text-slate-500">
                  <span>{doc.customer} • {doc.size}</span>
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold border ${doc.status==="Verified"?"bg-emerald-50 text-emerald-700 border-emerald-100": doc.status==="Pending"?"bg-amber-50 text-amber-700 border-amber-100":"bg-red-50 text-red-700 border-red-100"}`}>{doc.status}</span>
                </div>
              </motion.div>
            ))
          }
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F5F9] bg-slate-50/40">
          <p className="text-xs text-slate-600">Showing <span className="font-bold">{pageData.length}</span> of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="h-9 w-9 rounded-[16px] bg-white border flex items-center justify-center disabled:opacity-40"><ChevronLeft className="h-4 w-4"/></button>
            <span className="text-xs font-bold">Page {page} of {totalPages||1}</span>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="h-9 w-9 rounded-[16px] bg-white border flex items-center justify-center disabled:opacity-40"><ChevronRight className="h-4 w-4"/></button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {preview && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setPreview(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"/>
            <motion.div initial={{opacity:0, scale:0.96, y:12}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.96, y:12}} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[520px] sapphire-card z-50 overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center relative">
                <FileText className="h-12 w-12 text-white/80"/>
                <span className="absolute bottom-3 right-3 rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-xs font-mono text-white">{preview.size} • PDF</span>
                <button onClick={()=>setPreview(null)} className="absolute top-3 right-3 h-8 w-8 rounded-[16px] bg-white/20 backdrop-blur flex items-center justify-center text-white">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div><p className="text-sm font-bold text-slate-900">{preview.name}</p><p className="text-xs text-slate-500">Customer: {preview.customer} • Uploaded {new Date(preview.uploadedAt).toLocaleDateString("en-GB")}</p></div>
                <div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold border ${preview.status==="Verified"?"bg-emerald-50 text-emerald-700 border-emerald-100":"bg-amber-50 text-amber-700 border-amber-100"}`}>{preview.status}</span><span className="text-xs text-slate-500">POPIA encrypted • S3 key: {preview.id}.pdf</span></div>
                <div className="flex gap-2">
                  <button className="flex-1 h-11 rounded-[16px] bg-[#2563eb] text-white font-bold text-sm inline-flex items-center justify-center gap-2"><Eye className="h-4 w-4"/> Preview</button>
                  <button className="flex-1 h-11 rounded-[16px] bg-white border-2 border-[#F1F5F9] font-bold text-sm inline-flex items-center justify-center gap-2"><Download className="h-4 w-4"/> Download</button>
                </div>
                <button onClick={()=>setPreview(null)} className="w-full h-10 rounded-[16px] bg-slate-50 border text-sm font-semibold">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
