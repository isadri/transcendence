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
import { getUser, getendpoint } from '../../../context/getContextData';
import { div } from 'three/webgpu';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { stats } from '../../../context/context';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);



function GameStats() {
  const user = getUser()
  const [stats, setStats] = useState<stats>()


  useEffect(() => {
    axios.get(getendpoint("http", `/api/game/userStats/${user?.username}`))
    .then((response) => {
      setStats(response.data[0])
      console.log(response.data[0])
    })
    .catch((error) => {
      console.log("error==================>",error)
    })
  }, []);

  const data = {
    labels: [
      'Number of Wins',
      'Number of Losses',
    ],
    datasets: [{
      label: 'Game Stats',
      data: [stats?.win, stats?.lose],
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

  return (
    <div className='userStats'>
      <h2>Games Stats</h2>
      {
        (user?.stats.lose !== 0 || user?.stats.win !== 0) &&
        <div className='stats-contents'>
          <div className='labels'>
            <div className='win-label'>
              <div className='winlabel-div'>
                <span>{stats?.win}</span>
                <span>Wins</span>
              </div>
            </div>
            <div className='loss-label'>
              <div className='losslabel-div'>
                <span>{stats?.lose}</span>
                <span>Losses</span>
              </div>
            </div>
          </div>
          <div className='Doughnut'>
            <Doughnut data={data} options={options} />
          </div>
        </div>
      }
      {
        user?.stats.lose === 0 && user?.stats.win === 0 &&
        <div className='stats-content'>
          <div className='Nostats'>
            <div className='stats-icon'>
            <i className="fa-solid fa-chart-pie"></i>
            </div>
            <div className='NoStats-msg'>
              <h3>No stats to display</h3>
              <span>No games played yet.
                Start playing to see your stats!</span>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default GameStats;
