import { Sun, Moon, Menu, User } from "lucide-react";
import { useLayout } from "@hooks/use-layout";
import { useTheme } from "@app/theme-context/theme-context";
import { cn } from "@lib/utils";

const Header = () => {
  const { toggleSidebar, isSidebarOpen } = useLayout();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 transition-all duration-300",
        isSidebarOpen ? "w-full sm:pl-72" : "w-full sm:pl-24"
      )}
    >
      <div className="flex w-full items-center justify-between">
        {/* Left: menu toggle */}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Right: theme toggle + avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <div className="flex items-center gap-3 border-l border-border pl-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
