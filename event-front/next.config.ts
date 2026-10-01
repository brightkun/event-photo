import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  // Браузер ходит только на этот сайт, а он проксирует запросы на бэкенд (Express).
  // Адрес бэкенда задаётся переменной API_URL (локально это localhost:5000).
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${API_URL}/:path*` },
      { source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
