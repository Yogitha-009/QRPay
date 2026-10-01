"use client";

import { useState } from "react";
import QRCode from "qrcode";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [purpose, setPurpose] = useState("");
  const [token, setToken] = useState("");
  const [qr, setQr] = useState("");

  function handleOnClick() {
    fetch(`${API_URL}/getdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        purpose: purpose,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log("Success:", data);

        // Save token in state
        setToken(data.token);

        // IMPORTANT:
        // Use data.token directly instead of token state,
        // because setToken() updates asynchronously.
        const url = `${FRONTEND_URL}/verify/${data.token}`;

        console.log("QR URL:", url);

        // Generate QR code
        const qrImage = await QRCode.toDataURL(url);

        setQr(qrImage);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Generate Bill QR Code
        </h1>

        <div className="space-y-4 mb-6">
          <input
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
            id="amnt"
            type="number"
            name="amount"
            placeholder="Enter Amount"
            min={0}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
          />

          <input
            onChange={(e) => {
              setPurpose(e.target.value);
            }}
            id="purpose"
            type="text"
            name="purpose"
            placeholder="Enter Purpose"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"
          />
        </div>

        <button
          onClick={handleOnClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
        >
          Generate QR Code
        </button>

        {qr && (
          <div className="mt-6 flex flex-col items-center">
            <img src={qr} alt="QR Code" />

            <p className="mt-4 text-sm text-gray-600 break-all text-center">
              Token: {token}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
