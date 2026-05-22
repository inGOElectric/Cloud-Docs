import { createJobCard } from "../api/jobCards";

export const useJobCards = () => {
  const create = async (payload) => {
    const res = await createJobCard(payload);
    return res.data;
  };

  return { create };
};
