import { createClient, WSSecurity } from 'soap';

function createSoapClient(url) {
  return new Promise((resolve, reject) => {
    createClient(url, (err, client) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
}

function callSoapMethod(client, methodName, params) {
  return new Promise((resolve, reject) => {
    client[methodName](params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function consumeAPI() {
  try {
    const environment = process.env.ENVIRIOMENT;
    const group = parseInt(process.env.GROUP);
    const secret = environment === 'dev' ? process.env.DEV_SECRET : process.env.PROD_SECRET;
    const wsdl = environment === 'dev' ? process.env.WSLD_DEV : process.env.WSLD_PROD;
    const client = await createSoapClient(wsdl);
    let wsSecurity = new WSSecurity(group.toString(), secret, {})
    client.setSecurity(wsSecurity);
    const supplier_paid = await callSoapMethod(client, 'getInvoices', {side: 'supplier', status: 'paid'});
    const supplier_pending = await callSoapMethod(client, 'getInvoices', {side: 'supplier', status: 'pending'});
    const client_paid = await callSoapMethod(client, 'getInvoices', {side: 'client', status: 'paid'});
    const client_pending = await callSoapMethod(client, 'getInvoices', {side: 'client', status: 'pending'});
    let result = {
      "supplier_paid": supplier_paid,
      "supplier_pending": supplier_pending,
      "client_paid": client_paid,
      "client_pending": client_pending,
    }
    return result;
  } catch (err) {
    console.error('Error al consumir la API SOAP:', err);
    throw err;
  }
}


export default function handler(req, res) {
  consumeAPI()
    .then(result => {
      // Utilizar el resultado aquí
      console.log('Resultado exitoso');
      res.status(200).json({ result });
    })
    .catch(err => {
      // Manejar el error aquí
      console.error('Error:', err);
  });

}
