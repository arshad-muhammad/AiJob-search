import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CandidateProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define form schema
const profileSchema = z.object({
  targetJobTitles: z.string().min(1, "Enter at least one job title (comma separated)"),
  preferredLocations: z.string().min(1, "Enter at least one location (comma separated)"),
  salaryMin: z.coerce.number().min(0, "Minimum salary must be positive"),
  salaryMax: z.coerce.number().min(0, "Maximum salary must be positive"),
  remotePreference: z.enum(["remote_only", "hybrid", "on_site"]),
  visaSponsorshipNeeded: z.boolean(),
  yearsOfExperience: z.coerce.number().min(0).max(50),
});

interface ProfileFormProps {
  initialData?: CandidateProfile | null;
  onSubmit: (data: z.infer<typeof profileSchema>) => void;
  isLoading?: boolean;
}

export function ProfileForm({ initialData, onSubmit, isLoading }: ProfileFormProps) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      targetJobTitles: initialData?.targetJobTitles.join(", ") || "",
      preferredLocations: initialData?.preferredLocations.join(", ") || "",
      salaryMin: initialData?.salaryRange[0] || 0,
      salaryMax: initialData?.salaryRange[1] || 150000,
      remotePreference: (initialData?.remotePreference as "remote_only" | "hybrid" | "on_site") || "hybrid",
      visaSponsorshipNeeded: initialData?.visaSponsorshipNeeded || false,
      yearsOfExperience: initialData?.yearsOfExperience || 0,
    },
  });

  return (
    // Assuming UI Form components are available or we can just use normal HTML form wrapped in standard shadcn pattern
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Target Job Titles (comma separated)</label>
          <Input placeholder="e.g. Frontend Engineer, React Developer" {...form.register("targetJobTitles")} />
          {form.formState.errors.targetJobTitles && <p className="text-sm text-destructive">{form.formState.errors.targetJobTitles.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Preferred Locations (comma separated)</label>
          <Input placeholder="e.g. New York, Remote, London" {...form.register("preferredLocations")} />
          {form.formState.errors.preferredLocations && <p className="text-sm text-destructive">{form.formState.errors.preferredLocations.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Years of Experience</label>
          <Input type="number" {...form.register("yearsOfExperience")} />
        </div>

        <div className="flex flex-col space-y-4 pt-2">
           <label className="text-sm font-medium leading-none">Remote Preference</label>
           <RadioGroup 
             onValueChange={(val) => form.setValue("remotePreference", val as any)} 
             defaultValue={form.getValues("remotePreference")}
             className="flex gap-4"
           >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="remote_only" id="remote_only" />
                <label htmlFor="remote_only" className="text-sm">Remote</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <label htmlFor="hybrid" className="text-sm">Hybrid</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="on_site" id="on_site" />
                <label htmlFor="on_site" className="text-sm">On-site</label>
              </div>
           </RadioGroup>
        </div>

        <div className="space-y-4">
           <label className="text-sm font-medium leading-none block">Salary Expectations (Min - Max USD)</label>
           <div className="flex gap-4 items-center">
             <Input type="number" placeholder="Min" {...form.register("salaryMin")} />
             <span>to</span>
             <Input type="number" placeholder="Max" {...form.register("salaryMax")} />
           </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <label className="text-base font-medium">Visa Sponsorship</label>
            <p className="text-sm text-muted-foreground">Do you require visa sponsorship now or in the future?</p>
          </div>
          <Switch 
            checked={form.watch("visaSponsorshipNeeded")}
            onCheckedChange={(val) => form.setValue("visaSponsorshipNeeded", val)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
         <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Saving..." : "Save Profile & Continue"}
         </Button>
      </div>
    </form>
  );
}
