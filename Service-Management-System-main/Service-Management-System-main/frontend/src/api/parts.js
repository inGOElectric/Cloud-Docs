import client from "./client";

export const fetchParts = (jobCardId) => {
  return client.get(`/job-cards/${jobCardId}/parts`);
};

export const saveParts = (jobCardId, parts) => {
  return client.post(`/job-cards/${jobCardId}/parts`, parts);
};
