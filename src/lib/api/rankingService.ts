import { SupplierRanking, UsedCriteria } from "@/types/ranking";
import axiosInstance from "./axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/ranking";

export const getUsedCriteriaByReport = async (reportId: number): Promise<UsedCriteria[]> => {
    const response = await axiosInstance.get(
      `${API_URL}/usedcriteria/${reportId}`
    );
    return response.data;
};

export const getRankingSuppliersByReport = async (reportId: number): Promise<SupplierRanking[]> => {
    const response = await axiosInstance.get(
      `${API_URL}/rankingsuppliers/${reportId}`
    );
    return response.data;
};