import { saveComplaint } from "../api/complaints";

export const useServiceComplaints = () => {
  const submitComplaint = async (jobCardId, payload) => {
    const res = await saveComplaint(jobCardId, payload);
    return res.data;
  };

  return { submitComplaint };
};
