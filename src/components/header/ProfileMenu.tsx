import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Settings, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    }

    getProfile();
  }, [supabase]);

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Settings 
              className="h-8 w-8 text-[hsl(142,76%,36%)] cursor-pointer hover:text-white transition-colors" 
              onClick={() => navigate("/settings")}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className={isLoading ? "animate-pulse" : ""}>
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

        <DropdownMenuContent align="end" className="bg-background">
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/account")}>
            <Settings className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}