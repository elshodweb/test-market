const nextConfig = {
  output: "export",
  trailingSlash: true,

  // Ваши другие настройки NextConfig, если они есть
  images: {
    unoptimized: true,
    domains: ["encrypted-tbn2.gstatic.com"],
  },
};

export default nextConfig;
