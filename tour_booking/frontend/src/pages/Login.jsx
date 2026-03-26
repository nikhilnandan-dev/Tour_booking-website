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
localStorage.setItem("is_staff", res.data.is_staff);

if (res.data.is_staff === true) {
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