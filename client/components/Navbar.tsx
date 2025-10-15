import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user,accessToken } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-2">
          <div className="relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
            <Sparkles className="size-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            BuilderOne
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavItem to="/" end>
            Home
          </NavItem>
          <NavItem to="/services/list">Services</NavItem>
          {accessToken && <NavItem to="/dashboard">Dashboard</NavItem>}
        </nav>
        <div className="flex items-center gap-2">
          {!accessToken ? (
            <>
              <Button asChild className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:from-violet-500 hover:to-indigo-500">
                <Link to="/login">Log in</Link>
              </Button>
            </>
          ) : (
            <>
              <span className="hidden text-sm text-muted-foreground md:inline">Hi, {user?.name || user?.email}</span>
              <Button
                variant="outline"
              >
                <LogOut className="mr-2 size-4" /> Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children, end }: { to: string; children: React.ReactNode; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
          isActive && "text-foreground",
        )
      }
    >
      {children}
    </NavLink>
  );
}
