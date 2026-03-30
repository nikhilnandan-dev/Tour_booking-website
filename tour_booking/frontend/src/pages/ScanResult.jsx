import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

function ScanResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state || {};

  // 🔊 beep sound
  useEffect(() => {
    const audio = new Audio("/beep.wav");
    audio.play().catch(() => {});
  }, []);

  // ❌ no data case
  if (!data.valid && !data.reason) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No scan data</p>
      </div>
    );
  }

  console.log("SCAN RESULT DATA:", data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`p-8 rounded-2xl shadow-xl text-center w-80 ${
          data.valid ? "bg-green-100" : "bg-red-100"
        }`}
      >

        {/* STATUS */}
        <h2 className="text-2xl font-bold mb-4">
          {data.valid ? "✅ Valid Ticket" : "❌ Invalid Ticket"}
        </h2>

        {/* DETAILS */}
        {data.valid ? (
          <div className="text-gray-700 space-y-1">

            <p>
              <strong>Tour:</strong> {data.tour}
            </p>

            <p>
              <strong>User:</strong> {data.user}
            </p>

            <p>
              <strong>People:</strong> {data.people}
            </p>

            {/* 🔥 SAFE OPTIONAL FIELDS */}
            {data.location && (
              <p>
                <strong>Location:</strong> {data.location}
              </p>
            )}

            {data.price && (
              <p>
                <strong>Price:</strong> ₹{data.price}
              </p>
            )}

          </div>
        ) : (
          <p className="text-red-600 font-semibold">
            {data.reason}
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition active:scale-95"
        >
          Back to Dashboard
        </button>

      </motion.div>

    </div>
  );
}

export default ScanResult;