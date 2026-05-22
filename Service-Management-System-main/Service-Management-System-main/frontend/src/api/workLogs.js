import client from "./client";

// baseURL already has /api → DO NOT add /api here

export const fetchWorkLog = (jobCardId) => {
  return client.get(`/job-cards/${jobCardId}/work-log`);
};

export const createWorkLog = (jobCardId, payload) => {
  return client.post(`/job-cards/${jobCardId}/work-log`, payload);
};

export const startWorkLog = (logId) => {
  return client.patch(`/work-log/${logId}/start`);
};

export const completeWorkLog = (logId) => {
  return client.patch(`/work-log/${logId}/complete`);
};
