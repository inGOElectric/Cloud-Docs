import { useEffect, useState } from "react";
import client from "../../api/client";

export default function Technicians() {

const [technicians, setTechnicians] = useState([]);
const [selectedTech, setSelectedTech] = useState(null);
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  loadTechnicians();
}, []);

/* ================= LOAD TECHNICIANS ================= */

const loadTechnicians = async () => {
  try {
    const res = await client.get("/technicians");
    setTechnicians(res.data || []);
  } catch (err) {
    console.error("Failed to load technicians", err);
  }
};

/* ================= LOAD JOBS ================= */

const loadJobs = async (tech) => {
  setSelectedTech(tech);
  setLoading(true);

  try {
    const res = await client.get(`/technicians/${tech.id}/jobs`);

    let data = Array.isArray(res.data) ? res.data : [];

    // Sort newest jobs first
    data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    setJobs(data);

  } catch (err) {
    console.error("Failed to load jobs", err);
    setJobs([]);
  }

  setLoading(false);
};

return (

<div className="admin-card">

{/* ================= MESSAGE ================= */}

{!selectedTech && (
<p className="admin-subheading">
Select technician to see work done
</p>
)}

{/* ================= TECHNICIAN LIST ================= */}

<div
style={{
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: "16px",
marginTop: "20px"
}}
>

{technicians.map((tech) => (
<div
key={tech.id}
onClick={() => loadJobs(tech)}
style={{
background: selectedTech?.id === tech.id ? "#2563eb" : "#0A3A55",
padding: "16px",
borderRadius: "10px",
cursor: "pointer",
transition: "0.2s"
}}
>
<h3>{tech.name}</h3>
</div>
))}

</div>

{/* ================= JOB TABLE ================= */}

{selectedTech && (

<div style={{ marginTop: "30px" }}>

<h3>
Work done by {selectedTech.name}
</h3>

{loading ? (

<p>Loading...</p>

) : jobs.length === 0 ? (

<p>No work records found</p>

) : (

<table className="admin-table">

<thead>
<tr>
<th>Job Card</th>
<th>Customer</th>
<th>Vehicle</th>
<th>Work</th>
<th>Date</th>
</tr>
</thead>

<tbody>

{jobs.map((job) => (
<tr key={job.id}>

<td>{job.jobCardNumber}</td>

<td>{job.customer || "-"}</td>

<td>{job.vehicle || "-"}</td>

<td>
{job.work ? job.work.replaceAll("_", " ") : "-"}
</td>

<td>
{job.date
? new Date(job.date).toLocaleDateString("en-GB")
: "-"}
</td>

</tr>
))}

</tbody>

</table>

)}

</div>

)}

</div>

);

}