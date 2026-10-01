"use client";
import Header from "@/components/layout/header/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface ChildrenProps {
  children: React.ReactNode;
}

const layout = ({ children }: ChildrenProps) => {
  const [qc] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={qc}>
      <div className="layout">
        <Header />
        <main>{children}</main>
      </div>
    </QueryClientProvider>
  );
};

export default layout;
