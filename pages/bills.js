import Navbar from "../components/navbar"
import BarChart from "../components/barchart"
import DonutChart from "../components/donutchart"
import LineChart from "../components/linechart"
import React, { useState, useEffect, useRef } from "react"
import { apiGetOrders } from "./api/apiservice"
import axios from "axios"
import productos from "../data/productos.json" assert { type: 'json' }
import ordenes from "../data/orders.json" assert { type: 'json' }
import { FaJediOrder } from "react-icons/fa"

// Get the env variables
const envirioment = process.env.ENVIRIOMENT;
const group = parseInt(process.env.GROUP); // env only save str values
const secret = envirioment == "dev" ? process.env.DEV_SECRET : process.env.PROD_SECRET;

export default function BillsView() {

  // Set the state variables
  let [currentBills, setCurrentBills] = useState([]);

  return (
    <div>
      <Navbar />
      <div className="container text-center m-3 p-3">
        <h2>Historial de Facturas</h2>


        <div className="row my-4">
            <table className="table table-striped shadow">
              <thead>
                <tr>
                  <th scope="col">Id OC</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Proveedor</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Intereses</th>
                  <th scope="col">Precio total</th>
                </tr>
              </thead>
              <tbody>
                {currentBills.map((bill) => {
                  return(
                    <tr key={bill.id}>
                      <th> {bill.id} </th>
                      <td> {bill.cliente} </td>
                      <td> {bill.proveedor} </td>
                      <td> {bill.estado} </td>
                      <td> {bill.precio} </td>
                      <td> {changeTime(bill.intereses)} </td>
                      <td> {bill.precioTotal} </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>


      </div>

    </div>
  )

}
