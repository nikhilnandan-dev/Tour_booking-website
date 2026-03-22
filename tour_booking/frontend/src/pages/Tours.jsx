import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const Tours = () => {

  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [tours, setTours] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");

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
      
     <div style={{
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px"
  }}>
      <h2 style={{ marginBottom: "15px" }}>Explore Tours</h2>
      
      <div style={{
  display: "flex",
  gap: "10px",
  marginBottom: "20px"
}}> 
  <input
    type="text"
    placeholder="Search tours..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    }}
  />

  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    style={{
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    }}
  >
    <option value="">Sort</option>
    <option value="low">Low → High</option>
    <option value="high">High → Low</option>
  </select>
</div><div style={{
  display: "flex",
  gap: "10px",
  marginBottom: "20px"
}}>
  
</div>
      {message && (
  <p style={{
    color: message.includes("failed") ? "red" : "green",
    marginBottom: "10px"
  }}>
    {message}
  </p>
  
)}
      {(() => {
  let filtered = tours.filter((tour) =>
    tour.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sortOrder === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered.length === 0 ? (
    <p>No tours found</p>
  ) : (
    filtered.map((tour) => (
      <div
        key={tour.id}
        style={{
  backgroundColor: "#fff",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  transition: "0.2s"
}}
      >
        <h3>{tour.name}</h3>
        <p>Price: ₹{tour.price}</p>

        <button
          onClick={() =>
  navigate("/payment", { state: { tour } })
}
          disabled={loadingId === tour.id}
          style={{
  marginTop: "10px",
  padding: "10px 14px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
}}
        >
          {loadingId === tour.id ? "Booking..." : "Book Now"}
        </button>
      </div>
    ))
  );
})()}
    </div>
  
  );
};

export default Tours;