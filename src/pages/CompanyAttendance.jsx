import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompanyAttendance = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyAttendance = async () => {
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
        console.log(response.data.data);
        setLocations(response.data.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAttendance();
  }, []);

  if (loading) return <div>Loading locations...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Company Attendance</h1>
      {locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <ul className="space-y-3">
          {locations.map((location) => (
            <li
              key={location.id}
              className="p-4 bg-white dark:bg-gray-700 rounded shadow cursor-pointer hover:bg-gray-100 transition"
              onClick={() => navigate(`/company-attendance/location/${location.id}`)}
            >
              <p>
                <strong>Name:</strong> {location.name}
              </p>
              <p>
                <strong>Latitude:</strong> {location.lat}
              </p>
              <p>
                <strong>Longitude:</strong> {location.long}
              </p>
              <p>
                <strong>Map:</strong> {location.map_location}
              </p>
              <p>
                <strong>Daily Check In:</strong>{" "}
                {location.attendance_today.check_in_count}
              </p>
              <p>
                <strong>Daily Check Out:</strong>{" "}
                {location.attendance_today.check_out_count}
              </p>
              {location.image && (
                <img
                  src={`https://aa-v2.abdullahkhaled.com/storage/${location.image}`}
                  alt={location.name}
                  className="w-40 h-40 object-cover rounded mt-2"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyAttendance;
