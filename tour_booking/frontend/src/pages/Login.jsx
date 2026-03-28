import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user"); // 🔥 UI only
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); // clear old error
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/users/login/",
      {
        username,
        password,
      }
    );

    const isStaff = res.data.is_staff;

    // 🔥 STRICT ROLE MATCHING

    // User selected but admin account
    if (selectedRole === "user" && isStaff) {
  setError("Please login through Admin tab");
  return;
}

if (selectedRole === "admin" && !isStaff) {
  setError("Access denied: You are not an admin");
  return;
}

    // ✅ Only valid match continues
    localStorage.setItem("token", res.data.access);
    localStorage.setItem("is_staff", isStaff);

    if (isStaff) {
      navigate("/admin-dashboard");
    } else {
      navigate("/tours");
    }

  } catch (err) {
    console.log(err);
    alert("Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        {/* 🔥 ROLE TOGGLE (UI ONLY) */}
        <div className="flex gap-2 mb-4">
  <button
    onClick={() => setSelectedRole("user")}
    className={`w-full py-2 rounded ${
      selectedRole === "user"
        ? "bg-blue-500 text-white"
        : "bg-gray-200"
    }`}
  >
    User
  </button>

  <button
    onClick={() => setSelectedRole("admin")}
    className={`w-full py-2 rounded ${
      selectedRole === "admin"
        ? "bg-purple-500 text-white"
        : "bg-gray-200"
    }`}
  >
    Admin
  </button>
</div>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 animate-pulse">

    <span className="text-red-500 text-lg">⚠️</span>

    <p className="text-red-600 text-sm font-medium">
      {error}
    </p>

  </div>
)}

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition active:scale-95"
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;