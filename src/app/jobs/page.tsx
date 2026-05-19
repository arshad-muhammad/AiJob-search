import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Search } from "lucide-react";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [matchScoreMs, setMatchScoreMs] = useState(60);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", { searchTerm }], // Added search term to query key for real app
    queryFn: () => api.getJobs({ q: searchTerm }),
  });

  return (
    <div className="flex flex-col h-full md:flex-row">
       <aside className="w-full md:w-64 lg:w-72 border-r bg-muted/20 p-4 md:p-6 flex flex-col gap-6 shrink-0 md:h-[calc(100vh-60px)] md:sticky md:top-0 md:overflow-y-auto">
          <div>
            <h3 className="font-semibold mb-4 text-lg">Filters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                 <Label>Search Roles</Label>
                 <div className="relative">
                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input 
                     type="text" 
                     placeholder="e.g. React Engineer" 
                     className="pl-9 bg-background" 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                 </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="remote" className="font-normal">Remote Only</Label>
                    <Switch id="remote" defaultChecked />
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                 <div className="flex items-center justify-between">
                    <Label>Min. Match Score</Label>
                    <span className="text-sm font-medium">{matchScoreMs}%</span>
                 </div>
                 <Slider 
                   value={[matchScoreMs]} 
                   min={0} max={100} step={5} 
                   onValueChange={(val) => setMatchScoreMs(val[0])} 
                 />
                 <p className="text-xs text-muted-foreground">Only show jobs matching your profile &gt; {matchScoreMs}%</p>
              </div>

               <div className="space-y-4 pt-4 border-t">
                 <Label>Sources</Label>
                 <div className="flex flex-col gap-2">
                    {["LinkedIn", "Greenhouse", "Lever", "Workday", "Indeed"].map((src) => (
                      <div key={src} className="flex items-center space-x-2">
                        <input type="checkbox" id={src} className="rounded border-gray-300 text-primary" defaultChecked={src !== 'Indeed'} />
                        <label htmlFor={src} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{src}</label>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
       </aside>

       <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto w-full">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Job Discovery</h2>
            <p className="text-muted-foreground">Review top matches and let AI tailor your application.</p>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full">
             {isLoading ? (
                // Skeletons
                Array.from({length: 6}).map((_,i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))
             ) : jobs?.length === 0 ? (
                <div className="col-span-full pt-12 flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                     <Search className="h-10 w-10 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold">No jobs found</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">Try adjusting your filters or search terms to see more matches.</p>
                </div>
             ) : (
                jobs?.filter(j => j.matchScore >= matchScoreMs).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
             )}
          </div>
       </div>
    </div>
  );
}
