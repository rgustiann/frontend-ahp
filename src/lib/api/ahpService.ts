import axiosInstance from "./axios";

export interface AHPRequestPayload {
  pairwiseKriteria: number[][];
  supplierComparisons: number[][][];
}

export interface AHPResponse {
  kriteriaWeights: number[];
  supplierWeights: number[][];
  finalScores: number[];
}

export const calculateAHP = async (
  payload: AHPRequestPayload
): Promise<AHPResponse> => {
  const response = await axiosInstance.post<AHPResponse>('/ahp/calculate', payload);
  return response.data;
};