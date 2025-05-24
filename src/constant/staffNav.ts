import {
  GridIcon,
  ListIcon,
  PageIcon,
  TableIcon,
  CalenderIcon,
  DocsIcon,
  DocsDark,
  CalendarDark,
  ListDark,
  PagesDark,
  GridDark,
  TableDark,
} from "../icons/index";

export const staffNavItems = [
  {
    name: "Dashboard",
    icon: GridIcon,
    iconDark: GridDark,
    path: "/staff",
  },
  {
    name: "Daftar Supplier",
    icon: ListIcon,
    iconDark: ListDark,
    path: "/staff/supplier",
  },
  {
    name: "Kriteria",
    icon: PageIcon,
    iconDark: PagesDark,
    path: "/staff/kriteria",
  },
  {
    name: "Perhitungan",
    icon: TableIcon,
    iconDark: TableDark,
    path: "/staff/ahp-result",
  },
  {
    name: "Pengalokasian",
    icon: CalenderIcon,
    iconDark: CalendarDark,
    path: "/staff/pengalokasian",
  },
  {
    name: "Pelaporan",
    icon: DocsIcon,
    iconDark: DocsDark,
    path: "/staff/pelaporan",
  },
];