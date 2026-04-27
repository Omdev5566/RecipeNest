import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
