import * as adminService from '../services/adminService.js';

// Login admin
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await adminService.loginAdmin(username, password);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Username and password are required' || error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};// ===============================
// 📊 DASHBOARD CONTROLLER
// ===============================
export const getDashboardStats = async (req, res) => {
   console.log("🔥 CONTROLLER HIT");
  try {
    const data = await adminService.getDashboardStats();
    res.status(200).json(data);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: error.message });
  }
};
