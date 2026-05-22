import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "./dashboard/CreateJobCard.css";

export default function CreateJobCard() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("new"); // "new" or "existing"
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customerJobCards, setCustomerJobCards] = useState([]);

  const [vehicleServiceInCondition, setVehicleServiceInCondition] = useState({
    battery: "",
    brakes: "",
    display: "",
    body: "",
    carrier: "",
    chassis: "",
    rust: "",
    wheels: "",
    footBoard: "",
    allSwitchesFunction: "",
    lightsAndIndicators: "",
    solenoid: "",
    mudguards: "",
    charger: "",
  });

  const [form, setForm] = useState({
  serviceType: "GENERAL",
  serviceInDatetime: "",
  odometer: "",
  batteryVoltage: "",

  customerId: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerAddress: "",

  vehicleId: "",
  vin: "",
  vehicleModel: "",
  registrationNumber: "",
  batteryNumber: "",
  motorNumber: "",
  chargerNumber: "",
  warrantyStatus: "",

  remarks: "",
});


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConditionChange = (condition, value) => {
    setVehicleServiceInCondition({
      ...vehicleServiceInCondition,
      [condition]: value,
    });
  };

  // Load existing customers and vehicles
  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersRes, vehiclesRes] = await Promise.all([
          api.get("/customers"),
          api.get("/vehicles"),
        ]);

        // DEFENSIVE parsing for customers
        const customersData = Array.isArray(customersRes.data)
          ? customersRes.data
          : Array.isArray(customersRes.data?.data)
          ? customersRes.data.data
          : Array.isArray(customersRes.data?.customers)
          ? customersRes.data.customers
          : [];

        // DEFENSIVE parsing for vehicles
        const vehiclesData = Array.isArray(vehiclesRes.data)
          ? vehiclesRes.data
          : Array.isArray(vehiclesRes.data?.data)
          ? vehiclesRes.data.data
          : Array.isArray(vehiclesRes.data?.vehicles)
          ? vehiclesRes.data.vehicles
          : [];

        setCustomers(customersData);
        setVehicles(vehiclesData);
      } catch (error) {
        console.error("Failed to load customers/vehicles:", error);
        setCustomers([]);
        setVehicles([]);
      }
    };

    loadData();
  }, []);

  // Load customer job cards when customer is selected in existing mode
  useEffect(() => {
    if (mode === "existing" && form.customerId) {
      const loadCustomerJobCards = async () => {
        try {
          const res = await api.get(`/customers/${form.customerId}/job-cards`);
          const jobCardsData = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];
          setCustomerJobCards(jobCardsData);
        } catch (error) {
          console.error("Failed to load customer job cards:", error);
          setCustomerJobCards([]);
        }
      };
      loadCustomerJobCards();
    } else {
      setCustomerJobCards([]);
    }
  }, [mode, form.customerId]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setForm({
      serviceType: "GENERAL",
      serviceInDatetime: "",
      customerId: "",
      customerName: "",
      customerPhone: "",
      Address: "",
      vehicleId: "",
      vin: "",
      vehicleModel: "",
      remarks: "",
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let payload;
    let endpoint;

    if (mode === "existing") {
      if (!form.customerId || !form.vehicleId) {
        alert("Please select both customer and vehicle");
        console.log("Customers:", customers);
        return;
      }

     payload = {
  customerId: Number(form.customerId),
  vehicleId: Number(form.vehicleId),
  serviceType: form.serviceType,
  serviceInDatetime: form.serviceInDatetime,
  odometer: form.odometer,
  batteryVoltage: form.batteryVoltage,
  remarks: form.remarks,
};


      endpoint = "/job-cards";
    } else {
      
      if (
        !form.customerName ||
        !form.customerPhone ||
        !form.vin ||
        !form.vehicleModel
      ) {
        alert("Please fill Customer Name, Phone, VIN, and Vehicle Model");
        return;
      }

      payload = {
  serviceType: form.serviceType,
  serviceInDatetime: form.serviceInDatetime,
  odometer: form.odometer,
  batteryVoltage: form.batteryVoltage,
  remarks: form.remarks,

  customerName: form.customerName,
  customerPhone: form.customerPhone,
  customerEmail: form.customerEmail,
  customerAddress: form.customerAddress,

  vin: form.vin,
  vehicleModel: form.vehicleModel,
  registrationNumber: form.registrationNumber,
  batteryNumber: form.batteryNumber,
  motorNumber: form.motorNumber,
  chargerNumber: form.chargerNumber,
  warrantyStatus: form.warrantyStatus,
};

      endpoint = "/job-cards/create-with-details";
    }

    await api.post(endpoint, payload);

    alert("Job Card created successfully");
    navigate("/dashboard/admin");
  } catch (error) {
    console.error("Job card creation failed", error);
    alert(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Failed to create job card"
    );
  }
};


  return (
  <div className="admin-card">
    <div className="admin-header">
      <h2 className="admin-heading">Create Job Card</h2>
      <h2 className="admin-subheading">
        Fill in service, customer, and vehicle details
      </h2>
    </div>

    {/* WHITE FORM CONTAINER */}
    <div className="jobcard-form-wrapper">
      <form onSubmit={handleSubmit}>

        {/* ================= SERVICE ================= */}
        <h3>Service Information</h3>
      <div className="mode-toggle-wrapper">
  <div className="mode-toggle">
    <button
      type="button"
      className={`toggle-btn ${mode === "new" ? "active" : ""}`}
      onClick={() => setMode("new")}
    >
      + New Customer & Vehicle
    </button>

    <button
      type="button"
      className={`toggle-btn ${mode === "existing" ? "active" : ""}`}
      onClick={() => setMode("existing")}
    >
      ↺ Existing Customer & Vehicle
    </button>
  </div>

  <div className="mode-description">
    {mode === "new"
      ? "Creating a brand new customer and vehicle record."
      : "Using already registered customer and vehicle."}
  </div>
</div>
        <table className="jobcard-table">
          <tbody>
            <tr>
              <td>Service Type</td>
              <td>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                >
              <option value="GENERAL">General Service</option>
              <option value="COMPLAINT">General Complaint</option>
              <option value="BATTERY">Battery Complaint</option>
              <option value="CHARGER">Charger Complaint</option>
              <option value="PAID_SERVICE_REPAIRABLE">Paid Service with Repairable Complaints</option>
              <option value="PAID_SERVICE_WARRANTY">Paid Service with Warranty Replacement</option>
              <option value="SPARES_DISPATCH">Spares Parts Dispatch</option>
                </select>
              </td>

              <td>Service Date & Time</td>
              <td>
                <input
                  type="datetime-local"
                  name="serviceInDatetime"
                  value={form.serviceInDatetime}
                  onChange={handleChange}
                />
              </td>
            </tr>

            <tr>
              <td>Odometer</td>
              <td>
                <input
                  type="number"
                  name="odometer"
                  value={form.odometer}
                  onChange={handleChange}
                />
              </td>

              <td>Battery Voltage</td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  name="batteryVoltage"
                  value={form.batteryVoltage}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ================= CUSTOMER ================= */}
       <h3>Customer Information</h3>

{mode === "existing" ? (

  // EXISTING CUSTOMER MODE
  <table className="jobcard-table">
    <tbody>
      <tr>
        <td>Select Customer</td>
        <td colSpan="3">
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
          >
            <option value="">Choose customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.mobileNumber}
              </option>
            ))}
          </select>
        </td>
      </tr>
    </tbody>
  </table>

) : (

  // NEW CUSTOMER MODE (FULL TABLE)
  <table className="jobcard-table">
    <tbody>
      <tr>
        <td>Customer Name</td>
        <td>
          <input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
          />
        </td>

        <td>Customer Phone</td>
        <td>
          <input
            name="customerPhone"
            value={form.customerPhone}
            onChange={handleChange}
          />
        </td>
      </tr>

      <tr>
        <td>Email</td>
        <td>
          <input
            name="customerEmail"
            value={form.customerEmail}
            onChange={handleChange}
          />
        </td>

        <td>Address</td>
        <td>
          <input
            name="customerAddress"
            value={form.customerAddress}
            onChange={handleChange}
          />
        </td>
      </tr>
    </tbody>
  </table>

)}

        {/* ================= VEHICLE ================= */}
       <h3>Vehicle Information</h3>

{mode === "existing" ? (

  // EXISTING VEHICLE MODE
  <table className="jobcard-table">
    <tbody>
      <tr>
        <td>Select Vehicle</td>
        <td colSpan="3">
          <select
            name="vehicleId"
            value={form.vehicleId}
            onChange={handleChange}
          >
            <option value="">Choose vehicle</option>
            {vehicles
              .filter(v => !form.customerId || v.customerId === Number(form.customerId))
              .map((v) => (
                <option key={v.id} value={v.id}>
                  {v.model} - {v.vinNumber}
                </option>
              ))}
          </select>
        </td>
      </tr>
    </tbody>
  </table>

) : (

  // NEW VEHICLE MODE (FULL DETAILS)
  <table className="jobcard-table">
    <tbody>
      <tr>
        <td>VIN</td>
        <td>
          <input
            name="vin"
            value={form.vin}
            onChange={handleChange}
          />
        </td>

        <td>Vehicle Model</td>
        <td>
          <select
            name="vehicleModel"
            value={form.vehicleModel}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="C2">C2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="B3">B3</option>
          </select>
        </td>
      </tr>

      <tr>
        <td>Registration No</td>
        <td>
          <input
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={handleChange}
          />
        </td>

        <td>Battery No</td>
        <td>
          <input
            name="batteryNumber"
            value={form.batteryNumber}
            onChange={handleChange}
          />
        </td>
      </tr>

      <tr>
        <td>Motor No</td>
        <td>
          <input
            name="motorNumber"
            value={form.motorNumber}
            onChange={handleChange}
          />
        </td>

        <td>Charger No</td>
        <td>
          <input
            name="chargerNumber"
            value={form.chargerNumber}
            onChange={handleChange}
          />
        </td>
      </tr>

      <tr>
        <td>Warranty</td>
        <td>
          <input
            name="warrantyStatus"
            value={form.warrantyStatus}
            onChange={handleChange}
          />
        </td>

        <td>Remarks</td>
        <td>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
          />
        </td>
      </tr>
    </tbody>
  </table>

)}

        {mode === "existing" && (
  <>
    <h3>Vehicle Service-In Condition Checklist</h3>

<table className="jobcard-table checklist-table">
  <thead>
    <tr>
      <th>Component</th>
      <th>OK</th>
      <th>Repairable</th>
      <th>DAMAGED</th>
    </tr>
  </thead>

  <tbody>
    {[
      { key: "battery", label: "Battery" },
      { key: "brakes", label: "Brakes" },
      { key: "display", label: "Display" },
      { key: "body", label: "Body" },
      { key: "carrier", label: "Carrier" },
      { key: "chassis", label: "Chassis" },
      { key: "rust", label: "Rust" },
      { key: "wheels", label: "Wheels" },
      { key: "footBoard", label: "Foot Board" },
      { key: "allSwitchesFunction", label: "All Switches Function" },
      { key: "lightsAndIndicators", label: "Lights & Indicators" },
      { key: "solenoid", label: "Solenoid" },
      { key: "mudguards", label: "Mudguards" },
      { key: "charger", label: "Charger" },
    ].map((item) => (
      <tr key={item.key}>
        <td>{item.label}</td>

        {["OK", "Repairable", "DAMAGED"].map((status) => (
          <td key={status}>
            <label className="checklist-option">
              <input
                type="radio"
                name={item.key}
                value={status}
                checked={vehicleServiceInCondition[item.key] === status}
                onChange={() =>
                  handleConditionChange(item.key, status)
                }
              />
              <span className="checklist-option-label">{status}</span>
            </label>
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
  </>
)}

        {/* ================= ACTIONS ================= */}
        <div className="jobcard-actions">
  <button type="button" onClick={() => navigate(-1)}>
    Cancel
  </button>

  <button type="submit" className="admin-button-primary">
    Create Job Card
  </button>
</div>

      </form>
    </div>
  </div>
);
}