import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ResetPassword from "../components/ResetPassword";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employees, setEmployees] = useState(null);
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
      employees?.data?.paginated_data?.find(
        (emp) => emp.id === parseInt(id)
      ) || null
    );
  }, [employees, id]);

  const handelDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try{
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
    }catch(error){
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee.");
    }
  }

  if (loading) return <p className="p-4">Loading...</p>;
  if (!employee) return <p className="p-4">Employee not found.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold">Employee Details</h1>
      <div>
        <p><strong>ID:</strong> {employee.id}</p>
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Code:</strong> {employee.code}</p>
        <p><strong>Departement:</strong> {employee.department.name}</p>
        <p><strong>Phone:</strong> {employee.phone_number || "N/A"}</p>
        <p><strong>Type:</strong> {employee.type || "N/A"}</p>
        <p><strong>Gender:</strong> {employee.gender || "N/A"}</p>
        <p><strong>Birthdate:</strong> {employee.birth_date || "N/A"}</p>
      </div>
      {employee.image && (
        <img
          src={`https://aa-v2.abdullahkhaled.com/storage/${employee.image}`}
          alt="Employee"
          className="w-32 h-32 object-cover rounded-full mt-4"
        />
      )}

      {/* ✅ Reset Password Section */}
      <div className="pt-6 border-t mt-6">
        <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
        <ResetPassword userId={employee.id} />
      </div>
      <button
        onClick={() => handelDelete(employee.id)}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
};

export default EmployeeDetails;
