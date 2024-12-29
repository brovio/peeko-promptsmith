import { NavLink } from "./header/NavLink";
import { ProfileMenu } from "./header/ProfileMenu";
import { ThemeControls } from "./header/ThemeControls";
import { TestTube, Home, Database, LayoutTemplate } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/" className="p-2 hover:bg-accent rounded-md">
                  <Home className="h-5 w-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/models" className="p-2 hover:bg-accent rounded-md">
                  <Database className="h-5 w-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Models</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/use-cases" className="p-2 hover:bg-accent rounded-md">
                  <LayoutTemplate className="h-5 w-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use Cases</p>
              </TooltipContent>
            </Tooltip>

            <NavLink to="/testing" className="flex items-center gap-1 ml-2">
              <TestTube className="h-4 w-4" />
              Testing
            </NavLink>
          </TooltipProvider>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ThemeControls />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}