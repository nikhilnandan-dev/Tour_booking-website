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

    <div className="min-h-screen bg-gray-100 p-6">
    <div className="bg-gray-100 min-h-screen">
      
    
      <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
  Explore Tours ✈️
</h2>
        <h2 className="text-3xl font-bold mb-6">
          Available Tours
        </h2>

        {/* 🔥 GRID */}
        {tours.length === 0 ? (
  <p className="text-center text-gray-500 col-span-3">
    No tours available
  </p>
) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {tours.map((tour) => (
            <div
  key={tour.id}
  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300"
>

  {/* 🔥 IMAGE SECTION */}
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

    {/* 🔥 BADGE */}
    <div className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded font-semibold">
      Popular
    </div>

  </div>

  {/* 🔥 CONTENT SECTION */}
  <div className="p-4">

    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-500">
        📍 India
      </span>

      <span className="text-sm text-yellow-500 font-semibold">
        ⭐ 4.5
      </span>
    </div>

    <button
      onClick={() => bookTour(tour.id)}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition active:scale-95"
    >
      Book Now
    </button>

  </div>

</div>
          ))}

        </div>
)}
      </div>
    </div>
    </div>
  );
}

export default Tours;