import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("https://aa-v2.abdullahkhaled.com/api/v1/departments?per_page=10&page=1", {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEditClick = (id, currentName) => {
    setEditingId(id);
    setEditedName(currentName);
  };

  const handleUpdate = async (id) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", editedName);
    formData.append("_method", "PATCH");

    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://aa-v2.abdullahkhaled.com/api/v1/departments/${id}`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setEditingId(null);
      setEditedName('');
      fetchDepartments(); // refresh
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const handleDelete = async (id) => {
    const formData = new FormData();
    formData.append("id", id);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://aa-v2.abdullahkhaled.com/api/v1/departments/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      });
      fetchDepartments(); // refresh
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  if (loading) return <div>Loading departments...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Departments</h1>
      {departments.length === 0 ? (
        <p>No departments found.</p>
      ) : (
        <ul className="space-y-4">
          {departments.map((department) => (
            <li
              key={department.id}
              className="p-4 bg-white dark:bg-gray-700 rounded shadow flex justify-between items-center"
            >
              {editingId === department.id ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border px-2 py-1 mr-2"
                />
              ) : (
                <span><strong>Name:</strong> {department.name}</span>
              )}

              <div className="flex gap-2">
                {editingId === department.id ? (
                  <button
                    onClick={() => handleUpdate(department.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(department.id, department.name)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(department.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Departments;
