import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth
export const loginAPI = (data) => API.post("/auth/login", data);
export const registerAPI = (data) => API.post("/auth/register", data);
export const getMeAPI = () => API.get("/auth/me");
export const updateProfileAPI = (data) => API.put("/auth/profile", data);

// Leaves
export const applyLeaveAPI = (data) => API.post("/leaves", data);
export const getMyLeavesAPI = () => API.get("/leaves/my");
export const getAllLeavesAPI = (params) => API.get("/leaves", { params });
export const reviewLeaveAPI = (id, data) =>
  API.put(`/leaves/${id}/review`, data);
export const cancelLeaveAPI = (id) => API.delete(`/leaves/${id}`);
export const getLeaveStatsAPI = () => API.get("/leaves/stats");

// Users
export const createUserAPI = (data) => API.post("/users", data);
export const getAllUsersAPI = () => API.get("/users");
export const getUserByIdAPI = (id) => API.get(`/users/${id}`);
export const updateUserAPI = (id, data) => API.put(`/users/${id}`, data);
export const deleteUserAPI = (id) => API.delete(`/users/${id}`);
export const getUserLeavesAPI = (id) => API.get(`/users/${id}/leaves`);

export default API;
