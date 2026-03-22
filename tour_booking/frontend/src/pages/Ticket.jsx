import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

function Ticket() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <p>No ticket data</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white p-6 rounded-xl shadow w-96 text-center">

        <h2 className="text-xl font-bold mb-4">Your Ticket</h2>

        <p className="font-semibold">{booking.tour.name}</p>
        <p className="text-gray-600">₹{booking.tour.price}</p>

        <div className="mt-4">
          <p><strong>Booking ID:</strong> {booking.id}</p>
          <p><strong>People:</strong> {booking.number_of_people}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <QRCodeCanvas value={`${booking.id}`} size={150} />
        </div>

      </div>

    </div>
  );
}

export default Ticket;