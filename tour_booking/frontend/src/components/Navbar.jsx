import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_staff"); // 🔥 also clear admin flag
    navigate("/");
  };

  const isAdmin = localStorage.getItem("is_staff") === "true";

  return (
  <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">

    {/* Logo */}
    <h1
      onClick={() => navigate("/tours")}
      className="text-2xl font-extrabold text-blue-600 cursor-pointer tracking-wide"
    >
      TourApp
    </h1>

    {/* Menu */}
    <div className="flex gap-6 items-center">

      <Link to="/tours" className="hover:text-blue-600 font-medium">
        Tours
      </Link>

      <Link to="/bookings" className="hover:text-blue-600 font-medium">
        My Bookings
      </Link>

      {localStorage.getItem("is_staff") === "true" && (
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-purple-600 text-white px-4 py-1 rounded-lg hover:bg-purple-700 transition"
        >
          Admin
        </button>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>

    </div>
  </nav>
);
}

export default Navbar;