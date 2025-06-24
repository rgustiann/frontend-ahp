import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from '@/types/user';
const API_URL = process.env.NEXT_PUBLIC_API_URL + '/auth'


export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getUserFromToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch {
    return null;
  }
};

export async function login(username: string, password: string) {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
}

export async function register({ username, password, email, role }: { username: string; password: string; email: string; role: string }) {
  const response = await axios.post(`${API_URL}/register`, { username, password, email, role });
  return response.data;
}

export async function logout() {
  // ini ntar buat logout
  return true;
}
