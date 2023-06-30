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
  let [countResume, setCountResume] = useState({
    countPaidSftpSup: 0,
    countPendingSftpSup: 0,
    countPaidSftpCli: 0,
    countPendingSftpCli: 0,
    countPaidB2BSup: 0,
    countPendingB2BSup: 0,
    countPaidB2BCli: 0,
    countPendingB2BCli: 0
  });
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
          setClientPendingBills([response.client_pending.BillingDetails]);
        } else {
          setClientPendingBills(response.client_pending.BillingDetails);
        }
      }
      if (response.supplier_paid != null) {
        if (response.supplier_paid.BillingDetails.length == 1) {
          response.supplier_paid.BillingDetails = [response.supplier_paid.BillingDetails]
        }
        setSupplierPaidBills(response.supplier_paid.BillingDetails);
      }
      if (response.supplier_pending != null) {
        if (response.supplier_pending.BillingDetails.length == 1) {
          setSupplierPendingBills([response.supplier_pending.BillingDetails]);
        } else {
          setSupplierPendingBills(response.supplier_pending.BillingDetails);
        }
      }
      if (response.bank_statement != null) {
        setBankStatement(response.bank_statement.BankStatement);
      }
      countSFTP()
    });
  }

  function countSFTP() {
    let countPaidSftpSup = 0;
    let countPendingSftpSup = 0;
    let countPaidSftpCli = 0;
    let countPendingSftpCli = 0;
    let countPaidB2BSup = 0;
    let countPendingB2BSup = 0;
    let countPaidB2BCli = 0;
    let countPendingB2BCli = 0;
    if (supplierPaidBills.length != 0) {
      countPaidSftpSup = supplierPaidBills.filter(bill => bill.client === "999").length
      countPaidB2BSup = supplierPaidBills.filter(client => client.client !== "999").length
    }
    if (supplierPendingBills.length != 0) {
      countPendingSftpSup = supplierPendingBills.filter(bill => bill.client === "999").length
      countPendingB2BSup = supplierPendingBills.filter(client => client.client !== "999").length
    }
    if (clientPaidBills.length != 0) {
      countPaidSftpCli = clientPaidBills.filter(bill => bill.supplier === "1000").length
      countPaidB2BCli = clientPaidBills.filter(supplier => supplier.supplier !== "1000").length
    }
    if (clientPendingBills.length != 0) {
      countPendingSftpCli = clientPendingBills.filter(bill => bill.supplier === "1000").length
      countPendingB2BCli = clientPendingBills.filter(supplier => supplier.supplier !== "1000").length
    }
    setCountResume({
      countPaidSftpSup: countPaidSftpSup,
      countPendingSftpSup: countPendingSftpSup,
      countPaidSftpCli: countPaidSftpCli,
      countPendingSftpCli: countPendingSftpCli,
      countPaidB2BSup: countPaidB2BSup,
      countPendingB2BSup: countPendingB2BSup,
      countPaidB2BCli: countPaidB2BCli,
      countPendingB2BCli: countPendingB2BCli
    })
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
          <div className="col-12 col-lg-4">
            <h3> Resumen general </h3>
            <p> Balance : {bankStatement.balance} </p>
            <p> Total pagadas por nosotros: {clientPaidBills.length} </p>
            <p> Total pendientes por nosotros: {clientPendingBills.length} </p>
            <p> Total pagadas hacia nosotros: {supplierPaidBills.length} </p>
            <p> Total pendientes hacia nosotros: {supplierPendingBills.length} </p>
          </div>

          {/* Resumen facturas emitidas --> Barchart */}
          <div className="col-12 col-lg-4">
            <h3> Resumen facturas emitidas </h3>
            <p> Total SFTP pagadas: {countResume.countPaidSftpSup} </p>
            <p> Total SFTP pendientes: {countResume.countPendingSftpSup} </p>
            <p> Total B2B pagadas: {countResume.countPaidB2BSup} </p>
            <p> Total B2B pendientes: {countResume.countPendingB2BSup} </p>
          </div>

          {/* Resumen facturas recibidas --> Barchart */}
          <div className="col-12 col-lg-4">
            <h3> Resumen facturas recibidas </h3>
            <p> Total SFTP pagadas: {countResume.countPaidSftpCli} </p>
            <p> Total SFTP pendientes: {countResume.countPendingSftpCli} </p>
            <p> Total B2B pagadas: {countResume.countPaidB2BCli} </p>
            <p> Total B2B pendientes: {countResume.countPendingB2BCli} </p>
          </div>

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
