import axiosInstance from "./axios";
import { InputSupplyPayload, Supply } from "@/types/supply";
const API_URL = process.env.NEXT_PUBLIC_API_URL + '/supplies';

export async function inputSupply(data: InputSupplyPayload): Promise<{ catatan_supply_id: number }> {
  const response = await axiosInstance.post(`${API_URL}/input`, data);
  return response.data;
}

export async function getAllSupply(): Promise<Supply[]> {
  const response = await axiosInstance.get(API_URL);
  return response.data;
}

export async function getSupplyById(id: number): Promise<Supply> {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
}

export async function updateSupply(id: number, data: InputSupplyPayload): Promise<void> {
  await axiosInstance.put(`${API_URL}/${id}`, data);
}

export async function deleteSupply(id: number): Promise<void> {
  await axiosInstance.delete(`${API_URL}/${id}`);
}
