import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiLogOut,
  FiUser,
  FiCheckSquare,
  FiBarChart2,
  FiPlusCircle,
  FiSun,
  FiMoon,
  FiList,
} from "react-icons/fi";

const navConfig = {
  employee: [
    { label: "Dashboard", path: "/employee", icon: FiHome },
    { label: "Apply Leave", path: "/employee/apply", icon: FiPlusCircle },
    { label: "Leave History", path: "/employee/my-leaves", icon: FiCalendar },
    { label: "Profile", path: "/employee/profile", icon: FiUser },
  ],
  manager: [
    { label: "Dashboard", path: "/manager", icon: FiHome },
    { label: "Leave Requests", path: "/manager/requests", icon: FiCheckSquare },
    { label: "Apply Leave", path: "/manager/apply", icon: FiPlusCircle },
    { label: "My Leaves", path: "/manager/my-leaves", icon: FiList },
    { label: "Profile", path: "/manager/profile", icon: FiUser },
  ],
  admin: [
    { label: "Dashboard", path: "/admin", icon: FiHome },
    { label: "Users", path: "/admin/users", icon: FiUsers },
    { label: "All Leaves", path: "/admin/leaves", icon: FiCalendar },
    { label: "Analytics", path: "/admin/analytics", icon: FiBarChart2 },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = navConfig[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#1a2844] dark:bg-gray-950 flex flex-col z-30 shadow-2xl">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">LeaveMS</p>
            <p className="text-white/40 text-[11px] capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active =
            path === `/${user?.role}`
              ? location.pathname === path
              : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-white text-[#1a2844] shadow-sm font-semibold"
                  : "text-white/65 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle + logout */}
      <div className="px-3 pb-3 space-y-0.5 border-t border-white/10 pt-3">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/10 transition"
        >
          {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <FiLogOut size={16} />
          Log Out
        </button>
      </div>

      {/* User info at bottom */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-white/40 text-xs truncate capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
