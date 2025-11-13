import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux/Providers";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Gym Dashboard",
  description: "Gym Management System built with Next.js + NestJS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <ReduxProvider>{children}</ReduxProvider>
        <Footer />
        
      </body>
    </html>
  );
}
