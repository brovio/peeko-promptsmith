import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, User, LogOut, Sun, Moon, CircleDot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { supabase } from "@/integrations/supabase/client";

export function ProfileMenu() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { applyTheme } = useThemeManager();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user");

        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data?.avatar_url) {
          const { data: imageUrl } = supabase.storage
            .from('profile_photos')
            .getPublicUrl(data.avatar_url);
          setAvatarUrl(imageUrl.publicUrl);
        }
      } catch (error) {
        console.error('Error loading avatar:', error);
      }
    }

    getProfile();
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      if (!supabase.auth) {
        throw new Error("Supabase client not initialized");
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any cached data or state
      setAvatarUrl(null);
      
      // Navigate to login page
      navigate("/login", { replace: true });
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar>
                <AvatarImage src={avatarUrl || ''} />
                <AvatarFallback>
                  <User className="h-8 w-8 text-[hsl(142,76%,36%)]" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Profile Menu</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => applyTheme('light')}>
          <Sun className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
          Light Theme
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme('dark')}>
          <Moon className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
          Dark Theme
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme('black')}>
          <CircleDot className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
          Black Theme
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}