import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen md:h-screen overflow-hidden">

  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover z-0"
  >
    <source src="/assets/hero-video.mp4" type="video/mp4" />
  </video>

  <div className="absolute inset-0 bg-gradient-to-b from-grey via-black/10 z-10" />

  <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4 w-full max-w-5xl mx-auto">

    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold italic tracking-wide">
      FLEE
    </h1>

    <p className="mt-4 text-base sm:text-lg md:text-2xl text-gray-200 max-w-xl sm:max-w-2xl">
      Smart. Stylish. Sustainable Mobility for the Future
    </p>

  </div>

</section>
  );
}