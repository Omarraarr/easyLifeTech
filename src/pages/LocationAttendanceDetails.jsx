import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LocationaAttendanceDetails = () => {
  const { id } = useParams(); // location_id
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    return today;
  });
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLocationAttendance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://aa-v2.abdullahkhaled.com/api/v1/attendance/location-users`,
        {
          params: {
            location_id: id,
            date: selectedDate,
            per_page: 15,
            page: 1,
          },
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Attendance data:", response.data);
      setAttendees(response.data.data.paginated_data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationAttendance();
  }, [id, selectedDate]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Attendance for Location #{id}</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {loading ? (
        <p>Loading attendance data...</p>
      ) : attendees.length === 0 ? (
        <p>No attendance data found for this date.</p>
      ) : (
       <div className="overflow-x-auto">
  <table className="min-w-full bg-white rounded shadow">
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="py-2 px-4">Image</th>
        <th className="py-2 px-4">Name</th>
        <th className="py-2 px-4">Check In</th>
        <th className="py-2 px-4">Check Out</th>
      </tr>
    </thead>
    <tbody>
      {attendees.map((entry, index) => (
        <tr key={index} className="border-t">
          <td className="py-2 px-4">
            {entry.user.image ? (
              <img
                src={`https://aa-v2.abdullahkhaled.com/storage/${entry.user.image}`}
                alt={entry.user.name}
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              "—"
            )}
          </td>
          <td className="py-2 px-4">{entry.user.name}</td>
          <td className="py-2 px-4">
            {entry.attendance.check_in
              ? `${entry.attendance.check_in.time} (${entry.attendance.check_in.status})`
              : "—"}
          </td>
          <td className="py-2 px-4">
            {entry.attendance.check_out
              ? `${entry.attendance.check_out.time} (${entry.attendance.check_out.status})`
              : "—"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      )}
    </div>
  );
};

export default LocationaAttendanceDetails;
