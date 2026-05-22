import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../api/client";

export default function CustomerJobHistory() {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [custRes, jobsRes] = await Promise.all([
          client.get(`/customers/${customerId}`),
          client.get(`/customers/${customerId}/job-cards`),
        ]);
        setCustomer(custRes.data);
        setJobCards(jobsRes.data.data || jobsRes.data || []);
      } catch (err) {
        setError("Failed to load customer/job cards");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [customerId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!customer) return <div className="p-6">Customer not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">{customer.name}</h1>
      <div className="mb-4 text-gray-700">{customer.mobileNumber}</div>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-3 border-b">Job Card #</th>
              <th className="py-2 px-3 border-b">Vehicle</th>
              <th className="py-2 px-3 border-b">Service Type</th>
              <th className="py-2 px-3 border-b">Status</th>
              <th className="py-2 px-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobCards.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No job cards found.</td></tr>
            ) : (
              jobCards.map(job => (
                <tr key={job.id} className="border-b">
                  <td className="py-2 px-3 font-mono">{job.jobCardNumber}</td>
                  <td className="py-2 px-3">{job.vehicle?.model || "-"}</td>
                  <td className="py-2 px-3">{job.serviceType}</td>
                  <td className="py-2 px-3">{job.status}</td>
                  <td className="py-2 px-3">
                    <Link to={`/job-cards/${job.id}`} className="text-blue-600 underline">Open</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
