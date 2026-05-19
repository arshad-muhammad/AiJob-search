import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApplicationStatus } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

const columns: ApplicationStatus[] = ["Queued", "Reviewing", "Submitted", "Interview", "Offer", "Rejected"];

export default function ApplicationsPage() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: api.getApplications,
  });

  return (
    <div className="flex flex-col h-full bg-muted/10">
      <div className="p-6 pb-4 border-b bg-background">
        <h2 className="text-2xl font-bold tracking-tight">Application Tracker</h2>
        <p className="text-muted-foreground mt-1">Track the status of your automated applications across all platforms.</p>
      </div>

      <div className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {columns.map((column) => {
            const colApps = applications?.filter(app => app.status === column) || [];
            
            return (
              <div key={column} className="w-[320px] flex flex-col max-h-full shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold bg-background px-3 py-1.5 rounded-md border shadow-sm flex items-center justify-between w-full">
                    {column} 
                    <span className="text-muted-foreground text-xs font-normal bg-muted px-2 py-0.5 rounded-full">{colApps.length}</span>
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 p-1">
                  {isLoading ? (
                     <div className="space-y-3">
                       <Card className="h-32 bg-muted/50 border-dashed animate-pulse rounded-lg" />
                     </div>
                  ) : colApps.length === 0 ? (
                     <div className="h-24 rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
                        No applications here
                     </div>
                  ) : (
                    colApps.map((app) => (
                      <Card key={app.id} className="cursor-grab hover:border-primary/50 transition-colors shadow-sm relative group">
                        <CardContent className="p-4 flex flex-col gap-3">
                           <div className="flex justify-between items-start">
                             <div>
                               <h4 className="font-semibold text-sm line-clamp-1" title={app.jobTitle}>{app.jobTitle}</h4>
                               <p className="text-xs text-muted-foreground mt-0.5">{app.companyName}</p>
                             </div>
                             <div className="bg-muted h-8 w-8 rounded flex items-center justify-center font-bold text-xs shrink-0">
                               {app.companyName.substring(0,1).toUpperCase()}
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatDistanceToNow(new Date(app.lastActionDate), { addSuffix: true })}</span>
                           </div>

                           <Button variant="ghost" size="icon" className="absolute right-2 bottom-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                             <ExternalLink className="h-3 w-3" />
                           </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
