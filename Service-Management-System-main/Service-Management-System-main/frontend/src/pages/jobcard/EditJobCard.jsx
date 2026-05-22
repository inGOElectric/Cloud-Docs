import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../api/client";

export default function EditJobCard() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form,setForm] = useState({
    customerId:"",
    vehicleId:"",
    serviceType:"",
    status:"",
    remarks:""
  });

  const [customers,setCustomers] = useState([]);
  const [vehicles,setVehicles] = useState([]);

  useEffect(()=>{

    loadJobCard();
    loadCustomers();
    loadVehicles();

  },[]);

  /* ======================
        LOAD JOB CARD
  ====================== */

  const loadJobCard = async () => {

    try{

      const res = await client.get(`/job-cards/${id}`);

      const jc = res.data.data;

      setForm({
        customerId: jc.customerId,
        vehicleId: jc.vehicleId,
        serviceType: jc.serviceType,
        status: jc.status,
        remarks: jc.remarks || ""
      });

    }catch(error){

      console.error("Failed to load job card:",error);

    }

  };

  /* ======================
        LOAD CUSTOMERS
  ====================== */

  const loadCustomers = async () => {

    const res = await client.get("/customers");

    const data = Array.isArray(res.data.data)
      ? res.data.data
      : [];

    setCustomers(data);

  };

  /* ======================
        LOAD VEHICLES
  ====================== */

  const loadVehicles = async () => {

    const res = await client.get("/vehicles");

    const data = Array.isArray(res.data.data)
      ? res.data.data
      : [];

    setVehicles(data);

  };

  /* ======================
        INPUT CHANGE
  ====================== */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  /* ======================
        UPDATE JOB CARD
  ====================== */

  const handleUpdate = async () => {

    try{

      await client.put(`/job-cards/${id}`,{
        customerId:Number(form.customerId),
        vehicleId:Number(form.vehicleId),
        serviceType:form.serviceType,
        status:form.status,
        remarks:form.remarks
      });

      alert("Job card updated successfully");

      navigate("/dashboard");

    }catch(error){

      console.error("Update failed:",error);
      alert("Update failed");

    }

  };

  return (

<div className="admin-card">

<h2 className="admin-heading">
Edit Job Card
</h2>


<label>Customer</label>

<select
name="customerId"
value={form.customerId}
onChange={handleChange}
>

<option value="">Select Customer</option>

{customers.map(c=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>


<label>Vehicle</label>

<select
name="vehicleId"
value={form.vehicleId}
onChange={handleChange}
>

<option value="">Select Vehicle</option>

{vehicles.map(v=>(
<option key={v.id} value={v.id}>
{v.model}
</option>
))}

</select>


<label>Service Type</label>

<select
name="serviceType"
value={form.serviceType}
onChange={handleChange}
>

<option value="">Select Service Type</option>

<option value="GENERAL">GENERAL</option>
<option value="COMPLAINT">COMPLAINT</option>
<option value="BATTERY">BATTERY</option>
<option value="CHARGER">CHARGER</option>

</select>


<label>Status</label>

<select
name="status"
value={form.status}
onChange={handleChange}
>

<option value="OPEN">OPEN</option>
<option value="IN_PROGRESS">IN_PROGRESS</option>
<option value="COMPLETED">COMPLETED</option>
<option value="CANCELLED">CANCELLED</option>

</select>


<label>Remarks</label>

<textarea
name="remarks"
value={form.remarks}
onChange={handleChange}
/>


<button
className="admin-button-primary"
onClick={handleUpdate}
>

Update Job Card

</button>

</div>

  );

}