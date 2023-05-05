// 1. Import controllers, elements, etc
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// 2. Register the controllers and elements
ChartJS.register(ArcElement, Tooltip, Legend)

// 3. Import the charts types
import { Doughnut } from 'react-chartjs-2'

export default function DonutChart(props) {
  return (
    <div>
      <Doughnut data={props.data} />
    </div>
  )
}
