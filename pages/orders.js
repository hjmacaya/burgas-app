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

export default function OrdenesView() {
  let [currentOrders, setCurrentOrders] = useState([]);

  // Get the env variables
  const envirioment = process.env.ENVIRIOMENT;
  const group = parseInt(process.env.GROUP); // env only save str values
  const secret = envirioment == "dev" ? process.env.DEV_SECRET : process.env.PROD_SECRET;

  // Get token and stores
  useEffect(() => {

    setCurrentOrders(ordenes)
    // try {
    //     // Step 1: fetch the token
    //     prepare_information()
    // } catch (err) {
    //     console.error(err)
    // }

  }, [])

  function prepare_information() {
    apiGetOrders()
    .then((response) => {
        setCurrentOrders(response);
    });
  }

  // Function to find the sku info
  function changeTime(dt) {
    let ms = Date.parse(dt);
    let fecha = new Date(ms).toLocaleString();
    return fecha;
  }

  return (
    <div>
      <Navbar />
        <div className="container text-center my-3" >

          {/* Inventory */}
          <div className="row my-4">
            <div className="col-12 d-flex justify-content-between">
              <div>
                <h2> Ordenes </h2>
              </div>
            </div>
          </div>

          <div className="row my-4">
            <h3> Historial de ordenes</h3>
            <table className="table table-striped shadow">
              <thead>
                <tr>
                  <th scope="col">Identificador</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Proveedor</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Fecha vencimiento</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => {
                  return(
                    <tr key={order.id}>
                      <th> {order.id} </th>
                      <td> {order.cliente} </td>
                      <td> {order.proveedor} </td>
                      <td> {order.sku} </td>
                      <td> {order.cantidad} </td>
                      <td> {changeTime(order.vencimiento)} </td>
                      <td> {order.estado} </td>
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
