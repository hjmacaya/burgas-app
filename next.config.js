 /** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   swcMinifyMode: true,
   env: {
    GROUP: process.env.GROUP,
    SECRET: process.env.SECRET,
   },
   async rewrites() {
    return [
      {
        source: "/warehouse/auth",
        destination: "https://dev.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/auth"
      },
      {
        source: "/warehouse/stores",
        destination: "https://dev.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/stores"
      },
      {
        source: "/warehouse/stores/:storeId/inventory",
        destination: "https://dev.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/stores/:storeId/inventory"
      },
      {
        source: "/warehouse/stores/:storeId/products/:sku",
        destination: "https://dev.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/stores/:storeId/products/:sku"
      }
    ]
   }
}

module.exports = nextConfig
