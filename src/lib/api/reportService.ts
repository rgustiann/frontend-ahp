import { ApprovalPayload, CreateReportPayload, CreateReportWithDataRequest, PreviewRankingRequest, ReportData } from "@/types/report";
import axiosInstance from "./axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/reports"

export const createReport = async (
  data: CreateReportPayload
): Promise<{ message: string; report_id: number }> => {
  const response = await axiosInstance.post(`${API_URL}/create`, data);
  return response.data;
};

export const getAllReports = async (): Promise<ReportData[]> => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

export const getReportByIdStaff = async (staff_id : number): Promise<ReportData[]> => {
  const response = await axiosInstance.get(`${API_URL}/staffReport/${staff_id}`);
  console.log("API AMBIL Report", `${API_URL}/staffReport/${staff_id}`);
  return response.data;
};

export const getReportByCatatanId = async (
  catatan_supply_id: number
): Promise<ReportData> => {
  const response = await axiosInstance.get(`${API_URL}/by-catatan/${catatan_supply_id}`);
  return response.data;
};

export const updateApproval = async (
  report_id: number,
  data: ApprovalPayload
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(`${API_URL}/${report_id}/approval`, data);
  return response.data;
};

export const generatePDF = async (
  report_id: number
): Promise<{ message: string; url: string }> => {
  const response = await axiosInstance.get(`${API_URL}/${report_id}/pdf`);
  return response.data;
};

export const previewRanking = async (data: PreviewRankingRequest) => {
  const response = await axiosInstance.post('${API_URL}/preview-ranking', data);
  return response.data;
};

export const createReportWithData = async (data: CreateReportWithDataRequest) => {
  const response = await axiosInstance.post('${API_URL}/create-with-data', data);
  return response.data;
};
