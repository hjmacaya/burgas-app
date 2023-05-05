import Navbar from "../components/navbar"
import Chart from "chart.js"

export default function Home() {

  // Initialize the mock-up data
  const data = [
    { date: "2023-01-05", count: 5 },
    { date: "2023-02-05", count: 3 },
    { date: "2023-03-05", count: 6 },
    { date: "2023-04-05", count: 4 },
    { date: "2023-05-05", count: 7 }
  ]

  // Create chart
  let barChart = () => {
    let stockChartDiv = document.getElementById("stock-chart")
    new Chart( document.getElementById("stock-chart"), {
    type: 'bar',
    data: {
      labels: data.map(row => row.date),
      datasets: [
        {
          label: 'Burgers Stocks',
          data: data.map(row => row.count)
        }
      ]
    }
  })
  }

  return (
    <div>
      <Navbar />
        <div className="container text-center my-3">
          <h1>Our stocks: </h1>
          <div id="stock-chart"></div>
        </div>
    </div>
  )
}
