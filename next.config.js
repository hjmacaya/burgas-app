 /** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   swcMinifyMode: true,
   env: {
    ENVIRIOMENT: process.env.ENVIRIOMENT,
    GROUP: process.env.GROUP,
    PROD_SECRET: process.env.PROD_SECRET,
    DEV_SECRET: process.env.DEV_SECRET,
    WSLD_DEV: process.env.WSLD_DEV,
    WSLD_PROD: process.env.WSLD_PROD,
   },

   //  Handling 'fs' module error
   webpack5: true,
    webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
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
      }
    ]
   }
}

module.exports = nextConfig
