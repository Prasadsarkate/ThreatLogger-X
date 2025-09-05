import axios from "axios";

// Apna backend URL yaha set karo
const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend
});

// Helper to get JWT token from localStorage
const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found. Please login.");
  return { Authorization: `Bearer ${token}` };
};

// -----------------------------
// Incidents
// -----------------------------
export const fetchIncidents = async (limit = 100) => {
  const headers = getTokenHeader();
  const res = await API.get(`/incidents`, {
    headers,
    params: { limit },
  });
  return res.data;
};

// -----------------------------
// Simulator
// -----------------------------
export const createDummyFiles = async (count = 50) => {
  const headers = getTokenHeader();
  const res = await API.post(`/simulate/create-files`, null, {
    headers,
    params: { count },
  });
  return res.data;
};

export const runSimulation = async () => {
  const headers = getTokenHeader();
  const res = await API.post("/simulate/run", {}, { headers });
  return res.data;
};

// -----------------------------
// Responder
// -----------------------------
export const quarantineAll = async () => {
  const headers = getTokenHeader();
  const res = await API.post("/response/quarantine", {}, { headers });
  return res.data;
};

// -----------------------------
// Reports
// -----------------------------
export const generateReport = async (incidentId) => {
  const headers = getTokenHeader();
  const res = await API.post(`/report/generate`, {}, {
    headers,
    params: { incident_id: incidentId },
  });
  return res.data;
};
