export interface SupplierRanking {
  id: number;
  reportId: number;
  nama_supply: string;
  supplierName: string;
  ranking: number;
  alokasi_kebutuhan: number;
}

export interface UsedCriteria {
  id: number;
  reportId: number;
  criteriaName: string;
  criteruaValue: number;
}