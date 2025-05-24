import axios from 'axios';
import { Supplier } from '@/types/supplier';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/supplies';

export async function getSupplierList(): Promise<Supplier[]> {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function getSupplierById(id: number): Promise<Supplier> {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export async function createSupplier(data: Omit<Supplier, 'id'>): Promise<Supplier> {
  const response = await axios.post(API_URL, data);
  return response.data;
}

export async function updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier> {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
}

export async function deleteSupplier(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}