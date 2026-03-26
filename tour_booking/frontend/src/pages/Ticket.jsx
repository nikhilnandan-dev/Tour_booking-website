import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { motion } from "framer-motion";

function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef();

  const booking = location.state?.booking;

  const downloadTicket = async () => {
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2, // 🔥 better quality
    });

    const link = document.createElement("a");
    link.download = `ticket-${booking.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!booking) {
    return (
      <div className="p-6">
        <p>No ticket data found</p>
        <button onClick={() => {
  const isAdmin = localStorage.getItem("is_staff") === "true";

  if (isAdmin) {
    navigate("/admin-scan"); // or admin-dashboard
  } else {
    navigate("/tours");
  }
}}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      {/* 🔥 ANIMATED CARD */}
      <motion.div
        ref={ticketRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >

        {/* TITLE */}
        <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-600">
          TOURPASS
        </h2>

        <div className="border-b mb-4"></div>

        {/* TOUR INFO */}
        <div className="mb-4">
          <p className="text-lg font-semibold">
            {booking.tour?.name}
          </p>
          <p className="text-gray-500">
            ₹{booking.tour?.price}
          </p>
        </div>

        {/* DETAILS */}
        <div className="text-sm text-gray-600 space-y-1 mb-6">

          <p>
            <span className="font-semibold">Booking ID:</span> {booking.id}
          </p>

          <p>
            <span className="font-semibold">People:</span> {booking.number_of_people}
          </p>

          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(booking.created_at).toLocaleString()}
          </p>

        </div>

        {/* 🔥 STATUS */}
        {booking.is_cancelled ? (
          <p className="text-red-500 text-center font-semibold mb-4">
            ❌ Cancelled Ticket
          </p>
        ) : booking.is_used ? (
          <p className="text-gray-500 text-center font-semibold mb-4">
            ⚠️ Already Used
          </p>
        ) : (
          <p className="text-green-500 text-center font-semibold mb-4">
            ✅ Valid Ticket
          </p>
        )}

        {/* QR CODE */}
        <div className="flex justify-center mb-6 p-3 bg-gray-50 rounded-xl">
          <QRCodeSVG
            value={`http://127.0.0.1:8000/api/bookings/verify/${booking.id}/`}
            size={180}
          />
        </div>

        {/* DOWNLOAD */}
        <button
          onClick={downloadTicket}
          className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 transition active:scale-95"
        >
          Download Ticket
        </button>

        {/* FOOTER */}
        <p className="text-center text-gray-400 text-xs mt-3">
          Show this QR at entry point
        </p>

        {/* BACK BUTTON */}
        <div className="flex gap-3 mt-6">

  <button
    onClick={() => navigate("/bookings")}
    className="w-full bg-gray-300 py-2 rounded"
  >
    My Bookings
  </button>

  <button
    onClick={() => navigate("/tours")}
    className="w-full bg-blue-500 text-white py-2 rounded"
  >
    Explore Tours
  </button>

</div>  

      </motion.div>

    </div>
  );
}

export default Ticket;