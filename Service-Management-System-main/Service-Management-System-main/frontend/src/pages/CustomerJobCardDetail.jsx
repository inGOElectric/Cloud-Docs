import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";

export default function CustomerJobCardDetail() {
  const { id } = useParams();
  const [jobCard, setJobCard] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    client.get(`/job-cards/${id}`)
      .then(res => {
        setJobCard(res.data);
      })
      .catch(() => {
        setError("Job card not found or access denied");
      });
  }, [id]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!jobCard) return <div className="p-6">Loading...</div>;

  // Status timeline
  const statusSteps = ["OPEN", "IN_PROGRESS", "COMPLETED"];
  const currentStep = statusSteps.indexOf(jobCard.status);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Job Card #{jobCard.jobCardNumber}</h1>
      <div className="mb-2">Service Type: <b>{jobCard.serviceType}</b></div>
      <div className="mb-2">Vehicle: <b>{jobCard.vehicle?.model} ({jobCard.vehicle?.registrationNumber})</b></div>
      <div className="mb-2">Created: {new Date(jobCard.createdAt).toLocaleString()}</div>

      {/* Status Timeline */}
      <div className="my-4">
        <div className="flex space-x-4 items-center">
          {statusSteps.map((step, idx) => (
            <div key={step} className={`flex items-center ${idx <= currentStep ? 'font-bold text-blue-600' : 'text-gray-400'}`}>
              <span>{step.replace('_', ' ')}</span>
              {idx < statusSteps.length - 1 && <span className="mx-2">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Complaint/Service Details */}
      <div className="mb-4">
        <div className="font-medium mb-1">Description</div>
        <div className="border p-2 bg-gray-50 rounded min-h-10">{jobCard.description || "-"}</div>
      </div>

      {/* Attachments */}
      <div className="mb-4">
        <div className="font-medium mb-1">Attachments</div>
        {jobCard.media && jobCard.media.length > 0 ? (
          <ul className="list-disc ml-6">
            {jobCard.media.map(m => (
              <li key={m.id}>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {m.fileName || m.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No attachments.</div>
        )}
      </div>
    </div>
  );
}
