 /** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   swcMinifyMode: true,
   env: {
    ENVIRIOMENT: process.env.ENVIRIOMENT,
    GROUP: process.env.GROUP,
    PROD_SECRET: process.env.PROD_SECRET,
    DEV_SECRET: process.env.DEV_SECRET,
   },
   async rewrites() {
    return [
      {
        source: "/warehouse/auth",
        destination: `https://${process.env.ENVIRIOMENT}.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/auth`
      },
      {
        source: "/warehouse/stores",
        destination: `https://${process.env.ENVIRIOMENT}.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/stores`
      },
      {
        source: "/warehouse/stores/:storeId/inventory",
        destination: `https://${process.env.ENVIRIOMENT}.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/stores/:storeId/inventory`
      },
      {
        source: "/warehouse/stores/:storeId/products/:sku",
        destination: `https://${process.env.ENVIRIOMENT}.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/stores/:storeId/products/:sku`
      },
      {
        source: "/lagarto/ordenes-compra",
        destination: "http://lagarto6.ing.puc.cl/ordenes-compra"
      }
    ]
   }
}

module.exports = nextConfig

// {
//   source: "/ordenes-compra",
//   destination: `https://${process.env.ENVIRIOMENT}.api-proyecto.2023-1.tallerdeintegracion.cl/warehouse/stores/:storeId/products/:sku`
// }
