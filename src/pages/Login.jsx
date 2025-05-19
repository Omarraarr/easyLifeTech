import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import logo from "../assets/logo.svg";
import bg from "../assets/bg.svg";
const Login = () => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("code", code);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "https://aa-v2.abdullahkhaled.com/api/v1/auth/login",
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const token = response.data?.data?.token;
      const type = response.data?.data?.type;
      if(token && type === "hr"){
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        login(response.data.data);
        navigate("/");
      }else{
        setError("You are not Authorized");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid code or password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left side image */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      />

      {/* Right side login box */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6">
        <img src={logo} alt="ELT Logo" className="w-40 mb-4" />
        <form className="w-full max-w-sm space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-sm text-gray-700">Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
