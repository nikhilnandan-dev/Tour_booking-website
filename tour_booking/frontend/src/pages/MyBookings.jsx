import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const location = useLocation();
  const [view, setView] = useState(location.state?.tab || "active");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      fetchBookings();
    }
  }, []);

  // 🔥 HANDLE TAB REDIRECTION (IMPORTANT)
  useEffect(() => {
    if (location.state?.tab) {
      setView(location.state.tab);
    }
  }, [location.state]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/bookings/my/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(res.data);
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  // 🔥 FILTER + SORT
  const filteredBookings = bookings
    .filter((b) => {
      if (view === "active") return !b.is_cancelled && !b.is_used;
      if (view === "used") return b.is_used && !b.is_cancelled;
      if (view === "cancelled") return b.is_cancelled;
      return false;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // ✅ VIEW TICKET
  const handleViewTicket = (booking) => {
  navigate("/ticket", { state: { booking } });
};

  // ✅ MARK USED + REDIRECT
  const handleMarkUsed = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      `http://127.0.0.1:8000/api/bookings/mark-used/${id}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔥 switch tab locally
    setView("used");

    // 🔥 refresh data
    fetchBookings();

  } catch (err) {
    console.log(err);
    alert("Failed to mark as used");
  }
};

  // ✅ CANCEL + REDIRECT
  const handleCancel = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://127.0.0.1:8000/api/bookings/delete/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔥 switch tab locally
    setView("cancelled");

    // 🔥 refresh
    fetchBookings();

  } catch (err) {
    console.log(err);
    alert("Failed to cancel booking");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold mb-6">
          My Bookings
        </h2>

        {/* 🔥 TAB SWITCH */}
        <div className="flex gap-3 mb-6">

          <button
            onClick={() => setView("active")}
            className={`px-4 py-2 rounded-lg ${
              view === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setView("used")}
            className={`px-4 py-2 rounded-lg ${
              view === "used" ? "bg-gray-500 text-white" : "bg-gray-200"
            }`}
          >
            Used
          </button>

          <button
            onClick={() => setView("cancelled")}
            className={`px-4 py-2 rounded-lg ${
              view === "cancelled" ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            Cancelled
          </button>

        </div>

        {/* 🔥 BOOKINGS LIST */}
        {filteredBookings.length === 0 ? (
          <p className="text-gray-600">
            No {view} bookings available.
          </p>
        ) : (
          <div className="grid gap-5">

            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">
  {b.tour?.name}
</h3>

                  <p className="text-gray-500">
  📍 {b.tour?.location}
</p>

<p className="text-gray-600">
  ₹{b.tour?.price}
</p>

                  <p className="text-sm">
                    People: {b.number_of_people}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(b.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => handleViewTicket(b)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Ticket
                  </button>

                  {!b.is_used && !b.is_cancelled && (
                    <button
                      onClick={() => handleViewTicket(handleMarkUsed(b.id))}
                      className="bg-gray-700 text-white px-3 py-1 rounded"
                    >
                      Mark Used
                    </button>
                  )}

                  {!b.is_cancelled && (
                    <button
                      onClick={() => handleViewTicket(handleCancel(b.id))}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  )}

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;