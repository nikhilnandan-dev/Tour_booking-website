import { useState } from "react";
import axios from "axios";

function Scan() {
  const [bookingId, setBookingId] = useState("");
  const [result, setResult] = useState(null);

  const verifyBooking = async () => {
    if (!bookingId) return;

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/bookings/verify/${bookingId}/`
      );

      setResult(res.data);
    } catch {
      setResult({ valid: false });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">

      <h2 className="text-xl font-bold mb-4">Verify Ticket</h2>

      <input
        type="text"
        placeholder="Enter Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
        className="border p-2 rounded w-64 text-center"
      />

      <button
        onClick={verifyBooking}
        className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
      >
        Verify
      </button>

      {result && (
  <div className="mt-6 text-center">
    {result.valid ? (
      <div className="text-green-600">
        <h3 className="font-bold">Valid Ticket</h3>
        <p>{result.tour}</p>
        <p>{result.user}</p>
      </div>
    ) : (
      <div className="text-red-600">
        <h3 className="font-bold">Invalid Ticket</h3>
        <p>{result.reason}</p>
      </div>
    )}
  </div>
)}

    </div>
  );
}

export default Scan;