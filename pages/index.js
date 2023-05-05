import Navbar from "../components/navbar"
import BarChart from "../components/barchart"
import DonutChart from "../components/donutchart"

export default function Home() {

  // Create the mock-up data
  const barchartData = {
    // Define the options for the chart
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Burgas Stocks',
        },
      },
      maintainAspectRatio: true, // This is to make the chart responsive to width and height
    },

    // Initialize the mock-up data
    data: {
      labels: ["2023-01-05", "2023-02-05", "2023-03-05", "2023-04-05", "2023-05-05"],
      datasets: [
        {
          label: 'Burgas count',
          data: [5, 3, 6, 4, 7],
          backgroundColor: '#0F3460'
        }
      ]
    }
  }
  const donutchartData = {
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  return (
    <div>
      <Navbar />
        <div className="container text-center my-3">

          {/* Sales stadistics - Lines charts */}
          <div className="row">

            <div className="col-12 col-lg-4"></div>

            <div className="col-12 col-lg-4"></div>

            <div className="col-12 col-lg-4"></div>

          </div>

          {/* Inventory stadistics */}
          <div className="row">

            {/* Bar Chart */}
            <div className="col-12 col-lg-6 border">
              <h2> Inventario de burgas: </h2>
              <BarChart data={barchartData.data} options={barchartData.options}/>
            </div>

            {/* Donut Chart */}
            <div className="col-12 col-lg-6 border">
              <h2> Ventas por tipo de burga: </h2>
              <DonutChart data={donutchartData.data} />
            </div>

          </div>

        </div>
    </div>
  )
}
