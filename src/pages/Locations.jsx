import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash } from "lucide-react";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", attendace_zone: "" });

  const [adding, setAdding] = useState(false);
  const [newLocationData, setNewLocationData] = useState({
    name: "",
    attendace_zone: "",
  });

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://aa-v2.abdullahkhaled.com/api/v1/attendancelocations?",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocations(response.data.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewLocationChange = (e) => {
    const { name, value } = e.target;
    setNewLocationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!newLocationData.name.trim()) {
      alert("Name is required.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", newLocationData.name);
      formData.append("image", newLocationData.image || ""); // optional
      formData.append("map_location", newLocationData.map_location || "");
      formData.append("lat", newLocationData.lat || "");
      formData.append("long", newLocationData.long || "");
      formData.append("attendace_zone", newLocationData.attendace_zone);
      await axios.post(
        "https://aa-v2.abdullahkhaled.com/api/v1/attendancelocations",
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchLocations();
      setNewLocationData({ name: "", attendace_zone: "" });
      setAdding(false);
    } catch (error) {
      console.error("Error adding location:", error);
      alert("Failed to add location.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://aa-v2.abdullahkhaled.com/api/v1/attendancelocations/${id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocations((prev) => prev.filter((location) => location.id !== id));
    } catch (error) {
      console.error("Error deleting location:", error);
      alert("Failed to delete location.");
    }
  };

  const startEditing = (location) => {
    setEditingId(location.id);
    setEditData({
      name: location.name,
      attendace_zone: location.attendace_zone,
    });
  };

  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("attendace_zone", editData.attendace_zone);
      formData.append("_method", "PATCH");

      await axios.post(
        `https://aa-v2.abdullahkhaled.com/api/v1/attendancelocations/${id}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLocations((prev) =>
        prev.map((loc) => (loc.id === id ? { ...loc, ...editData } : loc))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location.");
    }
  };

  if (loading) return <div>Loading locations...</div>;

  return (
    <div className="relative pb-20">
      <h1 className="text-xl font-bold mb-4 text-primary">Locations</h1>

      {/* Add Location Section */}
      {adding && (
        <div className="space-y-2 p-4 border rounded bg-gray-50 dark:bg-gray-800 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newLocationData.name}
            onChange={handleNewLocationChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="attendace_zone"
            placeholder="Attendance Zone"
            value={newLocationData.attendace_zone}
            onChange={handleNewLocationChange}
            className="w-full p-2 border rounded"
          />
          <div className="space-x-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setNewLocationData({ name: "", attendace_zone: "" });
              }}
              className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Locations List */}
      {locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {locations.map((location) => (
            <li
              key={location.id}
              className="p-4 bg-white dark:bg-gray-700 rounded shadow text-center relative"
            >
              {location.image && (
                <img
                  src={`https://aa-v2.abdullahkhaled.com/storage/${location.image}`}
                  alt={location.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}

              {editingId === location.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="w-full p-1 border rounded"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    name="attendace_zone"
                    value={editData.attendace_zone}
                    onChange={handleEditChange}
                    className="w-full p-1 border rounded"
                    placeholder="Attendance Zone"
                  />
                  <div className="space-x-2 mt-2">
                    <button
                      onClick={() => handleEditSave(location.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-semibold">{location.name}</p>
                  <p className="text-sm text-gray-500">
                    {location.attendace_zone}
                  </p>
                  <div className="mt-2 flex justify-center gap-3">
                    <button
                      onClick={() => startEditing(location)}
                      className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setAdding(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg z-50"
        title="Add Location"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Locations;
