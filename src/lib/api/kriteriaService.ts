import axiosInstance from "./axios"; 
import { Kriteria, KriteriaInput } from "@/types/kriteria";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/kriteria"

// CREATE kriteria
export const createKriteria = async (
  kriteria: KriteriaInput
): Promise<{ message: string; kriteria_id: number }> => {
  const response = await axiosInstance.post(API_URL, kriteria);
  return response.data;
};

// GET all kriteria
export const getAllKriteria = async (): Promise<Kriteria[]> => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

// GET kriteria by ID
export const getKriteriaById = async (id: number): Promise<Kriteria> => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};

// UPDATE kriteria
export const updateKriteria = async (
  id: number,
  updatedKriteria: KriteriaInput
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, updatedKriteria);
  return response.data;
};

// DELETE kriteria
export const deleteKriteria = async (
  id: number
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data;
};
