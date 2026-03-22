import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      
      <h1 className="text-xl font-bold text-blue-600">
        TourApp
      </h1>

      <div className="flex gap-4 items-center">
        <Link
          to="/tours"
          className="text-gray-700 hover:text-blue-600"
        >
          Tours
        </Link>

        <Link
          to="/bookings"
          className="text-gray-700 hover:text-blue-600"
        >
          My Bookings
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;