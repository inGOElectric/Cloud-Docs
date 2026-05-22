import { useState } from "react";

export default function LocationRoute() {
  const [customerAddress, setCustomerAddress] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");

  // ✅ Company showroom addresses
  const companyAddresses: Record<string, string> = {
    Bangalore:
      "3/2, Magrath Road, Richmond Town, Bengaluru – 560025",
    Goa: "Panjim, Goa, India",
  };

  const handleOpenRoute = () => {
    if (!customerAddress) {
      alert("Please enter your current address.");
      return;
    }

    if (!companyLocation) {
      alert("Please select a showroom location.");
      return;
    }

    const destination = companyAddresses[companyLocation];

    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      customerAddress
    )}&destination=${encodeURIComponent(destination)}`;

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center p-6">
      <div className="w-full max-w-xl">

        <h2 className="text-xl mb-6 text-center">
          Route Navigation
        </h2>

        {/* CUSTOMER ADDRESS */}
        <input
          placeholder="Enter Your Current Address"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          className="w-full p-3 mb-6 bg-gray-200 text-black rounded-lg"
        />

        {/* SHOWROOM SELECT */}
        <select
          value={companyLocation}
          onChange={(e) => setCompanyLocation(e.target.value)}
          className="w-full p-3 mb-6 bg-gray-200 text-black rounded-lg"
        >
          <option value="">Select Test Ride Pickup Location</option>
          <option value="Bangalore">Bangalore Showroom</option>
          <option value="Goa">Goa Showroom</option>
        </select>

        {/* OPEN MAP */}
        <button
          onClick={handleOpenRoute}
          className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-lg transition"
        >
          Open in Google Maps
        </button>

      </div>
    </div>
  );
}