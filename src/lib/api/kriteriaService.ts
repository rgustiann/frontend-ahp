import axios from 'axios';
import { Kriteria } from '@/types/kriteria';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/kriteria';

export async function getKriteriaList(): Promise<Kriteria[]> {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function getKriteriaById(id: number): Promise<Kriteria> {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export async function createKriteria(data: Omit<Kriteria, 'id'>): Promise<Kriteria> {
  const response = await axios.post(API_URL, data);
  return response.data;
}

export async function updateKriteria(id: number, data: Partial<Kriteria>): Promise<Kriteria> {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
}

export async function deleteKriteria(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}