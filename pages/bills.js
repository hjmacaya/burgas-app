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
  const [filterValue, setFilterValue] = useState("");

  function handleFilterChange(event) {
    setFilterValue(event.target.value);
  }

  // Filter the orders based on the selected filter value
  const filteredBills = currentBills.filter((bill) =>
    bill.estado.includes(filterValue)
  );

  // Filter button click handler
  function handleFilterButtonClick(estado) {
    if (estado == "Todas") {
      setFilterValue("");
      return;
    }
    let estado_valido = estado.slice(0, -1)
    estado_valido = estado_valido.toLowerCase()
    setFilterValue(estado_valido);
  }

  // Available "estados" for filtering
  const estados = [
    "Todas",
    "Pendientes",
    "Pagadas"
  ];

  return (
    <div>
      <Navbar />
      <div className="container text-center my-3">

      <div className="col-12 d-flex justify-content-between">

        <div>
          <h2> Historial de facturas </h2>
        </div>

        <div>
          {/* Filter buttons */}
          {estados.map((estado) => (
            <button
              key={estado}
              className={`btn ${
                filterValue === estado ? "btn-outline-dark" : "btn-dark"
              } mx-2`}
              onClick={() => handleFilterButtonClick(estado)}
            >
              {estado}
            </button>
          ))}
        </div>

      </div>

        {/* Facturas emitidas */}
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
