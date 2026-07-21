import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck, CreditCard } from "lucide-react";
import { cn } from "@lib/utils";
import { useLayout } from "@hooks/use-layout";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/members", icon: Users },
  { label: "Attendance", href: "/attendance", icon: CalendarCheck },
  { label: "Fees", href: "/fees", icon: CreditCard },
];

const Sidebar = () => {
  const { isSidebarOpen } = useLayout();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isSidebarOpen
          ? "w-64 translate-x-0"
          : "w-0 -translate-x-full sm:w-20 sm:translate-x-0"
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        {/* Logo */}
        <div
          className={cn(
            "mb-8 flex items-center gap-2 px-1 transition-all",
            !isSidebarOpen && "sm:justify-center"
          )}
        >
          {isSidebarOpen ? (
            <img
              src="/JYM%20LOGO.png"
              alt="FitBody"
              className="h-12 w-auto object-contain"
            />
          ) : (
            <img
              src="/JYM%20LOGO.png"
              alt="FitBody"
              className="h-9 w-9 object-contain rounded-lg sm:block hidden"
            />
          )}
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-lg p-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !isSidebarOpen && "sm:justify-center"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive
                        ? "text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "ms-3 transition-opacity",
                      !isSidebarOpen && "sm:hidden"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
