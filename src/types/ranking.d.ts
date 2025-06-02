import { KriteriaThatWillbeUsed } from "./kriteria";

export interface SupplierRanking {
  id: number;
  reportId: number;
  nama_supply: string;
  supplierName: string;
  ranking: number;
  alokasi_kebutuhan: number;
}

export interface UsedCriteria {
  criteriaName: string;
  criteriaValue: number;
}


export interface RankingInput{
  nama_supply: string;
  jumlah_kebutuhan: number;
  usedCriteria : KriteriaThatWillbeUsed[];
}

export type SupplierRankingResponse = {
  id: number;
  supplierId: number;
  supplierName: string;
  nama_supply: string;
  maksimal_produksi: number;
  score: number;
  ranking: number;
  alokasi_kebutuhan: number;
};

export type SupplyInfo = {
  nama_kebutuhan: string;
  jumlah_kebutuhan: number;
  sisa_kebutuhan: number;
};

export type GenerateRankingResponse = {
  message: string;
  rankings: SupplierRankingResponse[];
  supply_info: SupplyInfo;
};
