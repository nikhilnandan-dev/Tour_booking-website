import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState("active");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      fetchBookings();
    }
  }, []);

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

  // 🔥 FILTER + SORT (LATEST FIRST)
  const filteredBookings = bookings
    .filter((b) =>
      view === "active" ? !b.is_cancelled : b.is_cancelled
    )
    .sort((a, b) => {
  const dateA = new Date(a.created_at).getTime();
  const dateB = new Date(b.created_at).getTime();
  return dateB - dateA;
});
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

        {/* 🔥 TAB SWITCH */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setView("active")}
            className={`px-4 py-2 rounded ${
              view === "active"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setView("cancelled")}
            className={`px-4 py-2 rounded ${
              view === "cancelled"
                ? "bg-red-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* 🔥 BOOKINGS LIST */}
        {filteredBookings.length === 0 ? (
          <p className="text-gray-600">
            No {view} bookings
          </p>
        ) : (
          <div className="grid gap-5">

            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold mb-1">
                  {b.tour?.name}
                </h3>

                <p className="text-gray-600">
                  ₹{b.tour?.price}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  People: {b.number_of_people}
                </p>

                {/* 🔥 ACTIONS */}
                <div className="flex gap-3">

                  {b.is_cancelled ? (
                    <span className="text-red-500 font-semibold">
                      Cancelled
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          navigate("/ticket", { state: { booking: b } })
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        View Ticket
                      </button>

                      <button
                        onClick={async () => {
                          const confirmDelete = window.confirm("Cancel this booking?");
                          if (!confirmDelete) return;

                          try {
                            const token = localStorage.getItem("token");

                            await axios.delete(
                              `http://127.0.0.1:8000/api/bookings/delete/${b.id}/`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );

                            fetchBookings();

                          } catch (err) {
                            console.log(err.response?.data || err);
                            alert("Cancel failed");
                          }
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    </>
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