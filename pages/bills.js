import Navbar from "../components/navbar"
import { apiGetInvoices } from "./api/apiservice"
import React, { useState, useEffect, useRef } from "react"
import axios from "axios";

// Get the env variables
const envirioment = process.env.ENVIRIOMENT;
const group = parseInt(process.env.GROUP); // env only save str values
const secret = envirioment == "dev" ? process.env.DEV_SECRET : process.env.PROD_SECRET;
const wsdl = envirioment == "dev" ? process.env.WSLD_DEV : process.env.WSLD_PROD;

export default function BillsView() {

  // Set the state variables
  let [clientPaidBills, setClientPaidBills] = useState([]);
  let [clientPendingBills, setClientPendingBills] = useState([]);
  let [supplierPaidBills, setSupplierPaidBills] = useState([]);
  let [supplierPendingBills, setSupplierPendingBills] = useState([]);
  let [bankStatement, setBankStatement] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  // Set the current bills
  useEffect(() => {
    try {
      // Step 1: fetch the token
      prepare_information()
    } catch (err) {
      console.error(err)
    }
  }, [])

  function prepare_information() {
    apiGetInvoices()
    .then((response) => {
      console.log(response)
      // Revisar que no sean null y que el largo no sea 1
      if (response.client_paid != null) {
        if (response.client_paid.BillingDetails.length == 1) {
          response.client_paid.BillingDetails = [response.client_paid.BillingDetails]
        }
        setClientPaidBills(response.client_paid.BillingDetails);
      }
      if (response.client_pending != null) {
        if (response.client_pending.BillingDetails.length == 1) {
          response.client_pending.BillingDetails = [response.client_pending.BillingDetails]
        }
        setClientPendingBills(response.client_pending.BillingDetails);
      }
      if (response.supplier_paid != null) {
        if (response.supplier_paid.BillingDetails.length == 1) {
          response.supplier_paid.BillingDetails = [response.supplier_paid.BillingDetails]
        }
        setSupplierPaidBills(response.supplier_paid.BillingDetails);
      }
      if (response.supplier_pending != null) {
        if (response.supplier_pending.BillingDetails.length == 1) {
          response.supplier_pending.BillingDetails = [response.supplier_pending.BillingDetails]
        }
        setSupplierPendingBills(response.supplier_pending.BillingDetails);
      }
      if (response.bank_statement != null) {
        setBankStatement(response.bank_statement.BankStatement);
      }
    });
  }

  function handleFilterChange(event) {
    setFilterValue(event.target.value);
  }

  // Filter the orders based on the selected filter value
  // const filteredBills = currentBills.filter((bill) =>
  //   bill.status.includes("paid")
  // );

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

        {/* Resumen de facturas */}
        <div className="row my-4">
          <h2> Resumen de facturas </h2>

          {/* Bank Statement */}


          {/* Resumen facturas emitidas --> Barchart */}

          {/* Resumen facturas recibidas --> Barchart */}
        </div>


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
          <h3> Facturas emitidas </h3>
          <table className="table table-striped shadow table-scrollbar">
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
              {supplierPaidBills.map((bill) => {
                return(
                  <tr key={bill.id}>
                    <th> {bill.id} </th>
                    <td> {bill.client} </td>
                    <td> {bill.supplier} </td>
                    <td> {bill.status} </td>
                    <td> {bill.price} </td>
                    <td> {bill.interest} </td>
                    <td> {bill.totalPrice} </td>
                  </tr>
                )
              })}
              {supplierPendingBills.map((bill) => {
                return(
                  <tr key={bill.id}>
                    <th> {bill.id} </th>
                    <td> {bill.client} </td>
                    <td> {bill.supplier} </td>
                    <td> {bill.status} </td>
                    <td> {bill.price} </td>
                    <td> {bill.interest} </td>
                    <td> {bill.totalPrice} </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Facturas recibidas */}
        <div className="row my-4 table-scrollbar">
          <h3> Facturas recibidas </h3>
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
            {clientPaidBills.map((bill) => {
                return(
                  <tr key={bill.id}>
                    <th> {bill.id} </th>
                    <td> {bill.client} </td>
                    <td> {bill.supplier} </td>
                    <td> {bill.status} </td>
                    <td> {bill.price} </td>
                    <td> {bill.interest} </td>
                    <td> {bill.totalPrice} </td>
                  </tr>
                )
              })}
              {clientPendingBills.map((bill) => {
                return(
                  <tr key={bill.id}>
                    <th> {bill.id} </th>
                    <td> {bill.client} </td>
                    <td> {bill.supplier} </td>
                    <td> {bill.status} </td>
                    <td> {bill.price} </td>
                    <td> {bill.interest} </td>
                    <td> {bill.totalPrice} </td>
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
