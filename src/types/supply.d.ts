export interface Supply {
  id: number;
  kebutuhan: string;
  jumlah_kebutuhan: number;
  staff_id: number;
  tanggal: string;
  staff_username: string;
}

export interface InputSupplyPayload {
  nama_pemesan: string;
  no_hp: string;
  nama_kebutuhan: string;
  jumlah_kebutuhan: number;
  staff_id: number;
  tanggal:string;
}

export interface SupplyDetail {
  id: number;
  supplier_id: number;
  nama_supply: string;
  maksimal_produksi: number;
}

export interface SupplyInput {
  nama_supply: string;
  maksimal_produksi: number;
}