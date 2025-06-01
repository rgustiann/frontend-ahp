export interface Kriteria {
  id: number;
  kode: string;
  nama: string;
  pertimbangan: string;
}

export interface KriteriaInput {
  kode: string;
  nama: string;
  pertimbangan: string;
}
export interface NilaiKriteriaInput {
  namaKriteria: string;
  nilai: number | undefined;
}
export interface NilaiKriteriaServer {
  id: number;
  supplierId: number;
  namaKriteria: string;
  nilai:  number | undefined;
}

interface KriteriaThatWillbeUsed {
  criteriaName: string;
  criteriaValue: number;
}