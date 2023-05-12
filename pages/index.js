import Navbar from "../components/navbar"
import BarChart from "../components/barchart"
import DonutChart from "../components/donutchart"
import LineChart from "../components/linechart"
import React, { useState, useEffect, useRef } from "react"
import { apiAuth, apiGetInventory, apiGetProducts, apiGetStores } from "./api/apiservice"
import axios from "axios"
import productos from "../data/productos.json" assert { type: 'json' }

export default function Home() {
  let [users, setUsers] = useState({});
  let [principal, setPrincipal] = useState({});
  let [kitchen, setKitchen] = useState({});
  let [buffer, setBuffer] = useState({});
  let [currentStore, setCurrentStore] = useState({});
  let [currentProducts, setCurrentProducts] = useState([]);
  let [currentProduct, setCurrentProduct] = useState();
  let token = useRef()
  let stores = useRef([])
  let percentege = useRef(0)

  // Get the env variables
  const group = parseInt(process.env.GROUP); // env only save str values
  const secret = process.env.SECRET;

  // Get token and stores
  useEffect(() => {
    const fetchStores = async () => {
      try {

        // Step 1: fetch the token
        const token1 = await apiAuth(group, secret)
        // setToken(await Promise.resolve(token1))
        token.current = await Promise.resolve(token1)
        console.log("t", token)

        // Step 2: fetch the stores
        const stores1 = await apiGetStores(token.current)
        // setStores(await Promise.all(stores1))
        stores.current = await Promise.all(stores1)
        console.log("s", stores)

        // Step 3: Set the specific stores
        identifyStores(stores.current)
        console.log("%", principal.usedPercentege)
        console.log(kitchen)
        console.log(principal)
        console.log(buffer)

      } catch (err) {
        console.error(err)
      }
    }
    fetchStores()
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
  function findSKU(sku) {
    let nombre = "Por definir";
    productos.forEach((producto) => {
      // console.log("Nombre", producto.Nombre)
      if (producto.SKU == sku) {
        nombre = producto.Nombre;
      }
    })
    return nombre;
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
  // const linechartData = {
  //   options: {
  //     responsive: true,
  //     plugins:{
  //       title: {
  //         display:true,
  //         text: 'Ingresos por venta',
  //         font: {
  //           size: 18,
  //         },
  //       },
  //     },
  //     maintainAspectRatio: false, // This is to make the chart responsive to width and height
  //   },
  //   data: {
  //     labels: ["2023-01-05", "2023-02-05", "2023-03-05", "2023-04-05", "2023-05-05"],
  //     datasets: [
  //       {
  //         label: "Venta Burgas",
  //         data: [100, 84, 77, 86, 98],
  //         borderColor: 'rgb(233, 69, 96)',
  //         backgroundColor: 'rgb(233, 69, 96, 0.5)',
  //       }
  //     ]
  //   }
  // }

  return (
    <div>
      <Navbar />
        <div className="container text-center my-3" >

          {/* Inventory */}
          <div className="row my-4">
            <div className="col-12 d-flex justify-content-between">
              <div>
                <h2> Bodega {currentStore.name}</h2>
              </div>

              <div>
                <div className="d-flex justify-content-center">
                  <button className="btn btn-dark mx-2" onClick={() => handleStoreClick(principal)}> Principal </button>
                  <button className="btn btn-dark mx-2" onClick={() => handleStoreClick(kitchen)}> Cocina </button>
                  <button className="btn btn-dark mx-2" onClick={() => handleStoreClick(buffer)}> Buffer </button>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row my-4">

            {/* Store Description */}
            <div className="col-12 col-lg-6 border p-3">
              <h3> Descripción </h3>
              <p className="store-description">
                {currentStore.description}
              </p>
            </div>

            {/* Inventory usage */}
            <div className="col-12 col-lg-6 border p-3">
              <h3> Estado de capacidad inventario: </h3>
              <DonutChart data={donutchartData.data} options={donutchartData.options} plugins={donutchartData.plugins} />
            </div>


          </div>

          {/* Productos en el inventario */}
          <div className="row my-4">
            <h3> Productos en el inventario: </h3>
            <table className="table table-striped shadow">
              <thead>
                <tr>
                  <th scope="col">SKU</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => {
                  return(
                    <tr key={product.sku}>
                      <th> {product.sku} </th>
                      <td> {findSKU(product.sku)} </td>
                      <td> {product.quantity} </td>
                      <td> <button className="btn btn-dark" disabled> Graficar </button> </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>




          {/* Sales stadistics - Lines charts
          <div className="row my-4">

            <h2> Algunos indicadores: </h2>

            <div className="col-12 col-lg-4">
              <LineChart data={linechartData.data} options={linechartData.options} />
            </div>

            <div className="col-12 col-lg-4">
              <LineChart data={linechartData.data} options={linechartData.options} />
            </div>

            <div className="col-12 col-lg-4">
              <LineChart data={linechartData.data} options={linechartData.options} />
            </div>

          </div> */}


          {/* <div className="row my-3">


            <div className="col-12 col-lg-6 border">
              <h2> Inventario de burgas: </h2>
              <BarChart data={barchartData.data} options={barchartData.options}/>
            </div> */}

            {/* <div className="col-12 col-lg-6 border">
              <h2> Ventas por tipo de burga: </h2>
              <DonutChart data={donutchartData.data} options={donutchartData.options} />
            </div>
          </div> */}

        </div>
    </div>
  )
}
