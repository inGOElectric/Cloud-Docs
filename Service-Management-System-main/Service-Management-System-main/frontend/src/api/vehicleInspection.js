import client from "./client";

export const getInspection = (jobCardId) =>
  client.get(`/job-cards/${jobCardId}/inspection`);

export const saveInspection = (jobCardId, payload) =>
  client.post(`/job-cards/${jobCardId}/inspection`, payload);
