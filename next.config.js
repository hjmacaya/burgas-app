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
        destination: "https://prod.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/auth"
      },
      {
        source: "/warehouse/stores",
        destination: "https://prod.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/stores"
      },
      {
        source: "/warehouse/stores/:storeId/inventory",
        destination: "https://prod.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/stores/:storeId/inventory"
      },
      {
        source: "/warehouse/stores/:storeId/products/:sku",
        destination: "https://prod.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/stores/:storeId/products/:sku"
      },
      {
        source: "/ordenes-compra",
        destination: "http://lagarto6.ing.puc.cl/ordenes-compra"
      }
    ]
   }
}

module.exports = nextConfig
