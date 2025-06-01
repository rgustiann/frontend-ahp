export interface SupplierRanking {
  id: number;
  supplierName: string;
  supplyName: string;
  ranking: number;
  alokasi: number;
}

export interface UsedCriteria {
  id: number;
  reportId: number;
  criteriaName: string;
  criteruaValue: number;
}