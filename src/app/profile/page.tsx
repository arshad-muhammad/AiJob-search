import { useState } from "react";
import { ResumeUploader } from "@/components/ResumeUploader";
import { ProfileForm } from "@/components/ProfileForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: api.getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile saved!", { description: "You are ready to start applying to jobs." });
      navigate("/jobs");
    },
    onError: () => {
      toast.error("Failed to save profile. Please try again.");
    }
  });

  const handleUploadSuccess = (url: string, skills: string[]) => {
     setExtractedSkills(skills);
     toast.success("Resume parsed successfully!");
     setStep(2);
  };

  if (isLoading) {
    return <div className="p-8 space-y-4"><Skeleton className="h-10 w-40" /><Skeleton className="h-96 w-full" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
       <div>
         <h2 className="text-3xl font-bold tracking-tight">Candidate Profile</h2>
         <p className="text-muted-foreground mt-2 text-sm">
           Set up your profile once. Our AI uses this data to answer application questions correctly and tailor your resume perfectly.
         </p>
       </div>

       {step === 1 && (
         <Card>
           <CardHeader>
             <CardTitle>Step 1: Upload Existing Resume</CardTitle>
             <CardDescription>We'll parse your work experience and skills to pre-fill your profile.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-6">
              <ResumeUploader onUploadSuccess={handleUploadSuccess} />
              <div className="flex justify-between items-center text-sm pt-4 border-t">
                 <span className="text-muted-foreground">Already uploaded? Or want to fill manually?</span>
                 <Button variant="ghost" onClick={() => setStep(2)}>Skip to Step 2 →</Button>
              </div>
           </CardContent>
         </Card>
       )}

       {step === 2 && (
         <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
           {extractedSkills.length > 0 && (
             <Card className="bg-primary/5 border-primary/20">
               <CardHeader className="pb-3">
                 <CardTitle className="text-base text-primary">Extracted Skills</CardTitle>
                 <CardDescription>We pulled these from your resume.</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="flex flex-wrap gap-2">
                   {extractedSkills.map((skill, i) => (
                     <Badge key={i} variant="secondary">{skill}</Badge>
                   ))}
                 </div>
               </CardContent>
             </Card>
           )}

           <Card>
             <CardHeader>
               <CardTitle>Step 2: Core Preferences</CardTitle>
               <CardDescription>Tell us what jobs to look for and your salary expectations.</CardDescription>
             </CardHeader>
             <CardContent>
                <ProfileForm 
                  initialData={profile} 
                  onSubmit={(d) => updateMutation.mutate(d as any)} 
                  isLoading={updateMutation.isPending} 
                />
             </CardContent>
           </Card>
         </div>
       )}
    </div>
  );
}
