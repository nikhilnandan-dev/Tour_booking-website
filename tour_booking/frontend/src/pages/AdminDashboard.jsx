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

  // 🔥 MOVED OUTSIDE (IMPORTANT FIX)
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const statsRes = await axios.get(
        "http://127.0.0.1:8000/api/bookings/stats/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(statsRes.data);

      const bookingsRes = await axios.get(
        "http://127.0.0.1:8000/api/bookings/all/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAllBookings(bookingsRes.data);

    } catch (err) {
      console.log(err);
    }
  };
  const fetchDashboardData = async () => {
  try {
    const statsRes = await axios.get(
      "http://127.0.0.1:8000/api/bookings/stats/"
    );

    const bookingsRes = await axios.get(
      "http://127.0.0.1:8000/api/bookings/all/"
    );

    setStats(statsRes.data);
    setBookings(bookingsRes.data);

  } catch (err) {
    console.log(err);
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
  useEffect(() => {
  fetchDashboardData();
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
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {allBookings.map((b) => (
                <tr key={b.id} className="border-t">

                  <td className="p-3">{b.tour?.name}</td>
                  <td className="p-3">{b.number_of_people}</td>

                  <td className="p-3">

                    {b.is_cancelled ? (
                      <span className="text-red-500 font-semibold">
                        Cancelled
                      </span>
                    ) : b.is_used ? (
                      <span className="text-gray-500 font-semibold">
                        Used
                      </span>
                    ) : (
                      <div className="flex gap-2">

                        <button
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");

                              await axios.post(
                                `http://127.0.0.1:8000/api/bookings/mark-used/${b.id}/`,
                                {},
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );

                              alert("Marked as used");

                              await fetchData(); // 🔥 FIX

                            } catch (err) {
                              console.log(err.response?.data || err);
                              alert("Failed");
                            }
                          }}
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Mark Used
                        </button>

                        <button
                          onClick={async () => {
                            const confirmCancel = window.confirm("Cancel this booking?");
                            if (!confirmCancel) return;

                            try {
                              const token = localStorage.getItem("token");

                              await axios.post(
                                `http://127.0.0.1:8000/api/bookings/admin-cancel/${b.id}/`,
                                {},
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );

                              await fetchData(); // 🔥 FIX

                            } catch (err) {
                              console.log(err.response?.data || err);
                              alert("Cancel failed");
                            }
                          }}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Cancel
                        </button>

                      </div>
                    )}

                  </td>

                </tr>
              ))}
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