import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import 'chartjs-plugin-datalabels';  // Import the datalabels plugin
import '../styles/GameStats.css';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const data = {
  labels: [
    'Wins',
    'Loss',
  ],
  datasets: [{
    label: 'number of win or loss',
    data: [300, 50],
    backgroundColor: [
      '#c1596c',
      '#462d4b',
    ],
    borderColor: 'transparent',
    hoverOffset: 4,
  }]
};

const options = {
  // responsive: true, 
  plugins: {
    legend: {
      display: false, 
      // labels: {
      //   borderRadius:'15',
      //   color: 'white',
      //   font: {
      //     size: 14,
      //   },
      // },
    },
    tooltip: {
      titleColor: 'white',
      bodyColor: 'white',
    },
    datalabels: {
      color: 'white',
    },
    // position: 'outside', // position the labels outside the doughnut
    // offset: 10, // Adjust the distance of the labels from the doughnut
    // padding: 40, // Adjust the padding (distance) between the label and doughnut
    formatter: (value: number) => `${value}%`, // Optional: add custom formatting
  },
};

function GameStats() {
  return (
    <div className='userStats'>
      <h2>Games Stats</h2>
      <div className='stats-contents'>
        <div className='labels'>
          <div className='win-label'>
            <div className='winlabel-div'>
              <span>Wins</span>
            </div>
          </div>
          <div className='loss-label'>
            <div className='losslabel-div'>
              <span>Loss</span>
            </div>
          </div>
        </div>
        <div className='Doughnut'>
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default GameStats;
