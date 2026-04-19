import { Outlet } from "react-router-dom";
import { UserNavbar } from "../components/UserNavbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}