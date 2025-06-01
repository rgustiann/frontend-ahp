export interface NilaiKriteriaSupplier {
  kriteriaId: number;
  nilai: number;
}

export interface Supplier {
  id: number;
  nama: string;
  alamat: string;
  contact: string;
  keterangan: string;
}

export interface SupplierDetail {
  id: number;
  supplier_id: number;
  nama_supply: string;
  maksimal_produksi: number;
}