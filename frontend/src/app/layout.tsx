import "@/styles/globals.css";
import { ReduxProvider } from "@/lib/redux/Providers";

export const metadata = {
  title: "Gym Dashboard",
  description: "Gym Management System built with Next.js + NestJS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
