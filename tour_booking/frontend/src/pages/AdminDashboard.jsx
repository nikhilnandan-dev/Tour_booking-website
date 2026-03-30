import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    cancelled: 0,
    used: 0,
  });

  const [allBookings, setAllBookings] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const statsRes = await axios.get(
        "http://127.0.0.1:8000/api/bookings/stats/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const bookingsRes = await axios.get(
        "http://127.0.0.1:8000/api/bookings/all/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(statsRes.data);
      setAllBookings(bookingsRes.data);

    } catch (err) {
      console.log("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    const isStaff = localStorage.getItem("is_staff");

    if (isStaff !== "true") {
      alert("Access denied");
      navigate("/");
      return;
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h2>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Total</p>
          <h3 className="font-bold">{stats.total}</h3>
        </div>

        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p>Active</p>
          <h3 className="font-bold">{stats.active}</h3>
        </div>

        <div className="bg-red-100 p-4 rounded shadow text-center">
          <p>Cancelled</p>
          <h3 className="font-bold">{stats.cancelled}</h3>
        </div>

        <div className="bg-gray-200 p-4 rounded shadow text-center">
          <p>Used</p>
          <h3 className="font-bold">{stats.used}</h3>
        </div>

      </div>

      {/* 🔥 TABLE */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">All Bookings</h3>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Tour</th>
                <th className="p-3">People</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {allBookings.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-3 text-center">
                    No bookings found
                  </td>
                </tr>
              ) : (
                allBookings.map((b) => (
                  <tr key={b.id} className="border-b">

                    {/* ✅ FIXED TOUR DISPLAY */}
                    <td className="p-3">
                      <div className="font-semibold">
                        {b.tour?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        📍 {b.tour?.location}
                      </div>
                      <div className="text-sm">
                        ₹{b.tour?.price}
                      </div>
                    </td>

                    <td className="p-3">
                      {b.number_of_people}
                    </td>

                    <td className="p-3">
                      {b.is_cancelled
                        ? "Cancelled"
                        : b.is_used
                        ? "Used"
                        : "Active"}
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* 🔥 ACTIONS */}
      <div className="grid gap-4 max-w-md mt-10">

        <button
          onClick={() => navigate("/admin-scan")}
          className="bg-blue-600 text-white p-4 rounded"
        >
          Go to Scanner
        </button>

        <button
          onClick={() => navigate("/bookings")}
          className="bg-purple-600 text-white p-4 rounded"
        >
          View User Bookings
        </button>

      </div>

    </div>
  );
}

export default AdminDashboard;