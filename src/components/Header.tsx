import { NavLink } from "./header/NavLink";
import { ProfileMenu } from "./header/ProfileMenu";
import { ThemeControls } from "./header/ThemeControls";
import { Home, Database, LayoutTemplate } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex items-center space-x-4">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="w-[40px] h-[40px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <NavLink to="/">
                    <Home className="h-[37px] w-[37px] dark:text-primary black:text-primary" />
                  </NavLink>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center" sideOffset={5}>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="w-[40px] h-[40px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <NavLink to="/models">
                    <Database className="h-[37px] w-[37px] dark:text-primary black:text-primary" />
                  </NavLink>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center" sideOffset={5}>
                <p>Models</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="w-[40px] h-[40px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <NavLink to="/what-prompting">
                    <LayoutTemplate className="h-[37px] w-[37px] dark:text-primary black:text-primary" />
                  </NavLink>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center" sideOffset={5}>
                <p>Use Cases</p>
              </TooltipContent>
            </Tooltip>
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