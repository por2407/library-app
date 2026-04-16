import { api } from "../lib/axios";
import type{ User } from "../stores/auth-store";

export const authApi = {
  async register(name: string, email: string, password: string) {
    return api.post("/auth/register", {
      name,
      email,
      password,
    });
  },
  async login(email: string, password: string) {
    return api.post("/auth/login", {
      email,
      password,
    });
  },
  async me(): Promise<User> {
    const response = await api.get("/auth/me");
    return response.data.data;
  },
  async logout() {
    return api.post("/auth/logout");
  },
};
