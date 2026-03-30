import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

function AdminScan() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("scan_history");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  const scannedRef = useRef(false);

  useEffect(() => {
    let html5QrCode;
    let isMounted = true;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("reader");

        const devices = await Html5Qrcode.getCameras();

        if (devices && devices.length && isMounted) {
          const cameraId = devices[0].id;

          await html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: 250 },
            async (decodedText) => {
              // 🔴 prevent multiple scans
              if (scannedRef.current) return;
              scannedRef.current = true;

              try {
                const token = decodedText.split("/").filter(Boolean).pop();

                // 🔥 safe stop
                try {
                  if (html5QrCode.getState && html5QrCode.getState() === 2) {
                    await html5QrCode.stop();
                  }
                } catch (e) {
                  console.log("Stop skipped");
                }

                const res = await axios.get(
                  `http://127.0.0.1:8000/api/bookings/verify/${token}/`
                );

                // 🔥 history
                setHistory((prev) => {
                  const updated = [
                    {
                      id: token,
                      status: res.data.valid ? "valid" : res.data.reason,
                    },
                    ...prev,
                  ].slice(0, 10);

                  localStorage.setItem("scan_history", JSON.stringify(updated));
                  return updated;
                });

                navigate("/scan-result", {
                  state: res.data,
                });

              } catch (err) {
                const errorData = err.response?.data;

                navigate("/scan-result", {
                  state: {
                    valid: false,
                    reason: errorData?.reason || "Invalid QR Code",
                  },
                });
              }
            }
          );
        }
      } catch (err) {
        console.log("Scanner error:", err);
      }
    };

    startScanner();

    return () => {
      isMounted = false;

      if (html5QrCode) {
        try {
          if (html5QrCode.getState && html5QrCode.getState() === 2) {
            html5QrCode.stop();
          }
        } catch (e) {
          console.log("Cleanup stop skipped");
        }
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      <h2 className="text-2xl font-bold mb-6">
        Scan Ticket
      </h2>

      <p className="text-gray-500 mb-4 text-sm">
        Point the camera at the QR code
      </p>

      {/* CAMERA */}
      <div className="flex flex-col items-center mb-6">
        <div id="reader" className="w-80"></div>
      </div>

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