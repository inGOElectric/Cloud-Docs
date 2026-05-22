import client from "./client";

export const saveComplaint = (jobCardId, payload) =>
  client.post(`/job-cards/${jobCardId}/complaints`, payload);

export const getComplaints = (jobCardId) =>
  client.get(`/job-cards/${jobCardId}/complaints`);
