import axios from "axios";

const apiOrigin = 'https://prod.api-proyecto.2023-1.tallerdeintegracion.cl';
const apiRequester = axios.create({
  baseURL: apiOrigin,
});

const errorGenerator = (e) => {
    const errorResponse = {
      type: "unexpected",
      message:
        "Algo salió mal. Por favor, revisa tu conexión o intenta ingresar más tarde",
    };
    return errorResponse;
  };

async function apiAuth(group, secret) {
  try {
    const path = "/warehouse/auth";
    const body = { group: group, secret: secret }
    const response = await axios.post(path, body)
    console.log(response)
    return response.data.token
  } catch (e) {
    return errorGenerator(e);
  }
}

async function apiGetStores(token) {
  try {
    const path = "/warehouse/stores"
    const config = { headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token} }
    const response = await axios.get(path, config)
    return response.data
  } catch (e) {
    return errorGenerator(e);
  }
}

async function apiGetInventory(token, storeId) {
  try {
    const path = `/warehouse/stores/${storeId}/inventory`;
    const response = await axios.get(path, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (e) {
    return errorGenerator(e);
  }
}

async function apiGetProducts(token, storeId, sku) {
  try {
    const path = `/warehouse/stores/${storeId}/products?sku=${sku}`;
    const response = await axios.get(path, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (e) {
    return errorGenerator(e);
  }
}

async function apiGetOrders() {
  try {
    const path = "/api/ordenes-compra"; // Update the path to the local API route
    const response = await axios.get(path);
    return response.data;
  } catch (e) {
    return errorGenerator(e);
  }
}

async function apiGetInvoices() {
  try {
    const path = "/api/facturas"; // Update the path to the local API route
    const response = await axios.get(path);
    return response.data;
  } catch (e) {
    return errorGenerator(e);
  }
}

export { apiAuth, apiGetStores, apiGetProducts, apiGetInventory, apiGetOrders, apiGetInvoices };
