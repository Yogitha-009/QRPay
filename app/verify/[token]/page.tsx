"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
const Frontend_url=process.env.NEXT_PUBLIC_FRONTEND_URL

export default function VerifyPage() {
  const params = useParams();
  const token = typeof params?.token === "string" ? params.token : "";

  const [message, setMessage] = useState("Checking QR...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyQR() {
      try {
        if (!token) {
          setMessage("Invalid QR token");
          setLoading(false);
          return;
        }

        const response = await fetch(`${Frontend_url}/returnqr/${token}`);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setMessage(data.mssg || "Invalid QR");
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    verifyQR();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        {loading ? (
          <h1 className="text-xl font-semibold">Checking QR...</h1>
        ) : (
          <h1 className="text-2xl font-bold">{message}</h1>
        )}
      </div>
    </div>
  );
}