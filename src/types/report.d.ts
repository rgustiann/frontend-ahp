export interface UsedCriteria {
  criteriaName: string;
  criteriaValue: number;
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
  message: string
  report_id: number,
  session_id: number,
  catatan_supply_id: number,
  pdf_processing: boolean
}

export interface ReportResponse {
  id: number;
  catatan_supply_id: number;
  file_path: string | null;
  catatan_validasi: string | null;
  status: 'disetujui' | 'ditolak' | 'menunggu'; 
  tanggal_laporan: string; 
  approved_by: number | null;
  username: string;
  nama_kebutuhan: string;
  jumlah_kebutuhan: number;
  tanggal_input: string;

  consistency_ratio: number | null;
  ahp_status: string | null;
}



interface PreviewRankingRequest {
  nama_supply: string;
  jumlah_kebutuhan: number;
  usedCriteria: Array<{
    criteriaName: string;
    criteriaValue: number;
  }>;
}

export interface ComparisonMatrix {
  [key: string]: {
    [key: string]: number;
  };
}

export interface SupplierComparisons {
  [criteriaId: number]: {
    [supplierA: string]: {
      [supplierB: string]: number;
    };
  };
}

export interface GenerateRankingPayload {
  nama_supply: string;
  jumlah_kebutuhan: number;
  criteria_comparisons: ComparisonMatrix;
  supplier_comparisons: SupplierComparisons;
}

export interface AHPResult {
  supplierId: number;
  supplierName: string;
  alamat: string;
  score: number;
  ranking: number;
  jumlah_alokasi: number;
  maksimal_produksi: number;
}

export interface CriteriaWeight {
  criteria_id: number;
  weight_value: number;
}

export interface GenerateRankingResponse {
  success: boolean;
  message: string;
  data: {
    rankings: AHPResult[];
    criteriaWeights: CriteriaWeight[];
    consistencyRatios: { [key: string]: number };
    isValid: boolean;
    errors: string[];
  };
}

export interface RankingData {
  supplier_id: number;
  supplierName: string;
  nama_supply: string;
  ranking: number;
  final_score: number;
  alokasi_kebutuhan: number;
}

export interface CriteriaComparisonReport {
  criteria_a_id: number;
  criteria_b_id: number;
  comparison_value: number;
}

export interface SupplierComparisonReport {
  criteria_id: number;
  supplier_a_id: number;
  supplier_b_id: number;
  comparison_value: number;
}


export interface CreateReportPayload {
  nama_supply: string;
  jumlah_kebutuhan: number;
  nama_pemesan: string;
  no_telp_pemesan: string;
  catatan_validasi?: string;
  tanggal_laporan?: string;
  usedCriteria?: UsedCriteria[];
  criteria_weights?: CriteriaWeight[];
  criteria_comparisons?: CriteriaComparisonReport[];
  supplier_comparisons?: SupplierComparisonReport[];
  consistency_ratios?: {
    criteria?: number;
  };
  rankings: Array<{
    supplierName: string;
    nama_supply: string;
    ranking: number;
    alokasi_kebutuhan: number;
  }>;
}

export interface ComparisonData {
  [criteriaId: number]: {
    [supplierA: number]: {
      [supplierB: number]: number;
    };
  };
}

export interface CriteriaComparisonData {
  [criteriaA: number]: {
    [criteriaB: number]: number;
  };
}
