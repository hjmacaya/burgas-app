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

export default function OrdenesView() {
  let buyOrders = useRef([]);
  const [currentOrders, setCurrentOrders] = useState([]); // State for the orders
  const [filterValue, setFilterValue] = useState(""); // State for the filter value

  // Get orders from the API
  useEffect(() => {

    try {
        // Step 1: fetch the token
      prepare_information()
    } catch (err) {
      console.error(err)
    }

  }, [])

  function prepare_information() {
    apiGetOrders()
    .then((response) => {
      console.log(response)
      setCurrentOrders(response);
    });
  }

  // Function to parse the date
  function changeTime(dt) {
    let ms = Date.parse(dt);
    let fecha = new Date(ms).toLocaleString();
    return fecha;
  }

  if (currentOrders.length == 0) {
    return (
      <div>
        <Navbar />
          <div className="container text-center my-3">
            No hay ordenes. Error al obtenerlas.
          </div>
      </div>
    )
  }

  function handleFilterChange(event) {
    setFilterValue(event.target.value);
  }

  // Filter the orders based on the selected filter value
  const filteredOrders = currentOrders.filter((order) =>
    order.estado.includes(filterValue)
  );

  // Filter button click handler
  function handleFilterButtonClick(estado) {
    if (estado == "Todas") {
      setFilterValue("");
      return;
    }
    if (estado == "Activas") {
      setFilterValue("creada");
      return;
    }
    let estado_valido = estado.slice(0, -1)
    estado_valido = estado_valido.toLowerCase()
    setFilterValue(estado_valido);
  }

  // Available "estados" for filtering
  const estados = [
    "Todas",
    "Aceptadas",
    "Rechazadas",
    "Activas",
    "Cumplidas",
    "Vencidas",
    "Anuladas",
  ];


  return (
    <div>
      <Navbar />
        <div className="container text-center my-3" >

          <div className="row my-4">
            <div className="col-12 d-flex justify-content-between">
              <div>
                <h2> Ordenes </h2>
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
          </div>

          <div className="row my-4 table-scrollbar">
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
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <th>{order._id}</th>
                  <td>{order.cliente}</td>
                  <td>{order.proveedor}</td>
                  <td>{order.sku}</td>
                  <td>{order.cantidad}</td>
                  <td>{changeTime(order.vencimiento)}</td>
                  <td>{order.estado}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

        </div>
    </div>
  )
}
