import { useEffect } from "react";

export default function FleehighspeedDetails() {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-[#01263B] text-white">

      {/* HERO SECTION */}
      <section className="text-center py-24 px-6">

        <h1 className="text-4xl md:text-6xl font-bold animate-fadeUp">
          Flee High Speed
        </h1>

        <p className="mt-4 text-2xl md:text-3xl text-gray-200 animate-fadeUp">
          Smart Everyday Ride
        </p>

        <div className="flex justify-center mt-12">
          <img
            src="/bikes/flee-high-speed/default.png"
            alt="Flee High Speed"
            onError={(e) => {
              e.currentTarget.src = "/fallback.png";
            }}
            className="w-full max-w-[180px] md:max-w-[280px] object-contain animate-bikeFade"
          />
        </div>

      </section>


      {/* PERFORMANCE SPECS */}
      <section className="pb-24">

        <div className="flex flex-wrap justify-center gap-12 md:gap-20 text-center">

          <div className="animate-fadeUp">
            <p className="text-3xl font-bold">120–140 km</p>
            <p className="text-gray-400 mt-1 text-sm uppercase">Range</p>
          </div>

          <div className="animate-fadeUp">
            <p className="text-3xl font-bold">70–80 km/h</p>
            <p className="text-gray-400 mt-1 text-sm uppercase">Top Speed</p>
          </div>

          <div className="animate-fadeUp">
            <p className="text-3xl font-bold">5–7 sec</p>
            <p className="text-gray-400 mt-1 text-sm uppercase">0–40 km/h</p>
          </div>

        </div>

      </section>


      {/* TECHNOLOGY SECTION */}
<section className="py-24 px-6">

  <div className="max-w-6xl mx-auto">

    <h2 className="text-3xl md:text-4xl font-semibold mb-14 text-center">
      Technologies Used in Flee High Speed
    </h2>

    <div className="grid md:grid-cols-2 gap-8">

      {[
        ["motor.png","High-Power BLDC Hub Motor","High-speed brushless motor designed for strong acceleration and smooth performance."],

        ["battery.png","Advanced Lithium-Ion Battery","High-capacity battery pack optimized for extended range and fast charging."],

        ["BMS.png","Smart Battery Management System","Monitors temperature, voltage, and current for safety and long battery life."],

        ["electronic unit.png","Intelligent Motor Controller","Optimizes torque delivery and ensures efficient power usage."],

        ["Regenerative Braking Technology.png","Regenerative Braking System","Recovers braking energy to improve efficiency and range."],

        ["dashboard.png","Smart Digital Display","Displays speed, battery status, trip data, and alerts in real-time."],

        ["iot.png","IoT & Telematics Integration","Enables GPS tracking, remote diagnostics, and anti-theft alerts."],

        ["chassis.png","Reinforced Lightweight Chassis","Durable and aerodynamic frame for stability at higher speeds."]
      ].map(([img, title, desc], i) => (

        <div
          key={i}
          className="relative rounded-3xl overflow-hidden group min-h-[320px] md:min-h-[360px] shadow-xl"
        >

          {/* IMAGE */}
          <img
            src={`/features/${img}`}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = "/fallback.png";
            }}
            className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          {/* CONTENT */}
          <div className="relative p-6 flex flex-col justify-end h-full ">

            <h3 className="text-3xl md:text-2xl font-bold mb-3 leading-tight">
              {title}
            </h3>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              {desc}
            </p>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>

      {/* SAFETY SECTION */}
      <section className="py-24 px-6 bg-[#0c3a55]">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl md:text-4xl font-semibold mb-14 text-center">
            Safety Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              ["LED.png","LED Lighting","Improves visibility during night riding."],
              ["RBS.png","Reliable Braking System","Ensures safe and responsive stopping."],
              ["dashboard.png","Speed Modes","Multiple riding modes for better control."],
              ["chassis.png","Strong Frame","Enhanced durability and rider stability."],
              ["Anti-Slip Footboard.png","Anti-Slip Footboard","Prevents slipping during rides."],
              ["Horn Bell Alert System.png","Alert System","Warns nearby vehicles and pedestrians."]
            ].map(([img, title, desc], i) => (

              <div
                key={i}
                className="bg-[#01263B] rounded-2xl p-5 shadow-lg hover:scale-105 transition duration-300"
              >

                <img
                  src={`/features/${img}`}
                  alt={title}
                  onError={(e) => {
                    e.currentTarget.src = "/fallback.png";
                  }}
                  className="rounded-xl mb-4 w-full h-[180px] object-cover"
                />

                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-300 text-sm">{desc}</p>

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
}