import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import {
  FiGrid,
  FiUsers,
  FiMapPin,
  FiLayers,
  FiClock,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const SidebarLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { to: "/", label: "Dashboard", icon: <FiGrid /> },
    { to: "/employees", label: "Employees", icon: <FiUsers /> },
    { to: "/locations", label: "Locations", icon: <FiMapPin /> },
    { to: "/departments", label: "Departments", icon: <FiLayers /> },
    { to: "/company-attendance", label: "Attendance", icon: <FiClock /> },
    { to: "/profile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F3F5F8]">
      {/* Sidebar */}
      <aside className="w-16 sm:w-64 bg-white text-primary p-4 sm:p-6 flex flex-col justify-between shadow-md h-screen sticky top-0 transition-all duration-300">
        <div>
          {/* Logo */}
          <h1 className="text-xl font-bold text-primary mb-10 hidden sm:block">
            Easy Life Technologies
          </h1>

          {/* Menu */}
          <nav className="space-y-2">
            {menuItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2 py-2 sm:px-4 sm:py-3 rounded-full transition-all ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:text-primary hover:bg-[#e6f4fc]"
                  }`
                }
              >
                <span className="text-xl">{icon}</span>
                <span className="hidden sm:inline text-md">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center sm:justify-start gap-2 w-full text-md text-primary border border-primary px-3 py-2 rounded-full hover:bg-delete hover:border-delete hover:text-white transition"
          >
            <FiLogOut />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
