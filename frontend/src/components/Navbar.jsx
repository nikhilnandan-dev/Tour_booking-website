import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div 
    style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 20px",
  backgroundColor: "#111",
  color: "#fff"
}}>

      <h3>Tour App</h3>

      <div>
        <button
  style={{ marginRight: "10px" }}
  onClick={() => navigate("/tours")}
>
  Tours
</button>
<button
  style={{ marginRight: "10px" }}
  onClick={() => navigate("/bookings")}
>
  My Bookings
</button>
<button
  style={{ backgroundColor: "red", color: "white" }}
  onClick={handleLogout}
>
  Logout
</button>
      </div>
    </div>
  );
};

export default Navbar;