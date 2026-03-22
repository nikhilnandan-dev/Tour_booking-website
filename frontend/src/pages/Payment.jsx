import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const tour = location.state?.tour;

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("UPI");
  const [user, setUser] = useState(null);

  // ✅ FETCH REAL USER FROM BACKEND
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://127.0.0.1:8000/api/users/me/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  const generatePDF = async (bookingId) => {
    const doc = new jsPDF();

    const date = new Date().toLocaleString();

   const qrData = `BOOKING_ID:${bookingId}`;
    const qrImage = await QRCode.toDataURL(qrData);

    // Header
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("TOUR TICKET", 15, 20);

    doc.setTextColor(0, 0, 0);

    // Container
    doc.setDrawColor(180);
    doc.roundedRect(10, 40, 190, 110, 6, 6);

    // Title
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Booking Details", 20, 55);

    // Content
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");

    let y = 70;
    const gap = 10;

    const drawRow = (label, value) => {
  doc.setFont(undefined, "bold");
  doc.text(label, 20, y);

  doc.setFont(undefined, "normal");
  doc.text(String(value || "N/A"), 75, y);

  y += gap;
};
    drawRow("Booking ID:", bookingId);
    drawRow("Name:", user?.username);
    drawRow("Email:", user?.email);
    drawRow("Tour:", tour.name);
    drawRow("Price:", `₹${tour.price}`);
    drawRow("Payment:", method);
    drawRow("Date:", date);

    // Divider
    doc.setDrawColor(200);
    doc.line(130, 50, 130, 140);

    // QR
    doc.setFont(undefined, "bold");
    doc.text("Scan QR", 150, 60);

    doc.addImage(qrImage, "PNG", 140, 70, 50, 50);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Valid for entry. Carry this ticket.", 20, 155);

    doc.save(`Ticket_${bookingId}.pdf`);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://127.0.0.1:8000/api/bookings/create/",
        {
          tour: tour.id,
          number_of_people: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bookingId = res.data.booking_id;

      await generatePDF(bookingId);

      alert(`Payment Successful!\nBooking ID: ${bookingId}`);

      navigate("/bookings");

    } catch (err) {
      console.log(err.response?.data || err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No tour selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">

        <h2 className="text-xl font-bold mb-4 text-center">
          Complete Payment
        </h2>

        <div className="mb-4">
          <p className="font-semibold">{tour.name}</p>
          <p className="text-gray-600">₹{tour.price}</p>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-2">Select Payment Method</p>

          <div className="flex flex-col gap-2">

            <label className="border p-2 rounded cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={method === "UPI"}
                onChange={(e) => setMethod(e.target.value)}
              />
              UPI
            </label>

            <label className="border p-2 rounded cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="Card"
                checked={method === "Card"}
                onChange={(e) => setMethod(e.target.value)}
              />
              Card
            </label>

          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full font-semibold"
        >
          {loading ? "Processing..." : `Pay ₹${tour.price}`}
        </button>

      </div>
    </div>
  );
}

export default Payment;