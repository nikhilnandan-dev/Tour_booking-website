import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Tours() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/tours/");
        setTours(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTours();
  }, []);

  const bookTour = async (tourId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    console.log("TOKEN:", token);

    await axios.post(
      "http://127.0.0.1:8000/api/bookings/create/",
      {
        tour: tourId,
        number_of_people: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Booking successful");

  } catch (err) {
    console.log("ERROR:", err.response?.data || err);
    alert("Booking failed");
  }
};

  return (
    <div className="bg-gray-100 min-h-screen">
      

      <div className="max-w-6xl mx-auto p-6">

        <h2 className="text-3xl font-bold mb-6">
          Available Tours
        </h2>

        {/* 🔥 GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-5"
            >
              <h3 className="text-lg font-bold mb-1">
                {tour.name}
              </h3>

              <p className="text-gray-600 mb-2">
                {tour.location || "Unknown location"}
              </p>

              <p className="text-blue-600 font-semibold mb-4">
                ₹{tour.price}
              </p>

              <button
                onClick={() => bookTour(tour.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
              >
                Book Now
              </button>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Tours;