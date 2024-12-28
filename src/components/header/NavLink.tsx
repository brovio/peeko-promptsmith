import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

export function NavLink({ to, icon: Icon, label }: NavLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={to} className="p-2 hover:bg-accent rounded-md">
            <Icon className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}