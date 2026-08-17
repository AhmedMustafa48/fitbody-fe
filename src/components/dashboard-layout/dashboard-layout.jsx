import { Outlet } from "react-router-dom";
import Sidebar from "@components/sidebar/sidebar";
import Header from "@components/header/header";
import { LayoutProvider, useLayout } from "@hooks/use-layout";
import { cn } from "@lib/utils";

const LayoutContent = () => {
  const { isSidebarOpen } = useLayout();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "transition-all duration-300 pt-16",
          isSidebarOpen ? "sm:ml-64" : "sm:ml-20"
        )}
      >
        <div className="p-6 flex flex-col items-center">
          <div className="mb-8 w-full flex justify-center">
            <img
              src="/JYM%20LOGO.png"
              alt="JYM Logo"
              className="h-155 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <LayoutProvider>
      <LayoutContent />
    </LayoutProvider>
  );
};

export default DashboardLayout;
