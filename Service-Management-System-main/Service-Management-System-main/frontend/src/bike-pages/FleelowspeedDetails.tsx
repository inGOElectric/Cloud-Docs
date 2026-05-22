import { useEffect, useRef, useState } from "react";

/* =========================
   Progress Circle Component
========================= */

type ProgressCircleProps = {
  percent: number;
  animate?: boolean;
};

function ProgressCircle({ percent, animate = false }: ProgressCircleProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setProgress(percent), 120);
      return () => clearTimeout(t);
    } else {
      setProgress(percent);
    }
  }, [percent, animate]);

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute w-24 h-24 -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="#374151"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="#facc15"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-[1400ms]"
        />
      </svg>

      <span className="text-white font-semibold text-lg">{progress}%</span>
    </div>
  );
}

/* =========================
   Main Component
========================= */

export default function FleeC2Details() {

  const slides = [
  {
    image: "/bikes/flee-low-speed/default.png",
    title: "Flee Low-Speed",
    subtitle: "Designed for modern city commuting",
    titleColor: "text-white",
    subtitleColor: "text-gray-300",
  },
  {
    image: "/bikes/flee-low-speed/cyan.png",
    title: "Cyan Edition",
    subtitle: "A futuristic tone for smart urban mobility",
    titleColor: "text-cyan-300",
    subtitleColor: "text-cyan-200",
  },
  {
    image: "/bikes/flee-low-speed/orange.png",
    title: "Orange Edition",
    subtitle: "Bold energy for dynamic city rides",
    titleColor: "text-orange-300",
    subtitleColor: "text-orange-200",
  },
  {
    image: "/bikes/flee-low-speed/yellow.png",
    title: "Yellow Edition",
    subtitle: "Bright styling that stands out in the city",
    titleColor: "text-yellow-300",
    subtitleColor: "text-yellow-200",
  }
];

  const [index, setIndex] = useState(0);
  const valueSectionRef = useRef<HTMLDivElement | null>(null);
  const [animateProgress, setAnimateProgress] = useState(false);

  /* Scroll to top */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* Auto slider */
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  /* Trigger circle animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateProgress(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (valueSectionRef.current) {
      observer.observe(valueSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#01263B] text-white flex flex-col items-center px-6 w-full min-h-screen">

      {/* HERO */}
      <div className="mt-20 text-center">

        {index === 0 && (
          <p className="text-3xl tracking-[0.35em] uppercase mb-4 text-gray-300">
            Introducing
          </p>
        )}

        <h1 className={`text-5xl md:text-6xl font-bold ${slides[index].titleColor}`}>
          {slides[index].title}
        </h1>

        <p className={`text-lg mt-4 ${slides[index].subtitleColor}`}>
          {slides[index].subtitle}
        </p>

      </div>


      {/* BIKE IMAGE */}
      <div className="mt-12 flex items-center justify-center gap-8">

        <button
          onClick={prevSlide}
          className="text-4xl bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition"
        >
          ‹
        </button>

        <img
          src={slides[index].image}
          alt="Flee-Low-Speed"
          className="w-[150px] md:w-[200px] lg:w-[350px]"
        />

        <button
          onClick={nextSlide}
          className="text-4xl bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition"
        >
          ›
        </button>

      </div>


      {/* SPECIFICATIONS */}
      <div className="mt-16 pb-20">

        <div className="flex flex-wrap justify-center gap-16 md:gap-24 text-center">

          <div>
            <p className="text-4xl font-bold">140 km</p>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-wide">
              Range
            </p>
          </div>

          <div>
            <p className="text-4xl font-bold">25 km/h</p>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-wide">
              Top Speed
            </p>
          </div>

          <div>
            <p className="text-4xl font-bold">2.9s</p>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-wide">
              0–60 Acceleration
            </p>
          </div>

        </div>

      </div>


      {/* ===============================
         CORE TECHNOLOGY SECTION
      =============================== */}

      <div className="w-full max-w-7xl mx-auto mt-28 mb-28 px-6">

        <div className="text-center mb-16">

          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Core Technologies in Flee-Low-Speed
          </h2>

          <p className="text-gray-400 mt-4 max-w-3xl mx-auto text-lg">
            The inGO Electric Flee C2 integrates advanced electric vehicle
            technologies designed for efficiency, smart connectivity,
            and modern urban mobility.
          </p>

        </div>


        {/* TECHNOLOGY GRID */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {[
            ["⚙️","BLDC Hub Motor","A 250W brushless DC hub motor integrated into the rear wheel delivers smooth acceleration and efficient power."],
            ["🔋","Lithium-Ion Battery","48V lithium battery providing high energy density and long lifecycle."],
            ["🧠","Battery Management","Smart BMS monitors voltage, temperature and charging cycles."],
            ["📡","IoT Connectivity","GPS tracking, geo-fencing, theft alerts and diagnostics."],
            ["📊","Digital Dashboard","LCD display shows speed, battery level and system data."],
            ["🔄","Battery Swapping","Quick battery replacement for minimal downtime."],
            ["🛞","Advanced Suspension","Front telescopic suspension and rear shock absorbers."],
            ["↩️","Reverse Drive","Move the vehicle backwards easily while parking."]
          ].map(([icon,title,desc],i)=>(
            <div
              key={i}
              className="bg-[#0b1b27] border border-gray-800 rounded-xl p-6 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
            >
              <span className="text-2xl">{icon}</span>

              <h3 className="text-2xl font-semibold mt-3 mb-2">
                {title}
              </h3>

              <p className="text-lg text-gray-400 leading-relaxed">
                {desc}
              </p>

            </div>
          ))}

        </div>

      </div>

      {/* ===============================
   ADVANTAGES SECTION
================================ */}

<div className="w-full max-w-7xl mx-auto mt-28 mb-28 px-6">

  {/* HEADER */}

  <div className="text-center mb-16">

    <h2 className="text-4xl md:text-5xl font-semibold text-white">
      Why Choose Flee-Low-Speed
    </h2>

    <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
      Built for modern urban mobility, the Flee C2 combines performance,
      efficiency, and intelligent technology to deliver a superior
      electric riding experience.
    </p>

  </div>


  {/* GRID */}

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">


    {/* RANGE */}

    <div className="group bg-gradient-to-b from-[#0b1b27] to-[#08141d] border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

      <div className="text-3xl mb-4 group-hover:scale-110 transition">
        ⚡
      </div>

      <h3 className="text-xl font-semibold text-white mb-3">
        Long Riding Range
      </h3>

      <p className="text-gray-400">
        Travel up to 180 km on a single charge, making the Flee C2
        perfect for daily commuting and extended city rides.
      </p>

    </div>


    {/* ACCELERATION */}

    <div className="group bg-gradient-to-b from-[#0b1b27] to-[#08141d] border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

      <div className="text-3xl mb-4 group-hover:scale-110 transition">
        🚀
      </div>

      <h3 className="text-xl font-semibold text-white mb-3">
        Fast Acceleration
      </h3>

      <p className="text-gray-400">
        Instant electric torque allows rapid acceleration,
        helping riders move quickly through busy city traffic.
      </p>

    </div>


    {/* LOW MAINTENANCE */}

    <div className="group bg-gradient-to-b from-[#0b1b27] to-[#08141d] border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

      <div className="text-3xl mb-4 group-hover:scale-110 transition">
        🔧
      </div>

      <h3 className="text-xl font-semibold text-white mb-3">
        Low Maintenance
      </h3>

      <p className="text-gray-400">
        Electric powertrains have fewer moving parts,
        reducing maintenance costs compared to petrol vehicles.
      </p>

    </div>


    {/* CONNECTIVITY */}

    <div className="group bg-gradient-to-b from-[#0b1b27] to-[#08141d] border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

      <div className="text-3xl mb-4 group-hover:scale-110 transition">
        📡
      </div>

      <h3 className="text-xl font-semibold text-white mb-3">
        Smart Connectivity
      </h3>

      <p className="text-gray-400">
        Integrated IoT features enable tracking, diagnostics,
        and smart vehicle management through connected systems.
      </p>

    </div>


    {/* ECO FRIENDLY */}

    <div className="group bg-gradient-to-b from-[#0b1b27] to-[#08141d] border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

      <div className="text-3xl mb-4 group-hover:scale-110 transition">
        🌱
      </div>

      <h3 className="text-xl font-semibold text-white mb-3">
        Sustainable Mobility
      </h3>

      <p className="text-gray-400">
        Zero tailpipe emissions help reduce environmental impact
        while supporting cleaner urban transportation.
      </p>

    </div>


    {/* COMFORT */}

    <div className="group bg-gradient-to-b from-[#0b1b27] to-[#08141d] border border-gray-800 rounded-xl p-8 transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

      <div className="text-3xl mb-4 group-hover:scale-110 transition">
        🛞
      </div>

      <h3 className="text-xl font-semibold text-white mb-3">
        Comfortable Ride
      </h3>

      <p className="text-gray-400">
        Advanced suspension and ergonomic design provide
        a smooth and comfortable riding experience.
      </p>

    </div>


  </div>

</div>

    </div>
  );
}