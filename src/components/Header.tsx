import { Database, Home, MessageSquare, Settings } from "lucide-react";
import { NavLink } from "./header/NavLink";
import { ThemeControls } from "./header/ThemeControls";
import { ProfileMenu } from "./header/ProfileMenu";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <nav className="flex gap-2 items-center">
          <NavLink to="/" icon={Home} label="Home" />
          <NavLink to="/models" icon={Database} label="Models" />
          <NavLink 
            to="/what-prompting" 
            icon={MessageSquare} 
            label="What ya prompting for?" 
          />
          <NavLink to="/settings" icon={Settings} label="Settings" />
        </nav>
        <div className="flex items-center gap-4">
          <ThemeControls />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}