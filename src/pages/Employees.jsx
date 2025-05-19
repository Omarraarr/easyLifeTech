import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IoImagesOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { Plus, X } from "lucide-react";

import axios from "axios";
import SearchFilters from "../components/SearchFilters";

const EMPLOYEES_PER_PAGE = 12;

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    phone: "",
    password: "",
    birthdate: "",
    department_id: "",
    attendance_location_id: "",
    type: "",
    gender: "",
  });
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [usersRes, deptRes, locRes] = await Promise.all([
        axios.get(
          "https://aa-v2.abdullahkhaled.com/api/v1/auth/users?per_page=1000",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        ),
        axios.get("https://aa-v2.abdullahkhaled.com/api/v1/departments?", {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }),
        axios.get(
          "https://aa-v2.abdullahkhaled.com/api/v1/attendancelocations?",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);
      console.log(usersRes.data.data);
      const users = usersRes.data.data.paginated_data;
      setEmployees(users);
      setDepartments(deptRes.data.data);
      setLocations(locRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDept = selectedDepartment
        ? emp.department?.id === parseInt(selectedDepartment)
        : true;
      const matchesLocation = selectedLocation
        ? emp.attendance_location?.id === parseInt(selectedLocation)
        : true;
      return matchesSearch && matchesDept && matchesLocation;
    });
  }, [employees, searchQuery, selectedDepartment, selectedLocation]);

  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE;
    return filteredEmployees.slice(startIndex, startIndex + EMPLOYEES_PER_PAGE);
  }, [filteredEmployees, currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const codeExists = employees.some((emp) => emp.code === formData.code);
    if (codeExists) {
      alert("The code already exists. Please enter a different one.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const submissionData = new FormData();
      for (const key in formData) submissionData.append(key, formData[key]);

      await axios.post(
        "https://aa-v2.abdullahkhaled.com/api/v1/auth/bulk_create_users",
        submissionData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Employee added successfully!");
      setFormData({
        name: "",
        code: "",
        phone: "",
        password: "",
        birthdate: "",
        department_id: "",
        attendance_location_id: "",
        type: "",
        gender: "",
      });
      fetchAllData(); // Refresh employee list
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee.");
    }
  };

  if (loading) return <div>Loading employees...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-primary mb-4">Employees</h1>

      {/* Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={(value) => {
          setSelectedDepartment(value);
          setCurrentPage(1);
        }}
        selectedLocation={selectedLocation}
        setSelectedLocation={(value) => {
          setSelectedLocation(value);
          setCurrentPage(1);
        }}
        departments={departments}
        locations={locations}
      />

      {/* Add Employee Form */}
      {showForm && (
              <form
        onSubmit={handleAddEmployee}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4  dark:bg-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm  hover:shadow-md transition duration-300"
      >
        {[
          ["text", "name", "Name"],
          ["text", "code", "Code"],
          ["text", "phone", "Phone Number"],
          ["password", "password", "Password"],
          ["date", "birthdate", "Birthdate"],
        ].map(([type, name, placeholder]) => (
          <input
            key={name}
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="p-2 text-text-secondary bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300"
            required
          />
        ))}
        <select
          name="department_id"
          value={formData.department_id}
          onChange={handleInputChange}
          className="p-2 text-text-secondary  bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300 "
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <select
          name="attendance_location_id"
          value={formData.attendance_location_id}
          onChange={handleInputChange}
          className="p-2 text-text-secondary bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300"
          required
        >
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="p-2 text-text-secondary bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300"
          required
        >
          <option value="">Select Type</option>
          <option value="hr">Hr</option>
          <option value="employee">Employee</option>
        </select>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="p-2 text-text-secondary bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button
          type="submit"
          className="col-span-1 md:col-span-2 p-2 bg-primary text-white rounded hover:bg-secondary transition duration-300"
        >
          Add Employee
        </button>
      </form>
      )}


      {/* Employee List */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedEmployees.map((employee) => (
          <li
            key={employee.id}
            onClick={() => navigate(`/employees/${employee.id}`)}
            className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300"
          >
            {/* Top right: Department badge */}
            <div className="flex justify-end px-4 pt-4">
              <span className="text-sm text-white bg-primary px-3 py-1 rounded-full">
                {employee.department?.name || "—"}
              </span>
            </div>

            {/* Center content */}
            <div className="flex flex-col items-center pb-6 px-4">
              {employee.image ? (
                <img
                  className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover"
                  src={`https://aa-v2.abdullahkhaled.com/storage/${employee.image}`}
                  alt={employee.name}
                />
              ) : (
                <div className="w-24 h-24 mb-3 rounded-full shadow-lg bg-gray-200 flex items-center justify-center">
                  <IoImagesOutline className="text-gray-500 w-12 h-12" />
                </div>
              )}
              <h5 className="mb-1 text-xl font-medium text-gray-900">
                {employee.name}
              </h5>
              <span className="text-sm text-gray-500 mb-2">
                Code: {employee.code}
              </span>
              <span className="text-sm text-gray-500 flex row">
                <CiLocationOn /> {employee.attendance_location?.name || "—"}{" "}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg z-50"
      >
        {!showForm ? <Plus size={24} /> : <X size={24} />}
      </button>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Employees;
