import {
  GridIcon,
  ListIcon,
  PageIcon,
  CalenderIcon,
  DocsIcon,
  DocsDark,
  CalendarDark,
  ListDark,
  PagesDark,
  GridDark,
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