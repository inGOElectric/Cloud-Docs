import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function TechnicianList() {
  const [technicians, setTechnicians] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    client.get("/technicians").then((res) => {
      setTechnicians(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Technicians</h1>

      {technicians.map((tech) => (
        <div
          key={tech.id}
          onClick={() => navigate(`/technician/${tech.id}`)}
          className="p-4 mb-3 bg-[#0A3A55] text-white rounded cursor-pointer hover:bg-cyan-600"
        >
          {tech.name}
        </div>
      ))}
    </div>
  );
}
