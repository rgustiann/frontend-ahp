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
  pdf_url?: string;           
  pdf_processing?: boolean; 
}

export interface PDFStatusResponse {
  pdf_ready: boolean;
  pdf_url?: string;
}

export interface ApprovalPayload {
  status: string;
  catatan_validasi: string;
}

export interface ReportData {
  id: number;
  catatan_supply_id: number;
  catatan_validasi: string;
  status: string;
  tanggal_laporan: string;
  file_path?: string;
  approved_by?: number;
  username: string;
  nama_kebutuhan: string;
  jumlah_kebutuhan: number;
  tanggal_input: string;
}

interface PreviewRankingRequest {
  nama_supply: string;
  jumlah_kebutuhan: number;
  usedCriteria: Array<{
    criteriaName: string;
    criteriaValue: number;
  }>;
}

export interface CreateReportWithDataRequest {
  supplyData: {
    nama_supply: string;
    jumlah_kebutuhan: number;
    nama_pemesan: string;
    no_telp_pemesan: string;
  };
  rankings: Array<{
    supplierName: string;
    nama_supply: string;
    ranking: number;
    alokasi_kebutuhan: number;
  }>;
  usedCriteria: Array<{
    criteriaName: string;
    criteriaValue: number;
  }>;
  catatan_validasi: string;
}
export interface CreateReportWithRankingPayload {
  catatan_supply_id: number;
  file_path: string;
  catatan_validasi: string;
  usedCriteria: KriteriaThatWillbeUsed[];
  rankingData: SupplierRanking[]; 
}