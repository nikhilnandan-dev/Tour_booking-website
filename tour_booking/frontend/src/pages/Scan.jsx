import { useState } from "react";
import axios from "axios";
import QrReader from "react-qr-reader";

function Scan() {
  const [result, setResult] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      const bookingId = data.replace("BOOKING_ID:", "");

      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/bookings/verify/${bookingId}/`
        );

        setResult(res.data);

      } catch (err) {
        setResult({ valid: false });
      }
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Scan Ticket</h2>

      <QrReader
        delay={300}
        onScan={handleScan}
        onError={(err) => console.log(err)}
        style={{ width: "300px" }}
      />

      {result && (
        <div style={{ marginTop: "20px" }}>
          {result.valid ? (
            <div style={{ color: "green" }}>
              <h3>Valid Ticket</h3>
              <p>{result.tour}</p>
              <p>{result.user}</p>
            </div>
          ) : (
            <h3 style={{ color: "red" }}>Invalid Ticket</h3>
          )}
        </div>
      )}
    </div>
  );
}

export default Scan;