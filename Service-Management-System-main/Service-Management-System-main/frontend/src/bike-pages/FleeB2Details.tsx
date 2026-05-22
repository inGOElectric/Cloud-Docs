import { useEffect } from "react";

export default function FleeB2Details(){

useEffect(()=>{
window.scrollTo(0,0);
},[]);

return(

<div className="bg-[#0e0e0e] text-white min-h-screen">

<div className="max-w-6xl mx-auto px-6 py-16">

{/* TITLE */}

<h1 className="text-4xl md:text-5xl font-bold">
Flee B2: Balanced Performance
</h1>


{/* STICKY CATEGORY PILLS */}

<div className="flex flex-wrap gap-4 mt-8 sticky top-4 z-20 bg-[#0e0e0e]/90 backdrop-blur-lg py-4">

{[
{label:"Introduction", id:"intro"},
{label:"Key Features", id:"features"},
{label:"Performance", id:"performance"},
{label:"Battery", id:"battery"},
{label:"Ride Quality", id:"ride"},
{label:"Our Take", id:"take"}
].map((item,index)=> (

<button
key={index}
onClick={()=> document.getElementById(item.id)?.scrollIntoView({behavior:"smooth"})}
className="border border-gray-700 px-5 py-2 rounded-full text-sm hover:bg-gray-800 hover:border-gray-500 transition"
>
{item.label}
</button>

))}

</div>


{/* INTRODUCTION */}

<section id="intro" className="mt-16 animate-fadeUp">

<h2 className="text-3xl font-semibold mb-6">
Introduction
</h2>

<div className="overflow-hidden rounded-xl">

<img
src="/bikes/flee-b2/default.png"
className="w-full rounded-xl transition duration-700 hover:scale-105 hover:rotate-[1deg]"
/>

</div>

<p className="text-gray-400 mt-6 leading-relaxed text-xl">
The Flee B2 is built for riders who want a practical and efficient electric scooter for everyday city travel. Designed with urban mobility in mind, it offers a balanced combination of performance, reliability, and ease of use. The lightweight frame and stable chassis allow riders to navigate through traffic smoothly while maintaining control and comfort.

Powered by a refined electric drivetrain and supported by a long-range lithium-ion battery, the B2 delivers consistent acceleration and dependable performance for daily commuting. Its ergonomic riding position and well-tuned suspension system help provide a comfortable experience even on uneven city roads. Overall, the Flee B2 is an ideal solution for riders seeking an economical, environmentally friendly, and convenient mode of transportation for modern urban lifestyles.
</p>

</section>

{/* KEY FEATURES */}

<section id="features" className="mt-24 animate-fadeUp">

<h2 className="text-3xl font-semibold mb-12">
Key Features
</h2>

<div className="grid md:grid-cols-3 gap-10">

{[
{icon:"/features/battery.png", title:"Removable Battery"},
{icon:"/features/charging.png", title:"Fast Charging"},
{icon:"/features/motor.png", title:"Efficient BLDC Motor"},
{icon:"/features/suspension.png", title:"Dual Suspension"},
{icon:"/features/dashboard.png", title:"Digital Dashboard"},
{icon:"/features/load.png", title:"High Load Capacity"}
].map((feature,index)=> (

<div
key={index}
className="group bg-[#141414] border border-gray-800 rounded-2xl p-8 text-center
hover:border-indigo-500 hover:bg-[#181818] transition duration-300 hover:-translate-y-1"
>

<img
src={feature.icon}
className="h-16 mx-auto mb-6 transition group-hover:scale-110"
/>

<h3 className="text-lg font-semibold text-white">
{feature.title}
</h3>

</div>

))}

</div>

</section>


{/* PERFORMANCE */}

<section id="performance" className="mt-24 animate-fadeUp">

<h2 className="text-3xl font-semibold mb-6">
Performance
</h2>

<div className="overflow-hidden rounded-xl">

<img
src="/features/motor.png"
className="w-full rounded-xl transition duration-700 hover:scale-110"
/>

</div>

<p className="text-gray-400 mt-6 leading-relaxed text-xl">
The high-efficiency electric motor is designed to deliver strong torque instantly, allowing the scooter to accelerate smoothly from a standstill. This quick power delivery makes the Flee B2 well suited for urban traffic conditions where frequent stopping and starting are common. The motor operates quietly and efficiently, providing a refined riding experience without the noise and vibration typically associated with traditional engines.

As the scooter gains speed, the motor continues to deliver consistent power, helping the vehicle reach its top speed quickly while maintaining stability and control. Combined with the bike’s balanced chassis and responsive handling, this ensures that riders experience a smooth, confident ride whether navigating through city streets or cruising on open roads.
</p>

</section>


{/* BATTERY */}

<section id="battery" className="mt-24 animate-fadeUp">

<h2 className="text-3xl font-semibold mb-6">
Battery & Range
</h2>

<div className="overflow-hidden rounded-xl">

<img
src="/features/battery.png"
className="w-full rounded-xl transition duration-700 hover:scale-110"
/>

</div>

<p className="text-gray-400 mt-6 leading-relaxed text-xl">
The lithium-ion battery pack is designed to provide reliable energy for everyday urban commuting. It is optimized for efficiency, allowing the Flee B2 to cover longer distances on a single charge while maintaining stable performance. This makes it ideal for daily travel, short trips around the city, and last-mile transportation needs.

With fast charging capability, the battery can be recharged quickly, reducing downtime and allowing riders to get back on the road sooner. The efficient battery system also helps keep operating costs low while supporting a smooth and consistent riding experience.
</p>

</section>


{/* RIDE QUALITY */}

<section id="ride" className="mt-24 animate-fadeUp">

<h2 className="text-3xl font-semibold mb-6">
Ride Quality
</h2>

<div className="overflow-hidden rounded-xl">

<img
src="/features/suspension.png"
className="w-full rounded-xl transition duration-700 hover:scale-110"
/>

</div>

<p className="text-gray-400 mt-6 leading-relaxed text-xl">
The dual suspension system is designed to provide a smoother and more comfortable riding experience, especially on uneven or rough urban roads. The front suspension helps absorb shocks from bumps and potholes, while the rear suspension improves overall balance and stability. This setup reduces vibration and ensures better control during everyday riding.

Combined with the optimized chassis design, the suspension system helps the Flee B2 remain stable and well-balanced even when traveling at higher speeds. This results in improved handling, better rider confidence, and a more comfortable journey during both short city trips and longer commutes.
</p>

</section>


{/* OUR TAKE */}

<section id="take" className="mt-24 mb-20 animate-fadeUp">

<h2 className="text-3xl font-semibold mb-6">
Our Take
</h2>

<p className="text-gray-400 leading-relaxed text-3xl">
The Flee B2 strikes an impressive balance between performance,
comfort and practicality. It is ideal for riders who want
an electric scooter that can handle daily commutes while still
delivering a fun and responsive riding experience.
</p>

</section>

</div>

</div>

)
}