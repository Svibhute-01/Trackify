// Example
import axios from "axios";

const token = localStorage.getItem("token"); // your JWT token
const API = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default API;