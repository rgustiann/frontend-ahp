import { GridIcon, PageIcon, GridDark, ListIcon, ListDark, PagesDark} from "@/icons";

export const managerNavItems = [
  {
    name: "Dashboard",
    icon: GridIcon,
    iconDark: GridDark,
    path: "/manager",
  },
  {
    name: "Daftar Supplier",
    icon: ListIcon,
    iconDark: ListDark,
    path: "/manager/supplier",
  },
  {
    name: "Approve Laporan",
    icon: PageIcon,
    iconDark: PagesDark,
    path: "/manager/laporan",
  },
];
