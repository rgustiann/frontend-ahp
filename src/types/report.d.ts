export interface UsedCriteria {
  criteriaName: string;
  criteriaValue: number;
}

export interface CreateReportPayload {
  catatan_supply_id: number;
  file_path: string;
  catatan_validasi?: string;
  usedCriteria: UsedCriteria[];
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