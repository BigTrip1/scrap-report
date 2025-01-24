"use client";

import { ReactNode } from "react";
import { Session } from "next-auth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

interface Props {
  children: ReactNode;
  session: Session | null;
}

const ClientLayout = ({ children, session }: Props) => {
  return (
    <div className="flex h-screen">
      <Sidebar session={session} />
      <div className="flex-1 overflow-auto">
        <Navbar session={session} />
        <main className="pb-16">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default ClientLayout;
