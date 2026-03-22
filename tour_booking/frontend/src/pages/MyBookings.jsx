import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // 🔒 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      fetchBookings();
    }
  }, []);

  // 🔥 Fetch bookings
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

  // ❌ Delete booking
  const deleteBooking = async (id) => {
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

      fetchBookings(); // refresh after delete

    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-4xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">
                {b.tour?.name}
              </h3>

              <p className="text-gray-600">
                ₹{b.tour?.price}
              </p>

              <p className="text-sm text-gray-500">
                People: {b.number_of_people}
              </p>

              <button
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Cancel this booking?"
                  );
                  if (confirmDelete) {
                    deleteBooking(b.id);
                  }
                }}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}

export default MyBookings;  