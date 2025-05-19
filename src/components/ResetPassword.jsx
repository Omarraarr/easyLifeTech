import { useState } from "react";
import axios from "axios";

const ResetPassword = ({ userId }) => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    axios
      .post("https://aa-v2.abdullahkhaled.com/api/v1/user/update-password", {
        id: userId,
        password,
      }, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setMessage("Password updated successfully!");
        setPassword("");
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message || "Failed to update password.";
        setError(msg);
      });
  };

  return (
    <div className="mt-6 p-4">
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-md font-medium">New Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 text-text-secondary bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-md font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full  px-3 py-2 text-text-secondary bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
