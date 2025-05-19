import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Employees from "./pages/Employees";
import EmployeeDetails from "./pages/EmployeeDetails";
import Locations from "./pages/Locations";
import Departments from "./pages/Departments";
import CompanyAttendance from "./pages/CompanyAttendance";
import LocationAttendanceDetails from "./pages/LocationAttendanceDetails";
import Profile from "./pages/Profile";
import SidebarLayout from "./components/SidebarLayout";
function App() {
  const { user } = useAuth();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {user && (
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/:id" element={<EmployeeDetails />} /> 
          <Route path="locations" element={<Locations />} />
          <Route path="departments" element={<Departments />} />
          <Route path="company-attendance" element={<CompanyAttendance />} />
          <Route path="company-attendance/location/:id" element={<LocationAttendanceDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      )}

      {!user && !isLoginPage && <Route path="*" element={<Login />} />}
    </Routes>
  );
}

export default App;