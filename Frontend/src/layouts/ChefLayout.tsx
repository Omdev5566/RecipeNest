import { Outlet } from 'react-router-dom';
import { ChefSidebar } from '../components/ChefSidebar';

export default function ChefLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <ChefSidebar />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
