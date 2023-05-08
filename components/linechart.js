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
} from 'chart.js'

// 2. Register the controllers and elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// 3. Import the charts types
import { Line } from 'react-chartjs-2'

export default function LineChart(props) {
  return (
    <div>
      <Line data={props.data} options={props.options} height={200} />
    </div>
  )
}
