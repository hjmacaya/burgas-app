import { createClient, WSSecurity } from 'soap';
import { inspect } from 'util';
import { parseStringPromise } from 'xml2js';

function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

function getInvoicesData(wsdl, group, secret) {
  let invoices = [];
  createClient(wsdl, {}, function(err, client) {
    console.log("Client describe: ", client.describe())
    let wsSecurity = new WSSecurity(group.toString(), secret, {})
    client.setSecurity(wsSecurity);
    console.log(wsSecurity)

    // Get balance
    client.getBankStatement({side: 'client'}, function(err, result) {
      console.log("Bankkk:", JSON.stringify(result));
    });

    // Get invoices
    client.getInvoices({side: 'client', status: 'pending'}, function(err, result) {
      console.log("Invoices: ", JSON.stringify(result));
      invoices = JSON.stringify(result)
    })

    return invoices
  });
}

export default function handler(req, res) {
  const environment = process.env.ENVIRIOMENT;
  const group = parseInt(process.env.GROUP);
  const secret = environment === 'dev' ? process.env.DEV_SECRET : process.env.PROD_SECRET;
  const wsdl = environment === 'dev' ? process.env.WSLD_DEV : process.env.WSLD_PROD;

  const invoices = getInvoicesData(wsdl, group, secret);

  res.status(200).json({ invoices });
}
