// 1. Import controllers, elements, etc
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
} from 'chart.js'

// 2. Register the controllers and elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
)

// 3. Import the charts types
import { Bar } from 'react-chartjs-2'

export default function BarChart(props) {
  return (
    <div>
      <Bar data={props.data} options={props.options} />
    </div>
  )
}
