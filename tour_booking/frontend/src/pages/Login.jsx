import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/users/login/",
      {
        username,
        password,
      }
    );

    localStorage.setItem("token", res.data.access);

    alert("Login successful");

    navigate("/tours");   // 🔥 THIS IS IMPORTANT

  } catch (err) {
    console.log(err);
    alert("Login failed");
  }
};

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;