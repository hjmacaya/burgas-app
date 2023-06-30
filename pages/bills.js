import Navbar from "../components/navbar"
import { apiGetInvoices } from "./api/apiservice"
import React, { useState, useEffect, useRef } from "react"

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
  let [currentEmittedBills, setCurrentEmittedBills] = useState([]);
  let [currentRecievedBills, setCurrentRecievedBills] = useState([]);
  let [bankStatement, setBankStatement] = useState([]);
  const [filterValueEmitted, setFilterValueEmitted] = useState("");
  const [filterValueRecieved, setFilterValueRecieved] = useState("");

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
        if (!Array.isArray(response.client_paid.BillingDetails)) {
          setClientPaidBills([response.client_paid.BillingDetails]);
        } else {
          setClientPaidBills(response.client_paid.BillingDetails);
        }
      }
      if (response.client_pending != null) {
        if (!Array.isArray(response.client_pending.BillingDetails)) {
          setClientPendingBills([response.client_pending.BillingDetails]);
        } else {
          setClientPendingBills(response.client_pending.BillingDetails);
        }
      }
      if (response.supplier_paid != null) {
        if (!Array.isArray(response.supplier_paid.BillingDetails)) {
          setSupplierPaidBills([response.supplier_paid.BillingDetails]);
        } else {
          setSupplierPaidBills(response.supplier_paid.BillingDetails);
        }
      }
      if (response.supplier_pending != null) {
        if (!Array.isArray(response.supplier_pending.BillingDetails)) {
          setSupplierPendingBills([response.supplier_pending.BillingDetails]);
        } else {
          setSupplierPendingBills(response.supplier_pending.BillingDetails);
        }
      }
      if (response.bank_statement != null) {
        setBankStatement(response.bank_statement.BankStatement);
      }

      // Set the current bills
      setCurrentEmittedBills(supplierPaidBills.concat(supplierPendingBills));
      setCurrentRecievedBills(clientPaidBills.concat(clientPendingBills));
    });
  }

  function handleFilterChange(event) {
    setFilterValue(event.target.value);
  }

  // Filter the emitted bills based on the selected filter value
  const filteredEmittedBills = currentEmittedBills.filter((bill) =>
    bill.status.includes(filterValueEmitted)
  );

  // Filter the recivied bills based on the selected filter value
  const filteredRecievedBills = currentRecievedBills.filter((bill) =>
    bill.status.includes(filterValueRecieved)
  );

  // Filter button click handler
  function handleFilterButtonClick(estado, tipo) {
    if (tipo === "emitted") {
      if (estado === "Todas") {
        setCurrentEmittedBills(supplierPaidBills.concat(supplierPendingBills));
      } else if (estado === "Pagadas") {
        setCurrentEmittedBills(supplierPaidBills);
      } else {
        setCurrentEmittedBills(supplierPendingBills);
      }
    } else {
      if (estado === "Todas") {
        setCurrentRecievedBills(clientPaidBills.concat(clientPendingBills));
      } else if (estado === "Pagadas") {
        setCurrentRecievedBills(clientPaidBills);
      } else {
        setCurrentRecievedBills(clientPendingBills);
      }
    }
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
          <div className="col-12 col-lg-4">
            <h3> Resumen general </h3>
            {bankStatement.length === 0 ? <p> Cargando... </p> : <div>
            <p> Balance : {bankStatement.balance} </p>
            <p> Total pagadas por nosotros: {clientPaidBills.length} </p>
            <p> Total pendientes por nosotros: {clientPendingBills.length} </p>
            <p> Total pagadas hacia nosotros: {supplierPaidBills.length} </p>
            <p> Total pendientes hacia nosotros: {supplierPendingBills.length} </p>
            </div>}
          </div>

          {/* Resumen facturas emitidas --> Barchart */}
          <div className="col-12 col-lg-4">
            <h3> Resumen facturas emitidas </h3>
            {supplierPaidBills.length === 0 ? <p> Cargando... </p> : <div>
            <p> Total SFTP pagadas: {supplierPaidBills.filter(bill => bill.client === "999").length} </p>
            <p> Total SFTP pendientes: {supplierPendingBills.filter(bill => bill.client === "999").length} </p>
            <p> Total B2B pagadas: {supplierPaidBills.filter(client => client.client !== "999").length} </p>
            <p> Total B2B pendientes: {supplierPendingBills.filter(client => client.client !== "999").length} </p>
            </div>}
          </div>

          {/* Resumen facturas recibidas --> Barchart */}
          <div className="col-12 col-lg-4">
            <h3> Resumen facturas recibidas </h3>
            {clientPaidBills.length === 0 ? <p> Cargando... </p> : <div>
            <p> Total SFTP pagadas: {clientPaidBills.filter(bill => bill.supplier === "1000").length} </p>
            <p> Total SFTP pendientes: {clientPaidBills.filter(supplier => supplier.supplier !== "1000").length} </p>
            <p> Total B2B pagadas: {clientPendingBills.filter(bill => bill.supplier === "1000").length} </p>
            <p> Total B2B pendientes: {clientPendingBills.filter(supplier => supplier.supplier !== "1000").length} </p>
            </div>}
          </div>

        </div>


        <div className="col-12 d-flex justify-content-between">

          <div>
            <h3> Historial de facturas emitidas </h3>
          </div>

          <div>
            {/* Filter buttons */}
            {estados.map((estado) => (
              <button
                key={estado}
                className={`btn ${
                  filterValueEmitted === estado ? "btn-outline-dark" : "btn-dark"
                } mx-2`}
                onClick={() => handleFilterButtonClick(estado, "emitted")}
              >
                {estado}
              </button>
            ))}
          </div>

        </div>

        {/* Facturas emitidas */}
        <div className="row my-4 table-scrollbar">
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
              {currentEmittedBills.length === 0 ? null : currentEmittedBills.map((bill) => {
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
            {/* <tbody>
              {supplierPaidBills.length === 0 ? null : supplierPaidBills.map((bill) => {
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

              {supplierPendingBills.length === 0 ? null : supplierPendingBills.map((bill) => {
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
            </tbody> */}
          </table>
        </div>

        {/* Facturas recibidas */}

        <div className="col-12 d-flex justify-content-between">
          <div>
            <h3> Historial de facturas recibidas </h3>
          </div>

          <div>
            {/* Filter buttons */}
            {estados.map((estado) => (
              <button
                key={estado}
                className={`btn ${
                  filterValueRecieved === estado ? "btn-outline-dark" : "btn-dark"
                } mx-2`}
                onClick={() => handleFilterButtonClick(estado, "recieved")}
              >
                {estado}
              </button>
            ))}
          </div>

        </div>


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
            {currentRecievedBills.length === 0 ? null : currentRecievedBills.map((bill) => {
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
            {/* <tbody>
            {clientPaidBills.length === 0 ? null : clientPaidBills.map((bill) => {
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
              {clientPendingBills.length === 0 ? null : clientPendingBills.map((bill) => {
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
            </tbody> */}
          </table>
        </div>


      </div>

    </div>
  )

}
