import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Settings, User, LogOut, Sun, Moon, CircleDot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useThemeManager } from "@/hooks/use-theme-manager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProfileMenu() {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const { applyTheme } = useThemeManager();
  const avatarUrl = null; // This should be replaced with actual avatar URL when implemented

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar>
                  <AvatarImage src={avatarUrl || ''} />
                  <AvatarFallback>
                    <User className="h-5 w-5 dark:text-primary black:text-primary" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Profile Menu</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent align="end" className="bg-background w-56">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => applyTheme('light')}>
            <Sun className="mr-2 h-4 w-4 dark:text-primary black:text-primary" />
            Light Theme
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => applyTheme('dark')}>
            <Moon className="mr-2 h-4 w-4 dark:text-primary black:text-primary" />
            Dark Theme
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => applyTheme('black')}>
            <CircleDot className="mr-2 h-4 w-4 dark:text-primary black:text-primary" />
            Black Theme
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4 dark:text-primary black:text-primary" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/account")}>
            <Settings className="mr-2 h-4 w-4 dark:text-primary black:text-primary" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Settings className="mr-2 h-4 w-4 dark:text-primary black:text-primary" />
            Settings
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4 dark:text-primary black:text-primary" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}