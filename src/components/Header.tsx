import { NavLink } from "./header/NavLink";
import { ProfileMenu } from "./header/ProfileMenu";
import { ThemeControls } from "./header/ThemeControls";
import { TestTube } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <NavLink to="/" className="mr-6">
            Home
          </NavLink>
          <NavLink to="/testing" className="mr-6 flex items-center gap-1">
            <TestTube className="h-4 w-4" />
            Testing
          </NavLink>
          <NavLink to="/models">
            Models
          </NavLink>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ThemeControls />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}