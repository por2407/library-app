import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

// ─── Axios Instance ──────────────────────────────────────────────────

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // สำหรับส่ง HttpOnly Cookies ไปยัง Backend
  headers: {
    "Content-Type": "application/json",
  },
});