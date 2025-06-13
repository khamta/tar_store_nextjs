import "./globals.css";
// import './fonts/font_lao.css'
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Noto_Sans_Lao } from "next/font/google";
import { name_app } from "@/name_app";

export const metadata: Metadata = {
  title: {
    default: `${name_app} | E-commerce workshop`,
    template: "%s | E-commerce workshop",
  },
  icons: {
    icon: '/images/banner.jpg'
  },
  description:
    "ຮ້ານຄ້າອອນໄລນ໌ ສໍາລັບຄົນລາວ ສິນຄ້າແບບເທັນໂນໂລຢີ ພ້ອມບໍລິການ ສົ່ງສິນຄ້າໃນເວລາ 24 ຊົ່ວໂມງ",
  keywords: ["ອອນໄລນ໌", "ສິນຄ້າ", "ລາວ", "ເທັນໂນໂລຢີ"],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const NotoSansLao = Noto_Sans_Lao({
  subsets: ["lao"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={NotoSansLao.className}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
};

export default RootLayout;
