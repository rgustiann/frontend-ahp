export interface NilaiKriteriaSupplier {
  kriteriaId: number;
  nilai: number;
}

export interface Supplier {
  id: number;
  nama: string;
  alamat: string;
  contact: string;
  nilaiKriteria: NilaiKriteriaSupplier[];
  keterangan: string;
}
