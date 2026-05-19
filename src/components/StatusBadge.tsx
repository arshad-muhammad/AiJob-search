import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariants = () => {
    switch (status) {
      case "Queued":
        return "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300";
      case "Reviewing":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300";
      case "Submitted":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300";
      case "Interview":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300";
      case "Offer":
        return "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300";
      case "Rejected":
        return "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <Badge className={`${getVariants()} border-transparent`}>
      {status}
    </Badge>
  );
}
