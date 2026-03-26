import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminScan() {
  const [bookingId, setBookingId] = useState("");

  // ✅ FIXED: proper hook placement
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("scan_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleScan = async () => {
    if (!bookingId) return;

    setLoading(true); // 🔥 start loading

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/bookings/verify/${bookingId}/`
      );

      // 🔥 Save history
      setHistory((prev) => {
        const updated = [
          { id: bookingId, status: "valid" },
          ...prev,
        ].slice(0, 10);

        localStorage.setItem("scan_history", JSON.stringify(updated));
        return updated;
      });

      navigate("/scan-result", {
        state: {
          valid: true,
          tour: res.data.tour,
          user: res.data.user,
          people: res.data.people,
        },
      });

    } catch (err) {
      const errorData = err.response?.data;

      setHistory((prev) => {
        const updated = [
          {
            id: bookingId,
            status: errorData?.reason || "invalid",
          },
          ...prev,
        ].slice(0, 10);

        localStorage.setItem("scan_history", JSON.stringify(updated));
        return updated;
      });

      navigate("/scan-result", {
        state: {
          valid: false,
          reason: errorData?.reason || "Invalid Ticket",
        },
      });
    }

    setLoading(false); // 🔥 stop loading
    setBookingId("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      <h2 className="text-2xl font-bold mb-6">
        Admin Ticket Scanner
      </h2>

      {/* INPUT */}
      <input
        type="text"
        placeholder="Enter Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
        className="border p-2 rounded w-64 text-center"
      />

      <button
        onClick={handleScan}
        className="bg-blue-600 text-white px-4 py-2 mt-3 rounded hover:bg-blue-700 transition active:scale-95"
      >
        Scan Ticket
      </button>

      {/* 🔥 LOADING */}
      {loading && (
        <p className="mt-3 text-gray-600 animate-pulse">
          Verifying ticket...
        </p>
      )}

      {/* HISTORY */}
      <div className="mt-8 w-full max-w-md">
        <h3 className="font-semibold mb-2">
          Scan History
        </h3>

        {history.length === 0 ? (
          <p className="text-gray-500">No scans yet</p>
        ) : (
          <div className="space-y-2">
            {history.map((h, index) => (
              <div
                key={index}
                className="bg-white p-2 rounded shadow flex justify-between"
              >
                <span>ID: {h.id}</span>

                <span
                  className={
                    h.status === "valid"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {h.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminScan;