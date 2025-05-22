import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AHP Procurement System | Ini Kasi nama perusahaan juga oke",
  description: "Sistem rekomendasi pengadaan barang dengan AHP",
};

export default function SignUp() {
  return <SignUpForm />;
}
