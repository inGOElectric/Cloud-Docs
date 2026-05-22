import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";
import { searchJobCards } from "../../api/jobCards";

export default function AdminDashboard() {

  const [jobCards,setJobCards] = useState([]);
  const [search,setSearch] = useState("");
  const [status,setStatus] = useState("");
  const [serviceType,setServiceType] = useState("");

  const [customers,setCustomers] = useState([]);
  const [vehicles,setVehicles] = useState([]);

  /* ======================
        LOAD DATA
  ====================== */

  useEffect(()=>{
    loadCustomers();
    loadVehicles();
  },[]);

  useEffect(()=>{
    loadJobCards();
  },[search,status,serviceType]);


  const loadJobCards = async () => {

    try{

      const res = await searchJobCards(search);

      const safeJobCards = Array.isArray(res.data.data)
        ? res.data.data
        : [];

      let data = safeJobCards;

      if(status) data = data.filter(j => j.status === status);
      if(serviceType) data = data.filter(j => j.serviceType === serviceType);

      setJobCards(data);

    }catch(error){

      console.error("Failed to load job cards:",error);
      setJobCards([]);

    }

  };


  const loadCustomers = async () => {

    try{

      const res = await client.get("/customers");

      const safeCustomers =
        Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setCustomers(safeCustomers);

    }catch(error){

      console.error("Failed to load customers:",error);
      setCustomers([]);

    }

  };


  const loadVehicles = async () => {
  try {
    const res = await client.get("/api/public/vehicles");

    const safeVehicles =
      Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

    setVehicles(safeVehicles);

  } catch (error) {
    console.error("Failed to load vehicles:", error);
    setVehicles([]);
  }
};


  /* ======================
        DATE FORMAT
  ====================== */

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US",{
      year:"numeric",
      month:"short",
      day:"numeric"
    });


  /* ======================
        DELETE
  ====================== */

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job card?"
    );

    if(!confirmDelete) return;

    try{

      await client.delete(`/job-cards/${id}`);
      loadJobCards();

    }catch(error){

      console.error("Delete failed:",error);
      alert("Failed to delete job card");

    }

  };


  return (

<div className="admin-card">

<div className="admin-header">

<h2 className="admin-heading">Job Cards</h2>

<p className="admin-subheading">
Manage and track all service job cards
</p>


{/* TOOLBAR */}

<div className="admin-toolbar">

<Link to="/job-cards/new" className="admin-create-link">
+ Create Job Card
</Link>

<div className="admin-filters">

<div className="admin-filter-group">
<label>Search</label>
<input
placeholder="Job card #, customer, vehicle..."
value={search}
onChange={(e)=> setSearch(e.target.value)}
/>
</div>


<div className="admin-filter-group">
<label>Status</label>
<select value={status} onChange={(e)=> setStatus(e.target.value)}>
<option value="">All Status</option>
<option value="OPEN">Open</option>
<option value="IN_PROGRESS">In Progress</option>
<option value="COMPLETED">Completed</option>
</select>
</div>


<div className="admin-filter-group">
<label>Service Type</label>
<select value={serviceType} onChange={(e)=> setServiceType(e.target.value)}>
<option value="">All Types</option>
<option value="GENERAL">General</option>
<option value="COMPLAINT">Complaint</option>
<option value="BATTERY">Battery</option>
<option value="CHARGER">Charger</option>
</select>
</div>

</div>

</div>


{/* TABLE */}

<table className="admin-table">

<thead>

<tr>
<th>Job Card #</th>
<th>Customer</th>
<th>Vehicle</th>
<th>Service</th>
<th>Status</th>
<th>Created</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{jobCards.length === 0 ? (

<tr>
<td colSpan="7" className="admin-text">
No job cards found
</td>
</tr>

) : (

jobCards.map((jc)=> (

<tr key={jc.id}>

<td>
<Link className="action-link" to={`/job-cards/${jc.id}`}>
{jc.jobCardNumber}
</Link>
</td>

<td>{jc.customer?.name || "-"}</td>
<td>{jc.vehicle?.model || "-"}</td>
<td>{jc.serviceType}</td>
<td><span className="status">{jc.status}</span></td>
<td>{formatDate(jc.createdAt)}</td>

<td>

<div className="admin-actions">

<Link to={`/job-cards/${jc.id}`} className="admin-action-link">
View
</Link>

{/* EDIT NOW OPENS EDIT PAGE */}

<Link
to={`/job-cards/edit/${jc.id}`}
className="action-link"
>
Edit
</Link>

<button
className="action-link danger"
onClick={()=> handleDelete(jc.id)}
>
Delete
</button>

</div>

</td>

</tr>

))

)}

</tbody>

</table>


<div className="results">
{jobCards.length} job card{jobCards.length !== 1 && "s"} found
</div>

</div>
</div>
);

}