export interface UsedCriteria {
  criteriaName: string;
  criteriaValue: number;
}

export interface CreateReportPayload {
  nama_supply: string;
  jumlah_kebutuhan: number;
  nama_pemesan: string;
  no_telp_pemesan: string;
  rankings: Array<{
    supplierName: string;
    nama_supply: string;
    ranking: number;
    alokasi_kebutuhan: number;
    score?: number; 
  }>;
  usedCriteria: Array<{
    criteriaName: string;
    criteriaValue: number;
  }>;
  catatan_validasi: string;
}

export interface CreateReportResponse {
  message: string;
  report_id: number;
  catatan_supply_id: number;
  pdf_url: string;
}

export interface ApprovalPayload {
  status: string;
  catatan_validasi: string;
}
export interface ReportData {
  id: number;
  catatan_supply_id: number;
  file_path: string;
  catatan_validasi: string | null;
  status: string;
  tanggal_laporan: string;
  approved_by:string
  username: string;
  nama_kebutuhan: string;
  jumlah_kebutuhan: number;
  tanggal_input?: string; 
}

interface PreviewRankingRequest {
  nama_barang: string;
  jumlah_kebutuhan: number;
  usedCriteria: KriteriaThatWillbeUsed[];
}

interface CreateReportWithDataRequest {
  nama_barang: string;
  jumlah_kebutuhan: number;
  pemesan: string;
  no_telepon: string;
  usedCriteria: KriteriaThatWillbeUsed[];
  catatan_validasi: string;
  rankingData: SupplierRanking[];
}
export interface CreateReportWithRankingPayload {
  catatan_supply_id: number;
  file_path: string;
  catatan_validasi: string;
  usedCriteria: KriteriaThatWillbeUsed[];
  rankingData: SupplierRanking[]; 
}