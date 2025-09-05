import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export const login = async (username, password) => {
  const { data } = await API.post("/auth/login", { username, password });
  localStorage.setItem("token", data.access_token);
  return data;
};

export const getIncidents = async () => {
  const token = localStorage.getItem("token");
  const { data } = await API.get("/incidents/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
