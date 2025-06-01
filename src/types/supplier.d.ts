export interface NilaiKriteriaSupplier {
  kriteriaId: number;
  nilai: number;
}

export interface Supplier {
  id: number;
  nama: string;
  alamat: string;
  contact: string;
  nama_supply: string;
  maksimal_produksi:  number | undefined;
  keterangan: string;
}
