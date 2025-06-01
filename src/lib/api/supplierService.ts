import axiosInstance from "./axios"; 
import { Supplier } from "@/types/supplier";
import { NilaiKriteriaServer, NilaiKriteriaInput } from '@/types/kriteria';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/supplier';

console.log(API_URL); 

// -------------------- Supplier --------------------

export const getAllSuppliers = async (): Promise<Supplier[]> => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

export const getSupplierById = async (id: number): Promise<Supplier> => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};

export const createSupplier = async (
  supplier: Supplier
): Promise<{ message: string; supplier_id: number }> => {
  const response = await axiosInstance.post(API_URL, supplier);
  return response.data;
};

export const updateSupplier = async (
  id: number,
  updatedSupplier: Supplier
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, updatedSupplier);
  return response.data;
};

export const deleteSupplier = async (id: number): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data;
};

// -------------------- Nilai Kriteria --------------------

export const getNilaiKriteriaBySupplier = async (
  supplierId: number
): Promise<NilaiKriteriaServer[]> => {
  const response = await axiosInstance.get(`${API_URL}/${supplierId}/nilai-kriteria`);
  return response.data;
};

export const addNilaiKriteria = async (
  supplierId: number,
  nilai: NilaiKriteriaInput
): Promise<{ message: string; id: number }> => {
  const response = await axiosInstance.post(`${API_URL}/${supplierId}/nilai-kriteria`, nilai);
  return response.data;
};

export const updateNilaiKriteria = async (
  id: number,
  updatedNilai: NilaiKriteriaInput
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(`${API_URL}/nilai-kriteria/${id}`, updatedNilai);
  return response.data;
};

export const deleteNilaiKriteria = async (id: number): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`${API_URL}/nilai-kriteria/${id}`);
  return response.data;
};
