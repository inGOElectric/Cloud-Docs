import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

interface BikeColor {
  name: string;
  image: string;
  hex: string;
}

interface Bike {
  id: number;
  name: string;
  tagline: string;
  price: string;
  colors: BikeColor[];
}

/* ================= BIKE CARD ================= */

function BikeCard({ bike }: { bike: Bike }) {
  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] = useState<BikeColor>(
    bike.colors[0]
  );

  return (
    <div className="relative h-[520px] rounded-2xl overflow-hidden group shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

      {/* IMAGE LAYER */}
      <div className="absolute inset-0 flex items-center justify-center z-0 bg-[#0b0f14]">
        <img
          key={selectedColor.image}
          src={selectedColor.image}
          alt={bike.name}
          onError={(e) => {
            console.log("FAILED:", selectedColor.image);
            (e.target as HTMLImageElement).src = bike.colors[0].image;
          }}
          className="max-h-[90%] w-auto object-contain transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10 pointer-events-none" />

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col justify-between h-full p-8 text-white">

        {/* TOP */}
        <div>
          <h2 className="text-3xl font-semibold">{bike.name}</h2>

          <p className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mt-2">
            {bike.tagline}
          </p>
        </div>

        {/* BOTTOM */}
        <div>
          <p className="text-lg text-gray-300">Prices starting at</p>

          <p className="text-2xl font-semibold mt-1">{bike.price}</p>

          {/* COLORS */}
          <div className="flex gap-3 mt-4">
            {bike.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-7 h-7 rounded-full border-2 transition ${
                  selectedColor.name === color.name
                    ? "border-white scale-110"
                    : "border-gray-400"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          {/* BUTTON */}
          <div className="mt-6">
            <button
              onClick={() => navigate(`/bike/${bike.id}`)}
              className="px-5 py-2 bg-black/60 border border-white/40 rounded-full text-sm font-medium hover:bg-black transition"
            >
              Explore
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= MAIN SECTION ================= */

export default function ServicesSection() {
  const navigate = useNavigate();

  const bikes: Bike[] = [
    {
      id: 1,
      name: "Flee",
      tagline: "Low-Speed ",
      price: "₹55,000 onwards",
      colors: [
        {
          name: "Default",
          image: "/bikes/flee-low-speed/default.png",
          hex: "#444444",
        },
        {
          name: "Cyan",
          image: "/bikes/flee-low-speed/cyan.png",
          hex: "#06B6D4",
        },
        {
          name: "Yellow",
          image: "/bikes/flee-low-speed/yellow.png",
          hex: "#FACC15",
        },
        {
          name: "Orange",
          image: "/bikes/flee-low-speed/orange.png",
          hex: "#F97316",
        },
      ],
    },

    {
      id: 2,
      name: "Flee ",
      tagline: "High-Speed ",
      price: "₹65,000 onwards",
      colors: [
        {
          name: "Default",
          image: "/bikes/flee-high-speed/default.png",
          hex: "#444444",
        },
         {
          name: "Cyan",
          image: "/bikes/flee-low-speed/cyan.png",
          hex: "#06B6D4",
        },
        {
          name: "Yellow",
          image: "/bikes/flee-low-speed/yellow.png",
          hex: "#FACC15",
        },
        {
          name: "Orange",
          image: "/bikes/flee-low-speed/orange.png",
          hex: "#F97316",
        },
      ],
    },
  ];

  return (
    <section className="bg-[#05101a] py-24 px-6">

      {/* HEADING */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold text-white">
          Our Electric Bikes
        </h2>

        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          Discover the next generation of urban mobility designed for
          performance and everyday convenience.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {bikes.map((bike) => (
          <BikeCard key={bike.id} bike={bike} />
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-16">
        <button
          onClick={() => navigate("/test-ride")}
          className="px-10 py-4 text-lg font-semibold border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition duration-300"
        >
          Book Test Ride
        </button>
      </div>

    </section>
  );
}