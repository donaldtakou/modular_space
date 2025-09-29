import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Administration - ModularHouse",
  description: "Panneau d'administration sécurisé",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout w-full min-h-screen bg-gray-100 flex flex-col" style={{position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh', zIndex: 9999}}>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      <footer className="bg-white border-t border-gray-200 py-3 px-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>© 2025 ModularHouse - Administration</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              🔒 Accès sécurisé
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span>Version 1.0</span>
            <span>•</span>
            <span className="text-blue-600">Admin Panel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}