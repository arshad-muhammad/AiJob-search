import { JobListing } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, MapPin, DollarSign, CalendarCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export function JobCard({ job }: { job: JobListing }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-500";
    if (score >= 60) return "text-amber-600 dark:text-amber-500";
    return "text-red-600 dark:text-red-500";
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start mb-2 gap-4">
          <div className="flex items-center gap-3">
            {job.logoUrl ? (
              <img src={job.logoUrl} alt={job.companyName} className="h-10 w-10 rounded-md object-contain" />
            ) : (
              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <h3 className="font-semibold line-clamp-1" title={job.title}>{job.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{job.companyName}</p>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">{job.source}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 pt-0 flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          {job.salaryMin && job.salaryMax && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              <span>{job.salaryMin/1000}k - {job.salaryMax/1000}k</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <CalendarCheck className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 space-y-1.5">
          <div className="flex justify-between items-center text-sm">
             <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Match Score</span>
             <span className={`font-bold ${getScoreTextColor(job.matchScore)}`}>{job.matchScore}%</span>
          </div>
          {/* Custom colored progress based on score */}
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
             <div 
               className={`h-full ${getScoreColor(job.matchScore)} transition-all`} 
               style={{ width: `${job.matchScore}%` }} 
             />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <Button asChild className="w-full" disabled={job.isApplied} variant={job.isApplied ? "secondary" : "default"}>
          <Link to={`/jobs/${job.id}`}>
            {job.isApplied ? "Already Applied" : "Review & Apply"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
