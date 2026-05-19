import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Send, TrendingUp, Handshake, MailOpen, Briefcase, Plus, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { JobCard } from "@/components/JobCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: api.getDashboardStats,
  });

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["recentApplications"],
    queryFn: api.getApplications,
  });

  const { data: recommendedJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["recommendedJobs"],
    queryFn: () => api.getJobs({ limit: 4 }), // Just a subset for recommendations
  });

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate("/jobs")} className="gap-2">
            <Plus className="h-4 w-4" /> Run Discovery
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applied</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {statsLoading ? <Skeleton className="h-8 w-20" /> : (
               <div className="text-2xl font-bold">{stats?.totalApplied}</div>
             )}
            <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-20" /> : (
               <div className="text-2xl font-bold">{stats?.responseRatePercent}%</div>
             )}
            <p className="text-xs text-muted-foreground mt-1">above industry average (5%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {statsLoading ? <Skeleton className="h-8 w-20" /> : (
               <div className="text-2xl font-bold">{stats?.interviews}</div>
             )}
            <p className="text-xs text-muted-foreground mt-1">1 scheduled next week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {statsLoading ? <Skeleton className="h-8 w-20" /> : (
               <div className="text-2xl font-bold">{stats?.offers}</div>
             )}
            <p className="text-xs text-muted-foreground mt-1">Pending negotiation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your latest automated submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
               <div className="space-y-4">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <div className="flex gap-4 items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[150px]" />
                           <Skeleton className="h-3 w-[100px]" />
                        </div>
                     </div>
                     <Skeleton className="h-6 w-20 rounded-full" />
                   </div>
                 ))}
               </div>
            ) : applications?.length === 0 ? (
               <div className="flex items-center justify-center h-32 flex-col gap-2">
                  <Briefcase className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No applications yet.</p>
                  <Button variant="link" asChild><Link to="/jobs">Discover jobs to apply</Link></Button>
               </div>
            ) : (
              <div className="space-y-6">
                 {applications?.slice(0, 5).map(app => (
                   <div key={app.id} className="flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                         <div className="bg-muted h-10 w-10 flex text-muted-foreground font-semibold items-center justify-center rounded-md border">
                            {app.companyName.substring(0,2).toUpperCase()}
                         </div>
                         <div>
                            <p className="text-sm font-medium leading-none">{app.jobTitle}</p>
                            <p className="text-sm text-muted-foreground mt-1">{app.companyName}</p>
                         </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground hidden sm:block">
                           {app.daysSinceSubmitted} days ago
                        </span>
                        <StatusBadge status={app.status} />
                     </div>
                   </div>
                 ))}
              </div>
            )}
            {applications && applications.length > 5 && (
               <div className="mt-6 flex justify-center border-t pt-4">
                 <Button variant="ghost" className="w-full" onClick={() => navigate("/applications")}>View All Tracking <ArrowRight className="ml-2 h-4 w-4" /></Button>
               </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 h-[600px] overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Top Matched Jobs</CardTitle>
            <CardDescription>Based on your profile, waiting for your approval.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2 pb-6 space-y-4">
             {jobsLoading ? (
               <div className="space-y-4">
                 <Skeleton className="h-40 w-full" />
                 <Skeleton className="h-40 w-full" />
               </div>
             ) : recommendedJobs?.map((job) => (
                <JobCard key={job.id} job={job} />
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
