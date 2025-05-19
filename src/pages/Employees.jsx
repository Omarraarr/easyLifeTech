import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchFilters from "../components/SearchFilters";

const EMPLOYEES_PER_PAGE = 5;

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

  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [usersRes, deptRes, locRes] = await Promise.all([
        axios.get("https://aa-v2.abdullahkhaled.com/api/v1/auth/users?per_page=1000", {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }),
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
      <h1 className="text-xl font-bold mb-4">Employees</h1>

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
      <form
        onSubmit={handleAddEmployee}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded bg-gray-50 dark:bg-gray-800"
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
            className="p-2 border rounded"
            required
          />
        ))}
        <select
          name="department_id"
          value={formData.department_id}
          onChange={handleInputChange}
          className="p-2 border rounded"
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
          className="p-2 border rounded"
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
          className="p-2 border rounded"
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
          className="p-2 border rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button
          type="submit"
          className="col-span-1 md:col-span-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Employee
        </button>
      </form>

      {/* Employee List */}
      {paginatedEmployees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <ul className="space-y-4">
          {paginatedEmployees.map((employee) => (
            <div
              key={employee.id}
              className="border rounded p-4 shadow hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/employees/${employee.id}`)}
            >
              <img
                src={employee.image}
                alt={employee.name}
                className="w-24 h-24 object-cover rounded-full mb-2"
              />
              <p className="text-lg font-medium">{employee.name}</p>
              <p className="text-sm text-gray-500">
                {employee.department?.name}
              </p>
            </div>
          ))}
        </ul>
      )}

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
