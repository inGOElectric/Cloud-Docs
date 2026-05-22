import { useEffect } from "react";

export default function FleeB3Details() {

useEffect(() => {
window.scrollTo(0,0);
},[]);

return(

<div className="bg-black text-white">

{/* HERO SECTION */}

<section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-blue-200 to-teal-200 text-gray-900">

{/* background circles */}

<div className="absolute w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl top-[-120px] left-[-120px]"></div>
<div className="absolute w-[400px] h-[400px] bg-white/30 rounded-full blur-3xl bottom-[-100px] right-[-120px]"></div>

<div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center min-h-screen px-6">

{/* LEFT CONTENT */}

<div>

<p className="tracking-widest text-gray-600 text-sm mb-3">
LET'S RIDE THE
</p>

<h1 className="text-6xl md:text-7xl font-bold">
Flee B3
</h1>

<p className="text-lg text-gray-700 mt-4 max-w-md">
Power & Efficiency Combined
</p>

<div className="mt-10 space-y-6 max-w-md">

<div className="flex items-center gap-4">
<img src="/features/motor.png" className="w-10 h-10"/>
<p className="text-xl font-semibold">High Performance Motor</p>
</div>

<div className="flex items-center gap-4">
<img src="/features/cooling.png" className="w-10 h-10"/>
<p className="text-xl font-semibold">Advanced Cooling System</p>
</div>

<div className="flex items-center gap-4">
<img src="/features/dashboard1.png" className="w-10 h-10"/>
<p className="text-xl font-semibold">Smart Dashboard</p>
</div>

<div className="flex items-center gap-4">
<img src="/features/battery.png" className="w-10 h-10"/>
<p className="text-xl font-semibold">Extended Battery Life</p>
</div>

</div>

</div>

{/* BIKE IMAGE */}

<div className="flex justify-center">

<img
src="/bikes/flee-b3/default.png"
className="max-h-[520px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.25)] hover:scale-105 transition duration-500"
/>

</div>

</div>

{/* SPECS */}

<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-16 text-center">

<div>
<p className="text-2xl font-bold">200 km</p>
<p className="text-sm text-gray-600">Range</p>
</div>

<div>
<p className="text-2xl font-bold">110 km/h</p>
<p className="text-sm text-gray-600">Top Speed</p>
</div>

<div>
<p className="text-2xl font-bold">2.7s</p>
<p className="text-sm text-gray-600">0–60</p>
</div>

</div>

</section>


{/* PEAK PERFORMANCE */}

<section className="bg-black py-32 px-6 border-t border-gray-800">

<div className="max-w-6xl mx-auto">

<h2 className="text-4xl text-center text-gray-300 mb-16">
Peak performance, brought to you by
</h2>

<div className="grid md:grid-cols-3 gap-8">

{/* Motor */}
<div className="bg-[#0f0f0f] rounded-3xl border border-gray-800 hover:border-indigo-500 transition">

<img src="/features/motor.png" className="w-full h-56 object-cover"/>

<div className="p-6">
<h3 className="text-lg font-semibold">
Hub Motor System
</h3>

<p className="text-gray-400 mt-2">
High-efficiency BLDC hub motor delivering instant torque and smooth acceleration.
</p>
</div>

</div>


{/* Battery */}
<div className="bg-[#0f0f0f] rounded-3xl border border-gray-800 hover:border-indigo-500 transition">

<img src="/features/battery.png" className="w-full h-56 object-cover"/>

<div className="p-6">
<h3 className="text-lg font-semibold">
Lithium-Ion Battery Pack
</h3>

<p className="text-gray-400 mt-2">
Removable battery designed for long range and fast charging.
</p>
</div>

</div>


{/* Suspension */}
<div className="bg-[#0f0f0f] rounded-3xl p-6 border border-gray-800 hover:border-indigo-500 transition">

<h3 className="text-lg font-semibold">
Monoshock Suspension
</h3>

<p className="text-gray-400 mt-2">
Advanced suspension system for smooth riding on uneven roads.
</p>

<img
src="/features/suspension.png"
className="mt-6 h-40 object-contain mx-auto"
/>

</div>


{/* Chassis */}
<div className="bg-[#0f0f0f] rounded-3xl p-6 border border-gray-800 hover:border-indigo-500 transition">

<h3 className="text-lg font-semibold">
Reinforced Aluminium Chassis
</h3>

<p className="text-gray-400 mt-2">
Lightweight yet strong structure designed for stability and durability.
</p>

<img
src="/features/chassis.png"
className="mt-6 h-40 object-contain mx-auto"
/>

</div>


{/* Controller */}
<div className="bg-[#0f0f0f] rounded-3xl border border-gray-800 hover:border-indigo-500 transition">

<img src="/features/dashboard1.png" className="w-full h-56 object-cover"/>

<div className="p-6">
<h3 className="text-lg font-semibold">
Electronic Motor Controller
</h3>

<p className="text-gray-400 mt-2">
Smart controller regulating energy flow between battery and motor.
</p>
</div>

</div>


{/* Dashboard */}
<div className="bg-[#0f0f0f] rounded-3xl border border-gray-800 hover:border-indigo-500 transition">

<img src="/features/dashboard.png" className="w-full h-56 object-cover"/>

<div className="p-6">
<h3 className="text-lg font-semibold">
Smart Dashboard System
</h3>

<p className="text-gray-400 mt-2">
Displays speed, battery level and ride data in real time.
</p>
</div>

</div>
</div>
</div>

</section>


{/* SMART VOICE ASSISTANT */}

<section className="bg-black py-32 px-6 border-t border-gray-800">

<div className="max-w-6xl mx-auto text-center">

<span className="inline-block bg-green-600 text-xs px-3 py-1 rounded-full mb-4">
Coming Soon
</span>

<h2 className="text-5xl font-bold">
Smart Voice Assistant
</h2>

<p className="text-gray-400 mt-4 max-w-xl mx-auto">
Talk to your scooter and control navigation, music, and location sharing.
</p>

<div className="mt-20 grid md:grid-cols-3 gap-10 text-sm">

{[
"Share my Live Location",
"How far is the nearest charging point?",
"Play the next song",
"Take me home",
"Increase screen brightness",
"Set traction control to Rain"
].map((command,index)=> (

<div
key={index}
className="group bg-gray-900 px-6 py-4 rounded-full border border-gray-800
hover:border-indigo-500 hover:bg-gray-800 hover:scale-105
transition duration-300 cursor-pointer flex items-center justify-center gap-2"
>

<span className="text-gray-200 group-hover:text-white">
{command}
</span>

</div>

))}

</div>

</div>

</section>

</div>

)

}