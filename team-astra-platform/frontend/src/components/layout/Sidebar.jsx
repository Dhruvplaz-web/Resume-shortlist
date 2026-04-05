import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Users, BarChart2, Settings, UserCircle } from 'lucide-react';

export default function Sidebar({ children }) {
  const location = useLocation();
  // We add a simple state to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload', path: '/upload', icon: UploadCloud },
    { name: 'Candidates', path: '/candidates', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg font-bold text-xs">AI</div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Team Astra</span>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* MODIFIED: Dynamic Login / Profile Section */}
        <div className="p-6 border-t border-gray-100">
          {!isLoggedIn ? (
            <div className="flex flex-col gap-3">
              {/* Log In Button - Outlined, Pill Shape, Uppercase */}
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-transparent border-2 border-slate-900 text-slate-900 text-xs font-bold tracking-wider uppercase py-2.5 rounded-full hover:bg-slate-50 transition-colors"
              >
                Log In
              </button>
              
              {/* Sign Up Button - Solid, Pill Shape, Uppercase */}
              <button className="w-full bg-slate-900 text-white text-xs font-bold tracking-wider uppercase py-2.5 rounded-full hover:bg-slate-800 shadow-sm transition-colors">
                Sign Up
              </button>
            </div>
          ) : (
            /* Logged In State - Profile Avatar linking to Profile Page */
            <Link to="/profile" className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
              <UserCircle className="w-10 h-10 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">Admin User</span>
                <span className="text-xs text-blue-600 font-medium">View Profile</span>
              </div>
            </Link>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}