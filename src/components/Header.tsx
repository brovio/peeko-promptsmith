import { NavLink } from "./header/NavLink";
import { ProfileMenu } from "./header/ProfileMenu";
import { ThemeControls } from "./header/ThemeControls";
import { Home, Database, LayoutTemplate, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/" className="p-2 rounded-md group">
                  <Home className="h-5 w-5 group-hover:text-white transition-colors" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/models" className="p-2 rounded-md group">
                  <Database className="h-5 w-5 group-hover:text-white transition-colors" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Models</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/what-prompting" className="p-2 rounded-md group">
                  <LayoutTemplate className="h-5 w-5 group-hover:text-white transition-colors" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use Cases</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/info" className="p-2 rounded-md group">
                  <Info className="h-5 w-5 group-hover:text-white transition-colors text-muted-foreground group-hover:text-[hsl(142,76%,36%)]" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Information</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-6">
          <ThemeControls />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}