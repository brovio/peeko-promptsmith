import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Settings, Database, Home, MessageSquare, Sun, Moon, CircleDot } from "lucide-react";
import { useThemeManager } from "@/hooks/use-theme-manager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
  const navigate = useNavigate();
  const { applyTheme } = useThemeManager();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <nav className="flex gap-4 items-center">
          <Link to="/" className="font-medium flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link to="/models" className="font-medium flex items-center gap-2">
            <Database className="h-4 w-4" />
            Models
          </Link>
          <Link to="/what-prompting" className="font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            What ya prompting for?
          </Link>
          <Link to="/settings" className="font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => applyTheme('light')}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Light Theme</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => applyTheme('dark')}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dark Theme</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => applyTheme('black')}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  >
                    <CircleDot className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Black Theme</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}