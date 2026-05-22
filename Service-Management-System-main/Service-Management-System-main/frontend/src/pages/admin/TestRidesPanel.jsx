import { useEffect, useState } from "react";
import client from "../../api/client";

export default function TestRidesPanel() {

const [rides, setRides] = useState([]);
const [loading, setLoading] = useState(true);

/* ================= FETCH TEST RIDES ================= */

const fetchRides = async () => {

try {

const res = await client.get("/test-rides/admin/all");
let data = Array.isArray(res.data) ? res.data : [];

/* SORT NEWEST FIRST */

data.sort((a,b)=> new Date(b.date) - new Date(a.date));

setRides(data);

}
catch(err){
console.error("Failed to fetch test rides", err);
setRides([]);
}
finally{
setLoading(false);
}

};

useEffect(()=>{

fetchRides();

/* MARK AS VIEWED */

client.put("/test-rides/mark-viewed").catch(()=>{});

},[]);


/* ================= DATE FORMATTER ================= */

const formatDate = (date)=>{
if(!date) return "-";
return new Date(date).toLocaleDateString("en-GB");
};


/* ================= LOADING ================= */

if(loading){
return(
<div className="admin-card">
<p className="admin-text">Loading test rides...</p>
</div>
);
}


/* ================= MAIN UI ================= */

return(

<div className="admin-card">

<div className="admin-header">
<h2 className="admin-heading">
Test Ride History
</h2>
</div>

{rides.length === 0 ? (

<p className="admin-text">
No test rides found.
</p>

) : (

<table className="admin-table">

<thead>
<tr>
<th>Bike</th>
<th>Location</th>
<th>Date</th>
<th>Time</th>
<th>Customer</th>
<th>Phone</th>
<th>Email</th>
<th>Address</th>
<th>Status</th>
<th>Rating</th>
<th>Feedback</th>
</tr>
</thead>

<tbody>

{rides.map((ride)=>{

return(

<tr key={ride.id || `${ride.phone}-${ride.date}-${ride.timeSlot}`}>

<td>{ride.bikeName}</td>

<td>{ride.location}</td>

<td>{formatDate(ride.date)}</td>

<td>{ride.timeSlot}</td>

<td>{ride.fullName}</td>

<td>{ride.phone}</td>

<td>{ride.email}</td>

<td>{ride.address || "—"}</td>


{/* STATUS */}

<td>

<span
className={
ride.status === "CONFIRMED"
? "admin-badge admin-badge-open"
: ride.status === "PENDING"
? "admin-badge"
: "admin-badge admin-badge-closed"
}
>
{ride.status}
</span>

</td>


{/* RATING */}

<td>

{ride.rating ? (

<div className="admin-rating">

<div className="admin-rating-stars">

{[1,2,3,4,5].map((star)=>(
  <span
    key={`${ride.id}-star-${star}`}
    className={
      star <= ride.rating
        ? "admin-rating-filled"
        : "admin-rating-empty"
    }
  >
    ★
  </span>
))}

</div>

<span className="admin-rating-value">
{ride.rating.toFixed(1)} / 5
</span>

</div>

) : (

<span className="admin-rating-none">
No Rating
</span>

)}

</td>


{/* FEEDBACK */}

<td style={{opacity: ride.feedback ? 1 : 0.6}}>
{ride.feedback || "No feedback"}
</td>

</tr>

);

})}

</tbody>

</table>

)}

</div>

);

}