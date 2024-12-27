import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Settings, Database, Home } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

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
          <Link to="/settings" className="font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
}