import { useEffect, useState } from "react";

interface Bike {
  id: number;
  name: string;
  tagline: string;
  range: string;
  speed: string;
  acceleration: string;
  image: string;
  features: string[];
}

interface Props {
  bike: Bike;
  featureImages: Record<string,string>;
}

export default function BikeLayout({bike,featureImages}:Props){

const [activeIndex,setActiveIndex] = useState(0)

useEffect(()=>{

window.scrollTo(0,0)

const interval = setInterval(()=>{
setActiveIndex((prev)=> (prev + 1) % bike.features.length)
},3500)

return ()=> clearInterval(interval)

},[bike.features.length])

return(

<div className="bg-black text-white">

{/* HERO */}

<section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-blue-200 to-teal-200 text-gray-900">

<div className="absolute w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl top-[-120px] left-[-120px]"></div>

<div className="absolute w-[400px] h-[400px] bg-white/30 rounded-full blur-3xl bottom-[-100px] right-[-120px]"></div>

<div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center min-h-screen px-6">

{/* LEFT */}

<div>

<p className="tracking-widest text-gray-600 text-sm mb-3">
LET'S RIDE THE
</p>

<h1 className="text-6xl md:text-7xl font-bold leading-tight">
{bike.name}
</h1>

<p className="text-lg text-gray-700 mt-4 max-w-md">
{bike.tagline}
</p>

<div className="mt-10 space-y-6 max-w-md">

{bike.features.slice(0,4).map((feature,index)=>{

const icon = featureImages[feature]

return(

<div key={index} className="flex items-center gap-4">

<img src={icon} className="w-10 h-10 object-contain"/>

<p className="text-gray-900 text-xl font-semibold">
{feature}
</p>

</div>

)

})}

</div>

</div>


{/* BIKE */}

<div className="flex justify-center">

<img
src={bike.image}
className="max-h-[520px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.25)] hover:scale-105 transition duration-500"
/>

</div>

</div>


{/* SPECS */}

<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-16 text-center">

<div>
<p className="text-2xl font-bold">{bike.range}</p>
<p className="text-sm text-gray-600">Range</p>
</div>

<div>
<p className="text-2xl font-bold">{bike.speed}</p>
<p className="text-sm text-gray-600">Top Speed</p>
</div>

<div>
<p className="text-2xl font-bold">{bike.acceleration}</p>
<p className="text-sm text-gray-600">0–60</p>
</div>

</div>

</section>

</div>

)

}