import { LayoutDashboard, Briefcase, FolderOpen, Settings, Menu, X,Award } from 'lucide-react';
import { FaBoxesStacked } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/certificate', icon: Award, label: 'Certificate', end: false },
  { path: '/admin/projects', icon: FolderOpen, label: 'Projects', end: false },
  { path: '/admin/techstack', icon: FaBoxesStacked, label: 'TechStack', end: false },
  { path: '/admin/settings', icon: Settings, label: 'Settings', end: false },
];

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  return (
    <>
      <div
        className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h1
            className={`font-bold text-xl transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}
          >
            Admin Panel
          </h1>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={24} className="flex-shrink-0" />
                    <span
                      className={`transition-opacity duration-300 whitespace-nowrap ${
                        isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                      }`}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
