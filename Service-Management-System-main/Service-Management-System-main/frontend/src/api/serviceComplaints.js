import client from "./client";

export const saveComplaint = (jobCardId, payload) => {
  return client.post(`/job-cards/${jobCardId}/complaints`, payload);
};