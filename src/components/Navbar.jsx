import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
const Navbar = () => {
   const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
      <div className="space-x-4">
        <Link to="/" className="text-black dark:text-white hover:underline">
          Home
        </Link>
        <Link
          to="/about"
          className="text-black dark:text-white hover:underline"
        >
          About
        </Link>
      </div>
      {user && (
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      )}
      <ThemeToggle />
    </nav>
  );
};

export default Navbar;
