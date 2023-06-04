import Navbar from "../components/navbar"
import BarChart from "../components/barchart"
import DonutChart from "../components/donutchart"
import LineChart from "../components/linechart"
import React, { useState, useEffect, useRef } from "react"
import { apiAuth, apiGetInventory, apiGetProducts, apiGetStores } from "./api/apiservice"
import axios from "axios"
import productos from "../data/productos.json" assert { type: 'json' }
import ordenes from "../data/orders.json" assert { type: 'json' }
import { FaJediOrder } from "react-icons/fa"

export default function Home() {
  let [users, setUsers] = useState({});
  // let [token, setToken] = useState();
  // let [stores, setStores] = useState([]);
  let [principal, setPrincipal] = useState({});
  let [kitchen, setKitchen] = useState({});
  let [buffer, setBuffer] = useState({});
  let [currentStore, setCurrentStore] = useState({});
  let [currentProducts, setCurrentProducts] = useState([]);
  let [currentOrders, setCurrentOrders] = useState([]);
  let [currentProduct, setCurrentProduct] = useState();
  let token = useRef()
  let stores = useRef([])
  let percentege = useRef(0)

  // Get the env variables
  const group = parseInt(process.env.GROUP); // env only save str values
  const secret = process.env.SECRET;

  // Get token and stores
  useEffect(() => {
    
    setCurrentOrders(ordenes)
    // const fetchStores = async () => {
    //   try {

    //     // Step 1: fetch the token
    //     const token1 = await apiAuth(group, secret)
    //     // setToken(await Promise.resolve(token1))
    //     token.current = await Promise.resolve(token1)
    //     console.log("t", token)

    //     // Step 2: fetch the stores
    //     const stores1 = await apiGetStores(token.current)
    //     // setStores(await Promise.all(stores1))
    //     stores.current = await Promise.all(stores1)
    //     console.log("s", stores)

    //     // Step 3: Set the specific stores
    //     identifyStores(stores.current)
    //     console.log("%", principal.usedPercentege)
    //     console.log(kitchen)
    //     console.log(principal)
    //     console.log(buffer)

    //   } catch (err) {
    //     console.error(err)
    //   }
    // }
    // fetchStores()
  }, [])

  // Function to identify and set the stores
  function identifyStores(stores) {
    // Iterate over the stores and save them in the useState variables
    stores.forEach((store) => {
      let usedPercentege = ((store.usedSpace / store.totalSpace)*100)
      console.log("Porcentaje", usedPercentege)
      if (store.kitchen) {
        setKitchen({
          id: store._id,
          name: "Cocina",
          totalSpace: store.totalSpace,
          usedSpace: store.usedSpace,
          usedPercentege: usedPercentege,
          unUsedSpace: store.totalSpace - store.usedSpace,
          description: "Es un bodega de espacio reducido que tiene como proposito ser la bodega que recibe los ingredientes para luego producir las hamburguesas."
        })
      } else if (store.buffer) {
        setBuffer({
          id: store._id,
          name: "Buffer",
          totalSpace: store.totalSpace,
          usedSpace: store.usedSpace,
          usedPercentege: usedPercentege,
          unUsedSpace: store.totalSpace - store.usedSpace,
          description: "Es una bodega especial, ya que posee un espacio \"ilimitado\". Por esto mismo, cuando alguna de las demás bodegas se encuentre llena, el producto será insertado en esta bodega. Es importante destacar que el uso de esta bodega tiene asociado un costo extra."
        })
      } else {
        setPrincipal({
          id: store._id,
          name: "Principal",
          totalSpace: store.totalSpace,
          usedSpace: store.usedSpace,
          usedPercentege: usedPercentege,
          unUsedSpace: store.totalSpace - store.usedSpace,
          description: "Es una bodega grande destinada al acopio de ingredientes. Esta bodega tiene una capacidad limitada."
        })
      }
    })
  }

  // Function to find the sku info
  function changeTime(dt) {
    let ms = Date.parse(dt);
    let fecha = new Date(ms).toLocaleString();
    return fecha;
  }

  // Function to handle the click
  const handleStoreClick = async (store) => {

    // Set the clicked store
    setCurrentStore(store)
    let usedPercentege = ((store.usedSpace / store.totalSpace)*100).toFixed(1)
    percentege.current = usedPercentege

    // Get the products of the store
    try {
      const products = await apiGetInventory(token.current, store.id)
      console.log(products)
      setCurrentProducts(products)
    } catch (err) {
      console.error(err)
    }
  }

  // Create the mock-up data
  // const barchartData = {
  //   // Define the options for the chart
  //   options: {
  //     responsive: true,
  //     plugins: {
  //       legend: {
  //         position: 'top',
  //       },
  //     },
  //     maintainAspectRatio: false, // This is to make the chart responsive to width and height
  //   },

  //   // Initialize the mock-up data
  //   data: {
  //     labels: ["2023-01-05", "2023-02-05", "2023-03-05", "2023-04-05", "2023-05-05"],
  //     datasets: [
  //       {
  //         label: 'Burgas count',
  //         data: [5, 3, 6, 4, 7],
  //         backgroundColor: '#0F3460'
  //       }
  //     ]
  //   }
  // }

  const donutchartData = {
    options: {
      responsive: true,
      maintainAspectRatio: false, // This is to make the chart responsive to width and height
    },

    data: {
      labels: ['Usado', 'No usado'],
      datasets: [
        {
          label: 'cantidad de espacio',
          data: [currentStore.usedSpace, currentStore.unUsedSpace],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    plugins: {
      id: 'centerTextDonut',
      afterDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data } = chart
        ctx.save()
        // Set font size and text
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = 'bold 24px sans-serif'
        let text = `${percentege.current}%`

        // Get the center of chart
        const x = chart.getDatasetMeta(0).data[0].x
        const y = chart.getDatasetMeta(0).data[0].y

        // Fill center with text
        ctx.fillText(text, x, y)

      }
    }
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
