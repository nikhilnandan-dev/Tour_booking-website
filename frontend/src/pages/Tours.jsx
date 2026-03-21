import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const Tours = () => {

  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [tours, setTours] = useState([]);

  // ✅ FIXED: inside component
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
  }
}, []);
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/tours/")
      .then(res => {
        console.log(res.data);
        setTours(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const bookTour = async (tourId) => {
    try {
      setLoadingId(tourId);

      const token = localStorage.getItem("token");

      const res = await axios.post(
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

     setMessage("Booking successful!");
setTimeout(() => {
  navigate("/bookings");
}, 500);
    } catch (err) {
      console.log(err);
      setMessage("Booking failed. Try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    
      <div style={{ padding: "20px" }}>
      <h2>Available Tours</h2>
      {message && (
  <p style={{
    color: message.includes("failed") ? "red" : "green",
    marginBottom: "10px"
  }}>
    {message}
  </p>
  
)}
      {tours.map((tour) => (
        <div key={tour.id} style={{
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
}}>
          <h3>{tour.name}</h3>
          <p>Price: ₹{tour.price}</p>

          <button
             onClick={() => bookTour(tour.id)}
  disabled={loadingId === tour.id}
  style={{
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }}
          >
            {loadingId === tour.id ? "Booking..." : "Book Now"}
          </button>
        </div>
      ))}
    </div>
  
  );
};

export default Tours;