import client from "./api/client";
import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await client.post("/token/", form);

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      const meResponse = await client.get("/accounts/users/me/");
      const role = String(meResponse.data.role || "").toUpperCase();

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "SERVICE_ADVISOR") {
        navigate("/admin");
      } else if (role === "TECHNICIAN") {
        navigate("/technician");
      } else {
        navigate("/customer");
      }


    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 420 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Username</label>
          <input
            style={{ display: "block", width: "100%", padding: 8 }}
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            style={{ display: "block", width: "100%", padding: 8 }}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }

  return <button onClick={handleLogout}>Logout</button>;
}

async function getCurrentUser() {
  const response = await client.get("/accounts/users/me/");
  return response.data;
}

function RequireRole({ allowedRoles, children }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        const role = String(user.role || "").toUpperCase();

        if (allowedRoles.includes(role)) {
          setAllowed(true);
        } else {
          setAllowed(false);
          navigate("/login");
        }
      })
      .catch(() => {
        setAllowed(false);
        navigate("/login");
      });
  }, []);

  if (allowed === null) {
    return <p style={{ padding: 40 }}>Checking access...</p>;
  }

  if (!allowed) {
    return null;
  }

  return children;
}

function HomeBikeCard({ bike }) {
  const [selectedColor, setSelectedColor] = useState(bike.colors[0]);
  const navigate = useNavigate();

  return (
    <article className="home-bike-card">
      <div className="home-bike-image-wrap">
        <img src={selectedColor.image} alt={`${bike.name} ${bike.tagline}`} />
      </div>

      <div className="home-bike-content">
        <p className="home-bike-tagline">{bike.tagline}</p>
        <h3>{bike.name}</h3>
        <p className="home-bike-price">{bike.price}</p>

        <div className="home-color-row" aria-label={`${bike.name} colour options`}>
          {bike.colors.map((color) => (
            <button
              key={color.name}
              type="button"
              className={selectedColor.name === color.name ? "active" : ""}
              style={{ backgroundColor: color.value }}
              onClick={() => setSelectedColor(color)}
              title={color.name}
              aria-label={color.name}
            />
          ))}
        </div>

        <button
          type="button"
          className="home-outline-button"
          onClick={() => navigate(`/bike/${bike.id}`)}
        >
          Explore
        </button>
      </div>
    </article>
  );
}

function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const bikes = [
    {
      id: 1,
      name: "Flee",
      tagline: "Low-Speed",
      price: "Rs. 55,000 onwards",
      colors: [
        {
          name: "Default",
          value: "#444444",
          image: "/bikes/flee-low-speed/default.png",
        },
        {
          name: "Cyan",
          value: "#06B6D4",
          image: "/bikes/flee-low-speed/cyan.png",
        },
        {
          name: "Yellow",
          value: "#FACC15",
          image: "/bikes/flee-low-speed/yellow.png",
        },
        {
          name: "Orange",
          value: "#F97316",
          image: "/bikes/flee-low-speed/orange.png",
        },
      ],
    },
    {
      id: 2,
      name: "Flee",
      tagline: "High-Speed",
      price: "Rs. 65,000 onwards",
      colors: [
        {
          name: "Default",
          value: "#444444",
          image: "/bikes/flee-high-speed/default.png",
        },
        {
          name: "Cyan",
          value: "#06B6D4",
          image: "/bikes/flee-low-speed/cyan.png",
        },
        {
          name: "Yellow",
          value: "#FACC15",
          image: "/bikes/flee-low-speed/yellow.png",
        },
        {
          name: "Orange",
          value: "#F97316",
          image: "/bikes/flee-low-speed/orange.png",
        },
      ],
    },
  ];

  return (
    <div className="site-home">
      <header className="site-header">
        <Link to="/" className="site-logo" aria-label="Flee home">
          <img src="/logo.png" alt="Flee" />
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/slots-availability">Slots Availability</Link>
          <Link to="/test-ride">Book Test Ride</Link>
          <a href="#feedback">Feedback</a>
        </nav>

        <div className="home-login-menu">
          <button type="button" onClick={() => setLoginOpen(!loginOpen)}>
            Login
          </button>
          {loginOpen && (
            <div className="home-login-dropdown">
              <Link to="/login">Customer Login</Link>
              <Link to="/login">Staff Login</Link>
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="site-hero">
          <video
            className="site-hero-video"
            src="/assets/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="site-hero-shade" />
          <div className="site-hero-content">
            <p className="site-kicker">Electric mobility</p>
            <h1>FLEE</h1>
            <p>Smart. Stylish. Sustainable Mobility for the Future</p>
            <div className="home-hero-actions">
              <Link to="/test-ride" className="home-primary-link">
                Book Test Ride
              </Link>
              <a href="#bikes" className="home-secondary-link">
                View Bikes
              </a>
            </div>
          </div>
        </section>

        <section id="bikes" className="home-bikes-section">
          <div className="home-section-heading">
            <p className="site-kicker">Flee collection</p>
            <h2>Our Electric Bikes</h2>
            <p>
              Discover the next generation of urban mobility designed for
              performance and everyday convenience.
            </p>
          </div>

          <div className="home-bike-grid">
            {bikes.map((bike) => (
              <HomeBikeCard key={bike.id} bike={bike} />
            ))}
          </div>

          <div className="home-test-ride-band">
            <div>
              <h3>Ready to experience Flee?</h3>
              <p>Book a test ride and feel electric mobility in your city.</p>
            </div>
            <Link to="/test-ride" className="home-primary-link">
              Book Test Ride
            </Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <img src="/logo.png" alt="Flee" className="site-footer-logo" />
            <p>
              Professional vehicle service management system providing reliable
              and efficient service solutions.
            </p>
          </div>

          <div>
            <h4>Contact</h4>
            <p>3/2, Magrath Road</p>
            <p>Bengaluru - 560025</p>
            <p>Sales: +91 70199 08703</p>
            <p>Service: +91 82172 54248</p>
            <p>Mon - Sat, 9:00 AM - 7:00 PM</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <a href="https://ingoelectric.com/about/">About Us</a>
            <Link to="/test-ride">Book Test Ride</Link>
            <Link to="/login">Customer Login</Link>
            <Link to="/login">Staff Login</Link>
          </div>

          <div>
            <h4>Follow Us</h4>
            <a href="https://www.instagram.com/ingoelectric/">Instagram</a>
            <a href="https://www.facebook.com/inGOelectric/">Facebook</a>
            <a href="https://x.com/ingoelectric">X</a>
            <a href="https://www.linkedin.com/company/14494503/">LinkedIn</a>
            <a href="https://www.youtube.com/channel/UCmOL3sU645-OIChE4Do_e1g">
              YouTube
            </a>
          </div>

          <div>
            <h4>Policies</h4>
            <a href="https://ingoelectric.com/privacy-policy/">Privacy Policy</a>
            <a href="https://ingoelectric.com/terms-conditions/">
              Terms & Conditions
            </a>
          </div>
        </div>

        <p className="site-footer-bottom">
          © 2026 Service System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [jobCards, setJobCards] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [formByBooking, setFormByBooking] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBookings();
    loadJobCards();
    loadTechnicians();
  }, []);

  function loadBookings() {
    client
      .get("/service/bookings/")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }

  function loadJobCards() {
    client
      .get("/service/job-cards/")
      .then((res) => setJobCards(res.data))
      .catch((err) => console.error(err));
  }

  function loadTechnicians() {
    client
      .get("/accounts/users/")
      .then((res) => {
        const technicianUsers = res.data.filter(
          (user) =>
            user.role === "TECHNICIAN" ||
            user.role === "Technician" ||
            user.role === "technician"
        );
        setTechnicians(technicianUsers);
      })
      .catch((err) => console.error(err));
  }

  function updateJobCardForm(bookingId, field, value) {
    setFormByBooking({
      ...formByBooking,
      [bookingId]: {
        ...formByBooking[bookingId],
        [field]: value,
      },
    });
  }

  async function createJobCard(bookingId) {
    const form = formByBooking[bookingId] || {};

    try {
      await client.post(`/service/bookings/${bookingId}/create-job-card/`, {
        service_type: form.service_type || "COMPLAINT",
        service_in_datetime: form.service_in_datetime,
        assigned_technician: form.assigned_technician || null,
        remarks: form.remarks || "",
      });

      setMessage("Job card created successfully.");
      loadBookings();
      loadJobCards();
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage("Failed to create job card.");
    }
  }

  async function updatePartRequest(partId, action) {
  try {
    const response = await client.post(`/service/parts/${partId}/${action}/`);
    console.log("Part request updated:", response.data);

    setMessage("Spare part request updated.");
    loadJobCards();
  } catch (err) {
    console.error("Part request error:", err.response?.data || err);
    setMessage(
      err.response?.data?.detail || "Failed to update spare part request."
    );
  }
}

  return (
    <div className="role-page admin-page">
      <div className="role-hero">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Admin Dashboard</h1>
          <p>Manage bookings, job cards, inspections, work logs, and spare part approvals.</p>
        </div>
        <LogoutButton />
      </div>

      {message && <p>{message}</p>}

      <div className="section-title-row">
        <div>
          <p className="eyebrow">Service Lifecycle</p>
          <h2>Service Workflow</h2>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Booking</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Job Card</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const form = formByBooking[booking.id] || {};
              const linkedJobCard = jobCards.find(
                (jobCard) =>
                  Number(jobCard.service_booking) === Number(booking.id) ||
                  Number(jobCard.id) === Number(booking.job_card_id)
              );
              const displayJobCardNumber =
                linkedJobCard?.job_card_number || booking.job_card_number;

              return (
                <tr key={booking.id}>
                  <td>
                    <strong>SB-{booking.id}</strong>
                    <span>{booking.service_type}</span>
                    <span>{booking.vehicle_part || "-"}</span>
                  </td>
                  <td>{booking.customer_username || "-"}</td>
                  <td>
                    <strong>{booking.vehicle_model || "Vehicle not shown"}</strong>
                    <span>{booking.vehicle_vin || "-"}</span>
                  </td>
                  <td>
                    <strong>{booking.preferred_date || "-"}</strong>
                    <span>{booking.time_slot || "-"}</span>
                  </td>
                  <td><span className="status-pill">{booking.status}</span></td>
                  <td>
                    {displayJobCardNumber ? (
                      <span className="status-pill">
                        {displayJobCardNumber}
                      </span>
                    ) : (
                      <span>Not created</span>
                    )}
                  </td>
                  <td>
                    <details className="table-details">
                      <summary>Open</summary>
                      <div className="table-detail-panel">
                        <h4>Notes</h4>
                        <p>{booking.notes || "-"}</p>

                        {displayJobCardNumber ? (
                          <div className="admin-jobcard-detail">
                            <h4>Job Card</h4>
                            <div className="compact-grid">
                              <p>
                                <strong>{displayJobCardNumber}</strong>
                                <span>{linkedJobCard?.service_type || booking.service_type}</span>
                              </p>
                              <p>
                                <strong>Status</strong>
                                <span className="status-pill">
                                  {linkedJobCard?.status || "-"}
                                </span>
                              </p>
                              <p>
                                <strong>Technician</strong>
                                <span>{linkedJobCard?.assigned_technician_username || "-"}</span>
                              </p>
                              <p>
                                <strong>Readings</strong>
                                <span>
                                  {linkedJobCard?.odometer ?? "-"} km /{" "}
                                  {linkedJobCard?.battery_voltage ?? "-"} V
                                </span>
                              </p>
                              <p>
                                <strong>Closed At</strong>
                                <span>{linkedJobCard?.closed_at || "-"}</span>
                              </p>
                              <p>
                                <strong>Remarks</strong>
                                <span>{linkedJobCard?.remarks || "-"}</span>
                              </p>
                            </div>

                            <h4>Inspection</h4>
                            {linkedJobCard?.inspections?.length ? (
                              <div className="compact-grid">
                                {linkedJobCard.inspections.map((item) => (
                                  <p key={item.id}>
                                    <strong>{item.component_name}</strong>
                                    <span>{item.condition}</span>
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p>No inspection submitted.</p>
                            )}

                            <h4>Complaints, Work Logs, and Spare Parts</h4>
                            {linkedJobCard?.complaints?.length ? (
                              linkedJobCard.complaints.map((complaint) => (
                                <div key={complaint.id} className="nested-detail-card">
                                  <p>
                                    <strong>{complaint.category}</strong>: {complaint.description}
                                  </p>

                                  <h5>Work Logs</h5>
                                  {linkedJobCard.work_logs
                                    ?.filter((log) => log.complaint === complaint.id)
                                    .map((log) => (
                                      <div key={log.id} className="mini-row">
                                        <p>Task: {log.task_name}</p>
                                        <p>Description: {log.description || "-"}</p>
                                        <p>
                                          Status:{" "}
                                          <span className="status-pill">{log.status}</span>
                                        </p>
                                        <p>Technician: {log.technician_username || "-"}</p>
                                        <p>Completed at: {log.completed_at || "-"}</p>
                                      </div>
                                    ))}

                                  {!linkedJobCard.work_logs?.some(
                                    (log) => log.complaint === complaint.id
                                  ) && <p>No work logs for this complaint.</p>}

                                  <h5>Spare Part Requests</h5>
                                  {linkedJobCard.parts_replacements
                                    ?.filter((part) => part.complaint === complaint.id)
                                    .map((part) => (
                                      <div key={part.id} className="mini-row">
                                        <p>
                                          {part.part_name} x {part.quantity}{" "}
                                          <span className="status-pill">{part.status}</span>
                                        </p>
                                        <p>Part number: {part.part_number || "-"}</p>
                                        <p>Reason: {part.reason || "-"}</p>

                                        {part.status === "PENDING" && (
                                          <div className="table-actions">
                                            <button type="button" onClick={() => updatePartRequest(part.id, "approve")}>
                                              Approve
                                            </button>
                                            <button type="button" onClick={() => updatePartRequest(part.id, "reject")}>
                                              Reject
                                            </button>
                                          </div>
                                        )}

                                        {part.status === "APPROVED" && (
                                          <button type="button" onClick={() => updatePartRequest(part.id, "issue")}>
                                            Mark Issued
                                          </button>
                                        )}
                                      </div>
                                    ))}

                                  {!linkedJobCard.parts_replacements?.some(
                                    (part) => part.complaint === complaint.id
                                  ) && <p>No spare part requests for this complaint.</p>}
                                </div>
                              ))
                            ) : (
                              <p>No complaints attached.</p>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="admin-inline-form">
                              <h4>Create Job Card</h4>

                              <label>Service Type</label>
                              <select
                                value={form.service_type || "COMPLAINT"}
                                onChange={(e) =>
                                  updateJobCardForm(booking.id, "service_type", e.target.value)
                                }
                              >
                                <option value="GENERAL">General</option>
                                <option value="COMPLAINT">Complaint</option>
                                <option value="BATTERY">Battery</option>
                                <option value="CHARGER">Charger</option>
                                <option value="PAID_SERVICE_REPAIRABLE">Paid Service Repairable</option>
                                <option value="PAID_SERVICE_WARRANTY">Paid Service Warranty</option>
                                <option value="SPARES_DISPATCH">Spares Dispatch</option>
                              </select>

                              <label>Service In Date/Time</label>
                              <input
                                type="datetime-local"
                                value={form.service_in_datetime || ""}
                                onChange={(e) =>
                                  updateJobCardForm(booking.id, "service_in_datetime", e.target.value)
                                }
                                required
                              />

                              <label>Assigned Technician</label>
                              <select
                                value={form.assigned_technician || ""}
                                onChange={(e) =>
                                  updateJobCardForm(booking.id, "assigned_technician", e.target.value)
                                }
                              >
                                <option value="">Select technician</option>
                                {technicians.map((technician) => (
                                  <option key={technician.id} value={technician.id}>
                                    {technician.username}
                                  </option>
                                ))}
                              </select>

                              <label>Remarks</label>
                              <textarea
                                value={form.remarks || ""}
                                onChange={(e) =>
                                  updateJobCardForm(booking.id, "remarks", e.target.value)
                                }
                              />

                              <button type="button" onClick={() => createJobCard(booking.id)}>
                                Create Job Card
                              </button>
                            </div>

                            <h4>Complaints</h4>
                            {booking.complaints?.length ? (
                              booking.complaints.map((complaint) => (
                                <div key={complaint.id} className="nested-detail-card">
                                  <p>
                                    <strong>{complaint.category}</strong>: {complaint.description}
                                  </p>
                                  <h5>Work Logs</h5>
                                  <p>Create the job card before adding work logs.</p>
                                </div>
                              ))
                            ) : (
                              <p>No complaints added.</p>
                            )}
                          </>
                        )}
                      </div>
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function Technician() {
  const [jobCards, setJobCards] = useState([]);
  const [error, setError] = useState("");
  const [workLogForm, setWorkLogForm] = useState({});
  const [message, setMessage] = useState("");
  const [jobCardForm, setJobCardForm] = useState({});
  const [inspectionForm, setInspectionForm] = useState({});
  const [partForm, setPartForm] = useState({});
  const [activeSection, setActiveSection] = useState("active");
  const [selectedJobCardId, setSelectedJobCardId] = useState(null);
  


  const inspectionComponents = [
    "Battery",
    "Brakes",
    "Display",
    "Body",
    "Carrier",
    "Chassis",
    "Rust",
    "Wheels",
    "Foot Board",
    "All Switches Function",
    "Lights & Indicators",
    "Solenoid",
    "Mudguards",
    "Charger",
  ];




  useEffect(() => {
    loadJobCards();
  }, []);

  function loadJobCards() {
    client
      .get("/service/job-cards/")
      .then((res) => setJobCards(res.data))
      .catch((err) => {
        console.error(err);
        setError("Could not load assigned job cards.");
      });
  }

  function updateWorkLogForm(complaintId, value) {
    setWorkLogForm({
      ...workLogForm,
      [complaintId]: value,
    });
  }

  async function addWorkLog(jobCardId, complaintId) {
  const description = workLogForm[complaintId];

  if (!description || !description.trim()) {
    setMessage("Please enter work description.");
    return;
  }

  try {
    await client.post("/service/work-logs/", {
      job_card: jobCardId,
      complaint: complaintId,
      task_name: "Complaint Work",
      description: description,
    });

    setMessage("Work log added.");
    setWorkLogForm({
      ...workLogForm,
      [complaintId]: "",
    });

    loadJobCards();
  } catch (err) {
    console.error(err.response?.data || err);
    setMessage("Failed to add work log.");
  }
}


  async function closeJobCard(jobCardId) {
  const confirmed = window.confirm(
    "Are you sure you want to close this job card? You cannot edit it after closing."
  );

  if (!confirmed) {
    return;
  }

  try {
    await client.post(`/service/job-cards/${jobCardId}/close/`);
    setMessage("Job card closed.");
    loadJobCards();
  } catch (err) {
    console.error(err.response?.data || err);
    setMessage("Failed to close job card.");
  }
}

  function updateJobCardForm(jobCardId, field, value) {
  setJobCardForm({
    ...jobCardForm,
    [jobCardId]: {
      ...jobCardForm[jobCardId],
      [field]: value,
    },
  });
}

async function updateJobCardReadings(jobCard) {
  const form = jobCardForm[jobCard.id] || {};
  const odometer = form.odometer;
  const batteryVoltage = form.battery_voltage;

  if (odometer === undefined || odometer === "" || batteryVoltage === undefined || batteryVoltage === "") {
    setMessage("Please enter odometer and battery voltage.");
    return;
  }

  if (Number(odometer) < 0) {
    setMessage("Odometer cannot be negative.");
    return;
  }

  if (Number(batteryVoltage) <= 0) {
    setMessage("Battery voltage must be greater than zero.");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to save these readings? You cannot edit them after submitting."
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await client.post(`/service/job-cards/${jobCard.id}/save-readings/`, {
      odometer: Number(odometer),
      battery_voltage: Number(batteryVoltage),
    });

    setMessage("Job card readings updated.");
    setJobCards((currentJobCards) =>
      currentJobCards.map((item) =>
        item.id === jobCard.id ? response.data : item
      )
    );
    setJobCardForm({
      ...jobCardForm,
      [jobCard.id]: {
        odometer: "",
        battery_voltage: "",
      },
    });
    loadJobCards();
  } catch (err) {
    console.error(err.response?.data || err);
    setMessage(
      err.response?.data?.detail || "Failed to update job card readings."
    );
  }
}
  function updateInspectionForm(jobCardId, component, condition) {
  setInspectionForm({
    ...inspectionForm,
    [jobCardId]: {
      ...inspectionForm[jobCardId],
      [component]: condition,
    },
  });
}

async function submitInspection(jobCardId) {
  const form = inspectionForm[jobCardId] || {};




  try {
    await Promise.all(
      inspectionComponents.map((component) =>
        client.post("/service/inspections/", {
          job_card: jobCardId,
          component_name: component,
          condition: form[component] || "OK",
        })
      )
    );

    setMessage("Inspection saved.");
    loadJobCards();
  } catch (err) {
    console.error(err.response?.data || err);
    setMessage("Failed to save inspection.");
  }
}
  

  function updatePartForm(key, field, value) {
  setPartForm({
    ...partForm,
    [key]: {
      ...partForm[key],
      [field]: value,
    },
  });
}

async function submitPartRequest(jobCardId, complaintId) {
  const key = `${jobCardId}-${complaintId}`;
  const form = partForm[key] || {};

  if (!form.part_name || !form.part_name.trim()) {
    setMessage("Please enter part name.");
    return;
  }

  try {
    await client.post("/service/parts/", {
      job_card: jobCardId,
      complaint: complaintId,
      part_name: form.part_name,
      part_number: form.part_number || "",
      quantity: form.quantity || 1,
      reason: form.reason || "",
      status: "PENDING",
    });

    setMessage("Spare part request submitted.");

    setPartForm({
      ...partForm,
      [key]: {
        part_name: "",
        part_number: "",
        quantity: 1,
        reason: "",
      },
    });

    loadJobCards();
  } catch (err) {
    console.error(err.response?.data || err);
    setMessage("Failed to submit spare part request.");
  }
}
    async function completeWorkLog(workLogId) {
  const confirmed = window.confirm(
    "Are you sure you want to mark this work log as completed?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await client.post(`/service/work-logs/${workLogId}/complete/`);
    setMessage("Work log completed.");
    loadJobCards();
  } catch (err) {
    console.error(err.response?.data || err);
    setMessage("Failed to complete work log.");
  }
}

  return (
    <div className="role-page technician-page">
      <div className="role-hero">
        <div>
          <p className="eyebrow">Workshop</p>
          <h1>Technician Dashboard</h1>
          <p>Complete readings, inspection, work logs, and spare requests before closing a job card.</p>
        </div>
        <LogoutButton />
      </div>

      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="dashboard-tabs">
        <button
          type="button"
          className={activeSection === "active" ? "active" : ""}
          onClick={() => setActiveSection("active")}
        >
          Active Jobs
        </button>
        <button
          type="button"
          className={activeSection === "closed" ? "active" : ""}
          onClick={() => setActiveSection("closed")}
        >
          Closed Jobs
        </button>
      </div>

      <div className="section-title-row">
        <div>
          <p className="eyebrow">Assigned Work</p>
          <h2>{activeSection === "closed" ? "Closed Job Cards" : "Active Job Cards"}</h2>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Job Card</th>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Readings</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobCards
              .filter((jobCard) =>
                activeSection === "closed"
                  ? jobCard.status === "CLOSED"
                  : jobCard.status !== "CLOSED"
              )
              .map((jobCard) => (
                <tr key={jobCard.id}>
                  <td><strong>{jobCard.job_card_number}</strong></td>
                  <td>{jobCard.vehicle_vin || "-"}</td>
                  <td>{jobCard.customer_username || "-"}</td>
                  <td>{jobCard.service_type}</td>
                  <td>
                    <strong>{jobCard.odometer ?? "-"} km</strong>
                    <span>{jobCard.battery_voltage ?? "-"} V</span>
                  </td>
                  <td><span className="status-pill">{jobCard.status}</span></td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setSelectedJobCardId(jobCard.id)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!selectedJobCardId && (
        <p className="empty-state">Select a job card from the table to open readings, inspection, work logs, and spare requests.</p>
      )}

      {jobCards
        .filter((jobCard) =>
          selectedJobCardId
            ? jobCard.id === selectedJobCardId
            : false
        )
        .map((jobCard) => (
        <div
          key={jobCard.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginTop: 12,
            borderRadius: 8,
          }}
        >
          <h3>{jobCard.job_card_number}</h3>
          <p>Service type: {jobCard.service_type}</p>
          <p>Status: {jobCard.status}</p>
          <p>Vehicle: {jobCard.vehicle_vin}</p>
          <p>Customer: {jobCard.customer_username}</p>
          <p>Service in: {jobCard.service_in_datetime}</p>
          <p>Odometer: {jobCard.odometer || "Not entered"}</p>
          <p>Battery voltage: {jobCard.battery_voltage || "Not entered"}</p>
          <h4>Technician Readings</h4>

{jobCard.odometer !== null &&
jobCard.odometer !== undefined &&
jobCard.battery_voltage !== null &&
jobCard.battery_voltage !== undefined ? (

  <p>Readings already saved.</p>
) : jobCard.status === "CLOSED" ? (
  <p>Job card is closed. Readings cannot be edited.</p>
) : (
  <>
    <label>Odometer</label>
    <input
      type="number"
      min="0"
      value={jobCardForm[jobCard.id]?.odometer ?? ""}
      onChange={(e) =>
        updateJobCardForm(jobCard.id, "odometer", e.target.value)
      }
    />

    <br />
    <br />

    <label>Battery Voltage</label>
    <input
      type="number"
      min="0.01"
      step="0.01"
      value={jobCardForm[jobCard.id]?.battery_voltage ?? ""}
      onChange={(e) =>
        updateJobCardForm(jobCard.id, "battery_voltage", e.target.value)
      }
    />

    <br />
    <br />

    <button type="button" onClick={() => updateJobCardReadings(jobCard)}>
      Save Readings
    </button>
  </>
)}
      <h4>Vehicle Inspection</h4>

{jobCard.inspections?.length > 0 ? (
  <p>Inspection already submitted.</p>
) : jobCard.status === "CLOSED" ? (
  <p>Job card is closed. Inspection cannot be edited.</p>
) : (
  <>
    {inspectionComponents.map((component) => (
      <div key={component}>
        <label>{component}</label>
        <select
          value={inspectionForm[jobCard.id]?.[component] || "OK"}
          onChange={(e) =>
            updateInspectionForm(jobCard.id, component, e.target.value)
          }
        >
          <option value="OK">OK</option>
          <option value="REPAIRABLE">Repairable</option>
          <option value="DAMAGED">Damaged</option>
        </select>
      </div>
    ))}

    <br />

    <button type="button" onClick={() => submitInspection(jobCard.id)}>
      Save Inspection
    </button>
  </>
)}



          <p>Remarks: {jobCard.remarks}</p>

          {jobCard.status === "CLOSED" ? (
          <p>Closed at: {jobCard.closed_at}</p>
          ) : jobCard.inspections?.length > 0 &&
          jobCard.work_logs?.some((log) => log.status === "COMPLETED") &&
          !jobCard.parts_replacements?.some(
            (part) => part.status === "PENDING" || part.status === "APPROVED"
          ) ? (
          <button type="button" onClick={() => closeJobCard(jobCard.id)}>
            Close Job Card
          </button>
          ) : (
          <p>
            Complete inspection, complete at least one work log, and resolve all spare part
requests before closing this job card.

          </p>
          )}



<h4>Complaints</h4>

{jobCard.complaints?.length ? (
  jobCard.complaints.map((complaint) => (
    <div
      key={complaint.id}
      style={{
        border: "1px solid #eee",
        padding: 12,
        marginTop: 8,
        borderRadius: 8,
      }}
    >
      <p>Category: {complaint.category}</p>
      <p>Description: {complaint.description}</p>
      <p>Work type: {complaint.work_type}</p>

      {jobCard.status === "CLOSED" ? (
      <p>Job card is closed. Work logs cannot be added.</p>
    ) : (
      <>
        <textarea
          placeholder="Write work done for this complaint"
          value={workLogForm[complaint.id] || ""}
          onChange={(e) =>
            updateWorkLogForm(complaint.id, e.target.value)
          }
        />

        <br />

        <button
          type="button"
          onClick={() => addWorkLog(jobCard.id, complaint.id)}
        >
          Add Work Log
        </button>
      </>
    )}

    <h5>Work Logs</h5>

{jobCard.work_logs
  ?.filter((log) => log.complaint === complaint.id)
  .map((log) => (
    <div
      key={log.id}
      style={{
        border: "1px solid #ddd",
        padding: 8,
        marginTop: 8,
        borderRadius: 6,
      }}
    >
      <p>Task: {log.task_name}</p>
      <p>Description: {log.description || "-"}</p>
      <p>Status: {log.status}</p>
      <p>Completed at: {log.completed_at || "-"}</p>

      {jobCard.status !== "CLOSED" && log.status !== "COMPLETED" && (
        <button type="button" onClick={() => completeWorkLog(log.id)}>
          Complete Work Log
        </button>
      )}
    </div>
  ))}

{!jobCard.work_logs?.some((log) => log.complaint === complaint.id) && (
  <p>No work logs added yet.</p>
)}


    <h5>Spare Part Requests</h5>

{jobCard.parts_replacements
  ?.filter((part) => part.complaint === complaint.id)
  .map((part) => (
    <div
      key={part.id}
      style={{
        border: "1px solid #ddd",
        padding: 8,
        marginTop: 8,
        borderRadius: 6,
      }}
    >
      <p>
        {part.part_name} x {part.quantity} - {part.status}
      </p>
      <p>Part number: {part.part_number || "-"}</p>
      <p>Reason: {part.reason || "-"}</p>
    </div>
  ))}

{jobCard.status === "CLOSED" ? (
  <p>Job card is closed. Spare parts cannot be requested.</p>
) : (
  <>
    <label>Part Name</label>
    <input
      value={partForm[`${jobCard.id}-${complaint.id}`]?.part_name || ""}
      onChange={(e) =>
        updatePartForm(
          `${jobCard.id}-${complaint.id}`,
          "part_name",
          e.target.value
        )
      }
    />

    <br />
    <br />

    <label>Part Number</label>
    <input
      value={partForm[`${jobCard.id}-${complaint.id}`]?.part_number || ""}
      onChange={(e) =>
        updatePartForm(
          `${jobCard.id}-${complaint.id}`,
          "part_number",
          e.target.value
        )
      }
    />

    <br />
    <br />

    <label>Quantity</label>
    <input
      type="number"
      min="1"
      value={partForm[`${jobCard.id}-${complaint.id}`]?.quantity || 1}
      onChange={(e) =>
        updatePartForm(
          `${jobCard.id}-${complaint.id}`,
          "quantity",
          e.target.value
        )
      }
    />

    <br />
    <br />

    <label>Reason</label>
    <textarea
      value={partForm[`${jobCard.id}-${complaint.id}`]?.reason || ""}
      onChange={(e) =>
        updatePartForm(
          `${jobCard.id}-${complaint.id}`,
          "reason",
          e.target.value
        )
      }
    />

    <br />
    <br />

    <button
      type="button"
      onClick={() => submitPartRequest(jobCard.id, complaint.id)}
    >
      Submit Spare Part Request
    </button>
  </>
)}



    </div>
  ))
) : (
  <p>No complaints attached to this job card.</p>
)}


        </div>
      ))}
    </div>
  );
}


function Customer() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [jobCards, setJobCards] = useState([]);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("vehicles");

  useEffect(() => {
    client
      .get("/service/bookings/")
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error(err);
      });

    client
      .get("/vehicles/")
      .then((res) => setVehicles(res.data))
      .catch((err) => {
        console.error(err);
        setError(
          "Could not load vehicles. Make sure Django server is running and you are logged in."
        );
      });

    client
      .get("/service/job-cards/")
      .then((res) => setJobCards(res.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="role-page customer-page">
      <div className="role-hero">
        <div>
          <p className="eyebrow">Owner Portal</p>
          <h1>Customer Dashboard</h1>
          <p>Track your scooty, bookings, job cards, repairs, and service history from one place.</p>
        </div>
        <div className="hero-actions">
          <Link to="/book-service" className="button-link">Book Service</Link>
          <LogoutButton />
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          type="button"
          className={activeSection === "vehicles" ? "active" : ""}
          onClick={() => setActiveSection("vehicles")}
        >
          Vehicles
        </button>
        <button
          type="button"
          className={activeSection === "workflow" ? "active" : ""}
          onClick={() => setActiveSection("workflow")}
        >
          Service Workflow
        </button>
      </div>

      {activeSection === "vehicles" && (
        <>
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Garage</p>
          <h2>Your Registered Scooties</h2>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginTop: 12,
            borderRadius: 8,
          }}
        >
          <h3>{vehicle.model}</h3>
          <p>VIN: {vehicle.vin_number}</p>
          <p>Registration: {vehicle.registration_number}</p>
          <p>Battery: {vehicle.battery_number}</p>
          <p>Motor: {vehicle.motor_number}</p>
          <p>Warranty: {vehicle.warranty_status}</p>
        </div>
      ))}
        </>
      )}

      {activeSection === "workflow" && (
        <>
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Service Lifecycle</p>
          <h2>Service Workflow</h2>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Booking</th>
              <th>Vehicle</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Job Card</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const linkedJobCard = jobCards.find(
                (jobCard) =>
                  Number(jobCard.service_booking) === Number(booking.id) ||
                  Number(jobCard.id) === Number(booking.job_card_id)
              );
              const displayJobCardNumber =
                linkedJobCard?.job_card_number || booking.job_card_number;

              return (
                <tr key={booking.id}>
                  <td>
                    <strong>SB-{booking.id}</strong>
                    <span>{booking.service_type}</span>
                    <span>{booking.vehicle_part || "-"}</span>
                  </td>
                  <td>
                    <strong>{booking.vehicle_model || "Vehicle not shown"}</strong>
                    <span>{booking.vehicle_vin || "-"}</span>
                  </td>
                  <td>
                    <strong>{booking.preferred_date}</strong>
                    <span>{booking.time_slot || "-"}</span>
                  </td>
                  <td><span className="status-pill">{booking.status}</span></td>
                  <td>
                    {displayJobCardNumber ? (
                      <span className="status-pill">{displayJobCardNumber}</span>
                    ) : (
                      <span>Not created</span>
                    )}
                  </td>
                  <td>
                    <details className="table-details">
                      <summary>Open</summary>
                      <div className="table-detail-panel">
                        <h4>Booking Details</h4>
                        <div className="compact-grid">
                          <p>
                            <strong>Booking</strong>
                            <span>SB-{booking.id}</span>
                          </p>
                          <p>
                            <strong>Status</strong>
                            <span className="status-pill">{booking.status}</span>
                          </p>
                          <p>
                            <strong>Service</strong>
                            <span>{booking.service_type}</span>
                          </p>
                          <p>
                            <strong>Part</strong>
                            <span>{booking.vehicle_part || "-"}</span>
                          </p>
                          <p>
                            <strong>Schedule</strong>
                            <span>{booking.preferred_date || "-"} / {booking.time_slot || "-"}</span>
                          </p>
                          <p>
                            <strong>Notes</strong>
                            <span>{booking.notes || "-"}</span>
                          </p>
                        </div>

                        {displayJobCardNumber ? (
                          <div className="admin-jobcard-detail">
                            <h4>Job Card</h4>
                            <div className="compact-grid">
                              <p>
                                <strong>{displayJobCardNumber}</strong>
                                <span>{linkedJobCard?.service_type || booking.service_type}</span>
                              </p>
                              <p>
                                <strong>Status</strong>
                                <span className="status-pill">{linkedJobCard?.status || "-"}</span>
                              </p>
                              <p>
                                <strong>Technician</strong>
                                <span>{linkedJobCard?.assigned_technician_username || "-"}</span>
                              </p>
                              <p>
                                <strong>Readings</strong>
                                <span>
                                  {linkedJobCard?.odometer ?? "-"} km /{" "}
                                  {linkedJobCard?.battery_voltage ?? "-"} V
                                </span>
                              </p>
                              <p>
                                <strong>Closed At</strong>
                                <span>{linkedJobCard?.closed_at || "-"}</span>
                              </p>
                              <p>
                                <strong>Remarks</strong>
                                <span>{linkedJobCard?.remarks || "-"}</span>
                              </p>
                            </div>

                            <h4>Inspection</h4>
                            {linkedJobCard?.inspections?.length ? (
                              <div className="compact-grid">
                                {linkedJobCard.inspections.map((item) => (
                                  <p key={item.id}>
                                    <strong>{item.component_name}</strong>
                                    <span>{item.condition}</span>
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p>No inspection submitted.</p>
                            )}

                            <h4>Complaints, Work Logs, and Spare Parts</h4>
                            {linkedJobCard?.complaints?.length ? (
                              linkedJobCard.complaints.map((complaint) => (
                                <div key={complaint.id} className="nested-detail-card">
                                  <p>
                                    <strong>{complaint.category}</strong>: {complaint.description}
                                  </p>

                                  <h5>Work Logs</h5>
                                  {linkedJobCard.work_logs
                                    ?.filter((log) => log.complaint === complaint.id)
                                    .map((log) => (
                                      <div key={log.id} className="mini-row">
                                        <p>Task: {log.task_name}</p>
                                        <p>Description: {log.description || "-"}</p>
                                        <p>
                                          Status: <span className="status-pill">{log.status}</span>
                                        </p>
                                        <p>Technician: {log.technician_username || "-"}</p>
                                        <p>Completed at: {log.completed_at || "-"}</p>
                                      </div>
                                    ))}

                                  {!linkedJobCard.work_logs?.some(
                                    (log) => log.complaint === complaint.id
                                  ) && <p>No work logs for this complaint.</p>}

                                  <h5>Spare Part Requests</h5>
                                  {linkedJobCard.parts_replacements
                                    ?.filter((part) => part.complaint === complaint.id)
                                    .map((part) => (
                                      <div key={part.id} className="mini-row">
                                        <p>
                                          {part.part_name} x {part.quantity}{" "}
                                          <span className="status-pill">{part.status}</span>
                                        </p>
                                        <p>Part number: {part.part_number || "-"}</p>
                                        <p>Reason: {part.reason || "-"}</p>
                                      </div>
                                    ))}

                                  {!linkedJobCard.parts_replacements?.some(
                                    (part) => part.complaint === complaint.id
                                  ) && <p>No spare part requests for this complaint.</p>}
                                </div>
                              ))
                            ) : (
                              <p>No complaints attached.</p>
                            )}

                            <div className="table-actions customer-workflow-actions">
                              <Link className="table-action" to={`/customer/job-card/${linkedJobCard.id}`}>
                                Full View
                              </Link>
                              <Link className="table-action secondary" to={`/customer/raise-complaint/${linkedJobCard.id}`}>
                                Raise Complaint
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4>Complaints</h4>
                            {booking.complaints?.length ? (
                              booking.complaints.map((complaint) => (
                                <div key={complaint.id} className="nested-detail-card">
                                  <p>
                                    <strong>{complaint.category}</strong>: {complaint.description}
                                  </p>
                                  <h5>Work Logs</h5>
                                  <p>Work logs will appear after the job card is created.</p>
                                </div>
                              ))
                            ) : (
                              <p>No complaints added.</p>
                            )}
                          </>
                        )}
                      </div>
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
}

function CustomerBookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [jobCard, setJobCard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get(`/service/bookings/${bookingId}/`)
      .then((res) => {
        setBooking(res.data);

        if (res.data.job_card_id) {
          client
            .get(`/service/job-cards/${res.data.job_card_id}/`)
            .then((jobRes) => setJobCard(jobRes.data))
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load booking details.");
      });
  }, [bookingId]);

  if (error) {
    return <p style={{ padding: 40, color: "red" }}>{error}</p>;
  }

  if (!booking) {
    return <p style={{ padding: 40 }}>Loading booking details...</p>;
  }

  const workLogs = jobCard?.work_logs || [];

  return (
    <div style={{ padding: 40 }}>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>

      <h1>Service Work Details</h1>
      <p>Status: {booking.status}</p>
      <p>Service type: {booking.service_type}</p>
      <p>Vehicle part: {booking.vehicle_part}</p>
      <p>Date: {booking.preferred_date}</p>
      <p>Time slot: {booking.time_slot}</p>
      <p>
        Vehicle: {booking.vehicle_model || "Vehicle not shown"}{" "}
        {booking.vehicle_vin ? `- ${booking.vehicle_vin}` : ""}
      </p>
      <p>
        Technician:{" "}
        {jobCard?.assigned_technician_username || "Not assigned yet"}
      </p>

      <h2>Work Timeline</h2>

      {workLogs.length ? (
        workLogs.map((log) => (
          <div
            key={log.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
            }}
          >
            <p>Task: {log.task_name}</p>
            <p>Technician: {log.technician_username || "-"}</p>
            <p>Description: {log.description || "-"}</p>
            <p>Status: {log.status}</p>
            <p>Started: {log.started_at || log.created_at || "-"}</p>
            <p>Completed: {log.completed_at || "-"}</p>
          </div>
        ))
      ) : (
        <p>Work has not started yet.</p>
      )}

      {jobCard && (
        <p>
          <Link to={`/customer/job-card/${jobCard.id}`}>Open job card</Link>
        </p>
      )}
    </div>
  );
}

function CustomerJobCardDetail() {
  const { jobCardId } = useParams();
  const navigate = useNavigate();
  const [jobCard, setJobCard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get(`/service/job-cards/${jobCardId}/`)
      .then((res) => setJobCard(res.data))
      .catch((err) => {
        console.error(err);
        setError("Could not load job card.");
      });
  }, [jobCardId]);

  if (error) {
    return <p style={{ padding: 40, color: "red" }}>{error}</p>;
  }

  if (!jobCard) {
    return <p style={{ padding: 40 }}>Loading job card...</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>

      <h1>Job Card {jobCard.job_card_number}</h1>
      <p>Status: {jobCard.status}</p>
      <p>Service type: {jobCard.service_type}</p>
      <p>Service in: {jobCard.service_in_datetime}</p>
      <p>Vehicle: {jobCard.vehicle_vin || "-"}</p>
      <p>Customer: {jobCard.customer_username || "-"}</p>
      <p>Technician: {jobCard.assigned_technician_username || "-"}</p>
      <p>Odometer: {jobCard.odometer ?? "-"}</p>
      <p>Battery voltage: {jobCard.battery_voltage ?? "-"}</p>
      <p>Closed at: {jobCard.closed_at || "-"}</p>

      <h2>Complaints</h2>
      {jobCard.complaints?.length ? (
        jobCard.complaints.map((complaint) => (
          <div
            key={complaint.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
            }}
          >
            <p>Category: {complaint.category}</p>
            <p>Description: {complaint.description}</p>
            <p>Work type: {complaint.work_type}</p>
          </div>
        ))
      ) : (
        <p>No complaints attached.</p>
      )}

      <h2>Inspection</h2>
      {jobCard.inspections?.length ? (
        jobCard.inspections.map((inspection) => (
          <p key={inspection.id}>
            {inspection.component_name}: {inspection.condition}
          </p>
        ))
      ) : (
        <p>No inspection submitted.</p>
      )}

      <h2>Work Logs</h2>
      {jobCard.work_logs?.length ? (
        jobCard.work_logs.map((log) => (
          <div
            key={log.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
            }}
          >
            <p>Task: {log.task_name}</p>
            <p>Description: {log.description || "-"}</p>
            <p>Status: {log.status}</p>
            <p>Technician: {log.technician_username || "-"}</p>
            <p>Completed at: {log.completed_at || "-"}</p>
          </div>
        ))
      ) : (
        <p>No work logs added.</p>
      )}

      <h2>Spare Part Requests</h2>
      {jobCard.parts_replacements?.length ? (
        jobCard.parts_replacements.map((part) => (
          <div
            key={part.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginTop: 8,
              borderRadius: 8,
            }}
          >
            <p>
              {part.part_name} x {part.quantity} - {part.status}
            </p>
            <p>Part number: {part.part_number || "-"}</p>
            <p>Reason: {part.reason || "-"}</p>
          </div>
        ))
      ) : (
        <p>No spare part requests.</p>
      )}

      <p>
        <Link to={`/customer/raise-complaint/${jobCard.id}`}>
          Raise complaint
        </Link>
      </p>
    </div>
  );
}

function CustomerRaiseComplaint() {
  const { jobCardId } = useParams();
  const navigate = useNavigate();
  const [jobCard, setJobCard] = useState(null);
  const [form, setForm] = useState({
    category: "Battery",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    client
      .get(`/service/job-cards/${jobCardId}/`)
      .then((res) => setJobCard(res.data))
      .catch((err) => {
        console.error(err);
        setMessage("Could not load job card.");
      });
  }, [jobCardId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.description.trim()) {
      setMessage("Please enter complaint description.");
      return;
    }

    try {
      await client.post("/service/complaints/", {
        category: form.category,
        description: form.description,
        work_type: "COMPLAINT",
        service_booking: jobCard?.service_booking || null,
        job_card: jobCardId,
      });

      navigate(`/customer/job-card/${jobCardId}`);
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage("Failed to raise complaint.");
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <h1>Raise Complaint</h1>

      {jobCard && (
        <p>
          Job card: {jobCard.job_card_number} - {jobCard.vehicle_vin || "-"}
        </p>
      )}

      {message && <p style={{ color: "red" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Complaint Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="Battery">Battery</option>
          <option value="Charger">Charger</option>
          <option value="Brakes">Brakes</option>
          <option value="Suspension">Suspension</option>
          <option value="Electronics">Electronics</option>
          <option value="Display">Display</option>
          <option value="Power">Power</option>
          <option value="Others">Others</option>
        </select>

        <br />
        <br />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <br />
        <br />

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
}


function BookService() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({
    vehicle: "",
    vehicle_part: "BATTERY",
    service_type: "COMPLAINT",
    preferred_date: "",
    time_slot: "10:30-12 PM",
    notes: "",
  });

  useEffect(() => {
    client
      .get("/vehicles/")
      .then((res) => {
        setVehicles(res.data);

        if (res.data.length > 0) {
          setForm((prev) => ({
            ...prev,
            vehicle: res.data[0].id,
          }));
        }
      })
      .catch((err) => console.error(err));
  }, []);



  const [complaints, setComplaints] = useState([
  {
    category: "Battery",
    description: "",
  },
]);

  function updateComplaint(index, field, value) {
    const updated = [...complaints];
    updated[index][field] = value;
    setComplaints(updated);
  }

  function addComplaint() {
  setComplaints([
    ...complaints,
    {
      category: "Battery",
      description: "",
    },
  ]);
}


  function removeComplaint(index) {
    setComplaints(complaints.filter((_, i) => i !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const bookingResponse = await client.post("/service/bookings/", form);
      const booking = bookingResponse.data;

      const validComplaints = complaints.filter((item) =>
        item.description.trim()
      );

      await Promise.all(
        validComplaints.map((complaint) =>
          client.post("/service/complaints/", {
          ...complaint,
          work_type: "COMPLAINT",
          service_booking: booking.id,
          job_card: null,
})

        )
      );

      alert("Service booking created");
      navigate("/customer");
    } catch (err) {
      console.error(err);
      alert("Failed to create booking");
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <h1>Book Service</h1>

      <form onSubmit={handleSubmit}>
        <label>Vehicle Part</label>
        <select
          value={form.vehicle_part}
          onChange={(e) => setForm({ ...form, vehicle_part: e.target.value })}
        >
          <option value="BATTERY">Battery</option>
          <option value="BRAKES">Brakes</option>
          <option value="DISPLAY">Display</option>
          <option value="BODY">Body</option>
          <option value="CARRIER">Carrier</option>
          <option value="CHASSIS">Chassis</option>
          <option value="RUST">Rust</option>
          <option value="WHEELS">Wheels</option>
          <option value="FOOT_BOARD">Foot Board</option>
          <option value="SWITCHES">All Switches</option>
          <option value="LIGHTS">Lights & Indicators</option>
          <option value="SOLENOID">Solenoid</option>
          <option value="MUDGUARDS">Mudguards</option>
          <option value="CHARGER">Charger</option>
        </select>

        <br /><br />

        <label>Service Type</label>
        <select
          value={form.service_type}
          onChange={(e) => setForm({ ...form, service_type: e.target.value })}
        >
          <option value="GENERAL">General</option>
          <option value="COMPLAINT">Complaint</option>
          <option value="BATTERY">Battery</option>
          <option value="CHARGER">Charger</option>
          <option value="PAID_SERVICE_REPAIRABLE">Paid Service Repairable</option>
          <option value="PAID_SERVICE_WARRANTY">Paid Service Warranty</option>
          <option value="SPARES_DISPATCH">Spares Dispatch</option>
        </select>

        <br /><br />

        <label>Preferred Date</label>
        <input
          type="datetime-local"
          value={form.preferred_date}
          onChange={(e) =>
            setForm({ ...form, preferred_date: e.target.value })
          }
          required
        />

        <br /><br />

        <label>Vehicle</label>
<select
  value={form.vehicle}
  onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
  required
>
  <option value="">Select vehicle</option>
  {vehicles.map((vehicle) => (
    <option key={vehicle.id} value={vehicle.id}>
      {vehicle.model} - {vehicle.vin_number}
    </option>
  ))}
</select>

<br /><br />


        <label>Time Slot</label>
        <select
          value={form.time_slot}
          onChange={(e) => setForm({ ...form, time_slot: e.target.value })}
        >
          <option value="10:30-12 PM">10:30-12 PM</option>
          <option value="2-3 PM">2-3 PM</option>
          <option value="3-5 PM">3-5 PM</option>
        </select>

        <br /><br />

        <label>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <h2>Complaints</h2>

        {complaints.map((complaint, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginTop: 12,
              borderRadius: 8,
            }}
          >
            <label>Category</label>
            <select
              value={complaint.category}
              onChange={(e) =>
                updateComplaint(index, "category", e.target.value)
              }
            >
              <option value="Battery">Battery</option>
              <option value="Brakes">Brakes</option>
              <option value="Suspension">Suspension</option>
              <option value="Charger">Charger</option>
              <option value="Electronics">Electronics</option>
              <option value="Display">Display</option>
              <option value="Power">Power</option>
              <option value="Others">Others</option>
            </select>

            <br /><br />


            <label>Description</label>
            <textarea
              value={complaint.description}
              onChange={(e) =>
                updateComplaint(index, "description", e.target.value)
              }
              placeholder="Describe the issue"
            />

            <br />

            {complaints.length > 1 && (
              <button type="button" onClick={() => removeComplaint(index)}>
                Remove Complaint
              </button>
            )}
          </div>
        ))}

        <br />

        <button type="button" onClick={addComplaint}>
          Add Complaint
        </button>

        <br /><br />

        <button type="submit">Submit Booking</button>
      </form>
    </div>
  );
}

function PublicPageHeader() {
  return (
    <header className="public-page-header">
      <Link to="/" className="public-page-logo">
        <img src="/logo.png" alt="Flee" />
      </Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/slots-availability">Slots Availability</Link>
        <Link to="/test-ride">Book Test Ride</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}

function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const bikes = {
    1: {
      name: "Flee Low-Speed",
      shortName: "Flee-low-speed",
      subtitle: "Designed for modern city commuting",
      image: "/bikes/flee-low-speed/default.png",
      colors: [
        "/bikes/flee-low-speed/default.png",
        "/bikes/flee-low-speed/cyan.png",
        "/bikes/flee-low-speed/yellow.png",
        "/bikes/flee-low-speed/orange.png",
      ],
      specs: [
        ["140 km", "Range"],
        ["25 km/h", "Top Speed"],
        ["2.9s", "0-60 Acceleration"],
      ],
      sections: [
        ["BLDC Hub Motor", "A 250W brushless DC hub motor delivers smooth acceleration and efficient city riding."],
        ["Lithium-Ion Battery", "48V lithium battery with high energy density and long life cycle."],
        ["Smart BMS", "Battery management monitors voltage, temperature, charging cycles, and safety."],
        ["IoT Connectivity", "GPS tracking, geo-fencing, theft alerts, and diagnostics for connected ownership."],
        ["Digital Dashboard", "LCD display shows speed, battery level, trip data, and system alerts."],
        ["Reverse Drive", "Move backwards easily while parking or handling tight spaces."],
      ],
    },
    2: {
      name: "Flee High-Speed",
      shortName: "Flee-high-speed",
      subtitle: "Smart Everyday Ride",
      image: "/bikes/flee-high-speed/default.png",
      colors: [
        "/bikes/flee-high-speed/default.png",
        "/bikes/flee-low-speed/cyan.png",
        "/bikes/flee-low-speed/yellow.png",
        "/bikes/flee-low-speed/orange.png",
      ],
      specs: [
        ["120-140 km", "Range"],
        ["70-80 km/h", "Top Speed"],
        ["5-7 sec", "0-40 km/h"],
      ],
      sections: [
        ["High-Power BLDC Hub Motor", "High-speed brushless motor designed for strong acceleration and smooth performance."],
        ["Advanced Lithium-Ion Battery", "High-capacity battery pack optimized for extended range and fast charging."],
        ["Smart Battery Management System", "Monitors temperature, voltage, and current for safety and battery health."],
        ["Intelligent Motor Controller", "Optimizes torque delivery and ensures efficient power usage."],
        ["Regenerative Braking System", "Recovers braking energy to improve efficiency and riding range."],
        ["Reinforced Lightweight Chassis", "Durable frame built for stability at higher speeds."],
      ],
    },
  };

  const bike = bikes[id];
  const [activeImage, setActiveImage] = useState(bike?.image || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!bike) {
    return (
      <div className="public-detail-page">
        <PublicPageHeader />
        <div className="public-empty-panel">
          <h1>Bike not found</h1>
          <Link to="/">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="public-detail-page">
      <PublicPageHeader />

      <section className="bike-detail-hero">
        <div>
          <p className="site-kicker">Let's ride the</p>
          <h1>{bike.name}</h1>
          <p>{bike.subtitle}</p>

          <div className="bike-detail-specs">
            {bike.specs.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="home-primary-link"
            onClick={() => navigate("/test-ride", { state: { bike: bike.shortName } })}
          >
            Book Test Ride
          </button>
        </div>

        <div className="bike-detail-media">
          <img src={activeImage} alt={bike.name} />
          <div className="bike-thumb-row">
            {bike.colors.map((image) => (
              <button
                key={image}
                type="button"
                className={activeImage === image ? "active" : ""}
                onClick={() => setActiveImage(image)}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bike-feature-section">
        <div className="home-section-heading">
          <p className="site-kicker">Technology</p>
          <h2>Built for modern electric mobility</h2>
          <p>
            The Flee platform combines practical city performance, connected
            diagnostics, and efficient electric hardware.
          </p>
        </div>

        <div className="bike-feature-grid">
          {bike.sections.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TestRide() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedBike = location.state?.bike || "";
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bike_name: selectedBike,
    location: "Bangalore",
    date: "",
    time_slot: "",
    full_name: "",
    phone: "",
    email: "",
    address: "",
  });

  const bikes = [
    {
      name: "Flee-low-speed",
      label: "Flee Low-Speed",
      image: "/bikes/flee-low-speed/default.png",
    },
    {
      name: "Flee-high-speed",
      label: "Flee High-Speed",
      image: "/bikes/flee-high-speed/default.png",
    },
  ];

  function updateForm(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!form.bike_name || !form.date || !form.time_slot || !form.full_name || !form.phone) {
      setMessage("Please fill bike, date, time, name, and phone.");
      return;
    }

    try {
      setLoading(true);
      await client.post("/test-rides/", {
        ...form,
        date: `${form.date}T00:00:00Z`,
        status: "CONFIRMED",
      });

      alert("Test ride booked successfully.");
      navigate("/slots-availability");
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage("Failed to book test ride. Please check the details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="public-detail-page">
      <PublicPageHeader />

      <main className="test-ride-shell">
        <section className="test-ride-intro">
          <p className="site-kicker">Experience Flee</p>
          <h1>Book Test Ride</h1>
          <p>
            Select your Flee model, choose a slot, and share your contact
            details. Your booking will be confirmed immediately.
          </p>
        </section>

        <form className="test-ride-form" onSubmit={handleSubmit}>
          <div className="test-bike-picker">
            {bikes.map((bike) => (
              <button
                key={bike.name}
                type="button"
                className={form.bike_name === bike.name ? "active" : ""}
                onClick={() => updateForm("bike_name", bike.name)}
              >
                <img src={bike.image} alt={bike.label} />
                <span>{bike.label}</span>
              </button>
            ))}
          </div>

          <div className="test-form-grid">
            <label>
              Location
              <select
                value={form.location}
                onChange={(e) => updateForm("location", e.target.value)}
              >
                <option value="Bangalore">Bangalore</option>
                <option value="Goa">Goa</option>
              </select>
            </label>

            <label>
              Date
              <input
                type="date"
                value={form.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => updateForm("date", e.target.value)}
              />
            </label>

            <label>
              Time Slot
              <select
                value={form.time_slot}
                onChange={(e) => updateForm("time_slot", e.target.value)}
              >
                <option value="">Select time</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="1:00 PM">1:00 PM</option>
              </select>
            </label>

            <label>
              Full Name
              <input
                value={form.full_name}
                onChange={(e) => updateForm("full_name", e.target.value)}
                placeholder="Enter full name"
              />
            </label>

            <label>
              Phone
              <input
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                placeholder="Enter phone number"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="Enter email"
              />
            </label>
          </div>

          <label>
            Pickup Address
            <textarea
              value={form.address}
              onChange={(e) => updateForm("address", e.target.value)}
              placeholder="Building, street, area, or PIN code"
            />
          </label>

          {message && <p className="form-message">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </main>
    </div>
  );
}

function SlotsAvailability() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    try {
      const today = new Date();
      const twoMonthsLater = new Date();
      twoMonthsLater.setMonth(today.getMonth() + 2);

      const response = await client.get("/test-rides/slots-range/", {
        params: {
          startDate: today.toISOString(),
          endDate: twoMonthsLater.toISOString(),
        },
      });

      setSlots(response.data || []);
    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  }

  const groupedSlots = slots.reduce((acc, day) => {
    const month = new Date(day.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[month]) {
      acc[month] = [];
    }

    acc[month].push(day);
    return acc;
  }, {});

  return (
    <div className="public-detail-page">
      <PublicPageHeader />

      <main className="slots-shell">
        <section className="test-ride-intro">
          <p className="site-kicker">Plan your ride</p>
          <h1>Test Ride Availability</h1>
          <p>
            Available and booked slots for the next two months are shown below.
          </p>
        </section>

        {loading ? (
          <div className="public-empty-panel">Loading slots...</div>
        ) : Object.keys(groupedSlots).length === 0 ? (
          <div className="public-empty-panel">No slots available.</div>
        ) : (
          Object.entries(groupedSlots).map(([month, days]) => (
            <section key={month} className="slots-month-card">
              <h2>{month}</h2>
              <div className="slots-day-grid">
                {days.map((day) => (
                  <article key={day.date} className="slots-day-card">
                    <h3>{new Date(day.date).toDateString()}</h3>
                    <div>
                      {(day.slots || []).map((slot) => (
                        <span
                          key={slot.time}
                          className={slot.isBooked ? "booked" : "available"}
                        >
                          {slot.time}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
  path="/admin"
  element={
    <RequireRole allowedRoles={["ADMIN", "SERVICE_ADVISOR"]}>
      <Admin />
    </RequireRole>
  }
/>

<Route
  path="/customer"
  element={
    <RequireRole allowedRoles={["CUSTOMER"]}>
      <Customer />
    </RequireRole>
  }
/>

<Route
  path="/technician"
  element={
    <RequireRole allowedRoles={["TECHNICIAN"]}>
      <Technician />
    </RequireRole>
  }
/>

      <Route path="/test-ride" element={<TestRide />} />
      <Route path="/slots-availability" element={<SlotsAvailability />} />
      <Route path="/bike/:id" element={<BikeDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/book-service" element={<BookService />} />
      <Route
        path="/customer/booking/:bookingId"
        element={
          <RequireRole allowedRoles={["CUSTOMER"]}>
            <CustomerBookingDetail />
          </RequireRole>
        }
      />
      <Route
        path="/customer/job-card/:jobCardId"
        element={
          <RequireRole allowedRoles={["CUSTOMER"]}>
            <CustomerJobCardDetail />
          </RequireRole>
        }
      />
      <Route
        path="/customer/raise-complaint/:jobCardId"
        element={
          <RequireRole allowedRoles={["CUSTOMER"]}>
            <CustomerRaiseComplaint />
          </RequireRole>
        }
      />


    </Routes>
  );
}
