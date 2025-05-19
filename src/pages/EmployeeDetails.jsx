import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { MdLockReset, MdDelete } from "react-icons/md";
import { Phone, Calendar, User, Building2, X } from "lucide-react";
import axios from "axios";
import ResetPassword from "../components/ResetPassword";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employees, setEmployees] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://aa-v2.abdullahkhaled.com/api/v1/auth/users?per_page=1000")
      .then((response) => {
        console.log("Employee API response:", response.data);
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const employee = useMemo(() => {
    return (
      employees?.data?.paginated_data?.find((emp) => emp.id === parseInt(id)) ||
      null
    );
  }, [employees, id]);

  const handelDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://aa-v2.abdullahkhaled.com/api/v1/user/delete/${id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      navigate("/employees");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!employee) return <p className="p-4">Employee not found.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
      {/* Department Label */}
      <div className="flex justify-end px-4 pt-4">
        <span className="text-sm text-white bg-primary px-3 py-1 rounded-full">
          {employee.department?.name || "—"}
        </span>
      </div>

      {/* Employee Image */}
      {employee.image && (
        <img
          src={`https://aa-v2.abdullahkhaled.com/storage/${employee.image}`}
          alt="Employee"
          className="w-32 h-32 object-cover rounded-full mx-auto mt-4"
        />
      )}

      {/* Name and Code */}
      <div>
        <h2 className="text-lg font-bold mt-2">{employee.name}</h2>
        <p className="text-gray-500 text-sm">Code: {employee.code}</p>
      </div>

      {/* Action Icons */}
      <div className="flex justify-center items-center gap-4 mt-2">
        {/* Reset Password Icon */}
        <button
          onClick={() => setShowResetModal(true)}
          className="text-yellow-500 hover:text-yellow-700"
          title="Reset Password"
        >
          <MdLockReset size={28} color="#E4A200" />
        </button>

        {/* Delete Icon */}
        <button
          onClick={() => handelDelete(employee.id)}
          className="text-red-500 hover:text-red-700"
          title="Delete User"
        >
          <MdDelete size={28} color="red" />
        </button>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-grey-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full absolute">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-2 right-2 text-delete rounded hover:bg-gray-300"
            >
              <X size={24} />
            </button>
            <ResetPassword userId={employee.id} />
          </div>
        </div>
      )}

      {/* Subtitle */}
      <h3 className="text-left text-lg font-semibold pt-6 border-t mt-6 text-primary">
        Information
      </h3>

      {/* Info Fields */}
      <div className="text-left space-y-4">
        {/* Phone Number */}
        <div>
          <p className="text-sm font-semibold text-gray-700">Phone Number</p>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{employee.phone_number || "N/A"}</span>
          </div>
        </div>

        {/* Birthdate */}
        <div>
          <p className="text-sm font-semibold text-gray-700">Birthdate</p>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{employee.birth_date || "N/A"}</span>
          </div>
        </div>

        {/* Gender */}
        <div>
          <p className="text-sm font-semibold text-gray-700">Gender</p>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4" />
            <span>{employee.gender || "N/A"}</span>
          </div>
        </div>

        {/* Department */}
        <div>
          <p className="text-sm font-semibold text-gray-700">Department</p>
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-4 h-4" />
            <span>{employee.department?.name || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
