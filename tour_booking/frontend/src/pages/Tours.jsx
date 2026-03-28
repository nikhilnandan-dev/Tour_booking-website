import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);

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

    setLoading(true); // 🔥 start loading

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
  } finally {
    setLoading(false); // 🔥 stop loading
  }
};

  return (
    <div className="min-h-screen bg-gray-100">


      <div className="max-w-6xl mx-auto p-6">

        {/* HEADER */}
        <h2 className="text-3xl font-bold mb-6 text-center">
          Explore Tours ✈️
        </h2>

        {/* EMPTY STATE */}
        {tours.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No tours available right now 😔
          </p>
        ) : (

          /* 🔥 SORT + LIMIT + MAP */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {[...tours]
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 6)
              .map((tour) => (

                <div
                  key={tour.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition duration-300"
                >

                  {/* IMAGE SECTION */}
                  <div className="relative">

                    <img
                      src={tour.image || "https://via.placeholder.com/400x300"}
                      alt={tour.name}
                      className="w-full h-48 object-cover"
                    />

                    {/* GRADIENT OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* TEXT ON IMAGE */}
                    <div className="absolute bottom-2 left-3 text-white">
                      <h3 className="text-lg font-bold">
                        {tour.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        ₹{tour.price}
                      </p>
                    </div>

                    {/* TOP RATED BADGE */}
                    {tour.rating >= 4.7 && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold shadow">
                        Top Rated
                      </div>
                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    <div className="flex justify-between items-center mb-2">

                      <span className="text-sm text-gray-500">
                        📍 {tour.location || "Unknown"}
                      </span>

                      <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        {"★".repeat(Math.floor(tour.rating || 4))}
                        {"☆".repeat(5 - Math.floor(tour.rating || 4))}
                        <span className="text-gray-600 ml-1">
                          ({tour.rating || 4.5})
                        </span>
                      </div>

                    </div>

                    <button
  onClick={() => bookTour(tour.id)}
  disabled={loading}
  className={`w-full py-2 rounded-lg transition active:scale-95 ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
>
  {loading ? "Booking..." : "Book Now"}
</button>

                  </div>

                </div>

              ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Tours;