import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DocumentPreview } from "@/components/DocumentPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { TailoredDocs } from "@/lib/types";

export default function JobReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editedDocs, setEditedDocs] = useState<Partial<TailoredDocs>>({});

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.getJob(id as string),
    enabled: !!id,
  });

  const { data: docs, isLoading: docsLoading } = useQuery({
    queryKey: ["tailoredDocs", id],
    queryFn: () => api.tailorJob(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (docs) {
      setEditedDocs(docs);
    }
  }, [docs]);

  const approveMutation = useMutation({
    mutationFn: () => api.approveApplication(id as string, editedDocs),
    onSuccess: () => {
      toast.success("Application Submitted!");
      navigate("/applications");
    }
  });

  const skipMutation = useMutation({
    mutationFn: () => api.skipApplication(id as string),
    onSuccess: () => {
      toast.info("Skipped application");
      navigate("/jobs");
    }
  });

  const isLoading = jobLoading || docsLoading;

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Remove previous top sub-header, just incorporate headers per panel like the design */}

      <div className="flex-1 flex overflow-hidden">
        {/* Panel 1: Job Description */}
        <section className="w-[35%] border-r border-white/10 flex flex-col bg-white/[0.02]">
           <div className="p-4 border-b border-white/10 bg-white/[0.03] flex items-start gap-3">
             <button onClick={() => navigate(-1)} className="mt-1 text-white/50 hover:text-white transition-colors">
               <ChevronLeft className="h-5 w-5" />
             </button>
             <div className="flex-1">
               {jobLoading ? (
                 <div className="space-y-2">
                   <Skeleton className="h-3 w-20" />
                   <Skeleton className="h-6 w-full" />
                   <Skeleton className="h-4 w-40" />
                 </div>
               ) : (
                 <>
                   <h2 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Source: {job?.source || "Unknown"}</h2>
                   <h1 className="text-xl font-bold leading-tight text-white mb-2">{job?.title}</h1>
                   <p className="text-blue-400 text-sm font-medium">
                     {job?.companyName} &bull; {job?.location} {job?.salaryMin && `• $${job.salaryMin/1000}k - $${job.salaryMax/1000}k`}
                   </p>
                 </>
               )}
             </div>
           </div>
           <div className="flex-1 overflow-y-auto p-5 text-sm text-white/70 leading-relaxed custom-scrollbar">
             {jobLoading ? (
               <div className="space-y-4">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-5/6" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-4/5" />
               </div>
             ) : (
               <div className="text-sm text-white/70 leading-relaxed space-y-4 [&>h3]:text-white [&>h3]:font-semibold [&>h3]:mb-2 [&>h4]:text-white [&>h4]:font-semibold [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-2" dangerouslySetInnerHTML={{ __html: job?.descriptionHtml || "" }} />
             )}
             {/* Match Analysis Extra box like in design */}
             {!jobLoading && job && (
                <div className="mt-6 p-4 bg-white/[0.05] rounded-xl border border-white/10">
                  <p className="text-xs text-white/50 font-bold tracking-wider">MATCH ANALYSIS</p>
                  <p className="mt-2 text-emerald-400 font-medium">Your profile matches {job.matchScore}% of the requirements.</p>
                </div>
             )}
           </div>
        </section>

        {/* Panel 2: Tailored Resume */}
        <section className="w-[35%] border-r border-white/10 flex flex-col relative bg-transparent">
           <div className="p-4 border-b border-white/10 flex items-center justify-between">
             <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">AI-Tailored Resume</h2>
             <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-medium tracking-wide">Optimized for ATS</span>
           </div>
           <div className="flex-1 overflow-hidden p-0 relative bg-[#111]/50 border border-t-0 border-white/5 shadow-inner">
             {docsLoading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center z-50 p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                  <p className="font-bold text-white mb-2">AI is tailoring your resume...</p>
                  <p className="text-xs text-white/50">Rewriting bullets and extracting keywords for this specific role.</p>
               </div>
             ) : docs ? (
                <DocumentPreview original={docs.originalResume} tailored={editedDocs.tailoredResume || ""} />
             ) : null}
           </div>
        </section>

        {/* Panel 3: Cover Letter & Q&A */}
        <section className="flex-1 flex flex-col bg-transparent min-w-[30%]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
               <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold">Supporting Documents</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {docsLoading ? (
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-40 w-full" />
                     </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-16 w-full" />
                     </div>
                  </div>
              ) : docs ? (
                <>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-xs font-bold text-white/50 block tracking-widest">TAILORED COVER LETTER</label>
                    <Textarea 
                      className="h-48 resize-none font-sans text-xs text-white/80 leading-relaxed bg-white/[0.03] border-white/10 focus-visible:ring-blue-500/50" 
                      value={editedDocs.coverLetter}
                      onChange={(e) => setEditedDocs(prev => ({...prev, coverLetter: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-white/50 block uppercase tracking-widest">Screening Questions</label>
                    <div className="space-y-3">
                      {editedDocs.questionsAndAnswers?.map((qa, i) => (
                         <div key={i} className="p-3 bg-white/[0.05] border border-white/10 rounded-lg">
                           <p className="text-[11px] text-white/80 font-medium mb-2">{qa.question}</p>
                           <Textarea 
                              className="text-xs text-white/70 bg-black border-white/20 resize-none h-16 focus-visible:ring-blue-500/50"
                              value={qa.answer}
                              onChange={(e) => {
                                 const newQa = [...(editedDocs.questionsAndAnswers || [])];
                                 newQa[i].answer = e.target.value;
                                 setEditedDocs(prev => ({...prev, questionsAndAnswers: newQa}));
                              }}
                           />
                         </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
        </section>
      </div>

      <footer className="h-20 border-t border-white/10 bg-black flex items-center justify-between px-8 shrink-0 z-50">
         <div className="flex items-center gap-6">
            {!isLoading && job && (
              <>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">Match Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" 
                        style={{ width: `${job.matchScore}%` }}
                      ></div>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">{job.matchScore}%</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="text-sm">
                  <span className="text-white/40">Status:</span>
                  <span className="ml-2 text-white font-medium">Ready for submission</span>
                </div>
              </>
            )}
         </div>
         
         <div className="flex items-center gap-3">
           <button 
              disabled={isLoading || skipMutation.isPending} 
              onClick={() => skipMutation.mutate()} 
              className="px-6 py-2 rounded-full border border-white/10 text-white/60 hover:bg-white/5 text-sm font-semibold transition-colors disabled:opacity-50"
           >
              Skip Job
           </button>
           <button 
              disabled={isLoading} 
              className="px-6 py-2 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 text-sm font-semibold transition-colors disabled:opacity-50"
           >
              Save Draft
           </button>
           <button 
             disabled={isLoading || approveMutation.isPending} 
             onClick={() => approveMutation.mutate()}
             className="px-8 py-2 rounded-full bg-blue-600 text-white flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors disabled:opacity-50"
           >
             {approveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
             Approve & Submit Application
           </button>
         </div>
      </footer>
    </div>
  );
}
