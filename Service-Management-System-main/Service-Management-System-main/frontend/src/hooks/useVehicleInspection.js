import { saveInspection, getInspection } from "../api/vehicleInspection";

export const useVehicleInspection = () => {
  const submitInspection = async (jobCardId, payload) => {
    try {
      const res = await saveInspection(jobCardId, payload);
      return res.data;
    } catch (err) {
      console.error(
        "Inspection backend error:",
        err.response?.data || err.message
      );
      throw err;
    }
  };

  const fetchInspection = async (jobCardId) => {
    try {
      const res = await getInspection(jobCardId);
      return res.data;
    } catch (err) {
      console.error(
        "Fetch inspection error:",
        err.response?.data || err.message
      );
      throw err;
    }
  };

  return { submitInspection, fetchInspection };
};
