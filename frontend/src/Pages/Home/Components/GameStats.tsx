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
import 'chartjs-plugin-datalabels';
import '../styles/GameStats.css';

import { stats } from '../../../context/context';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface Prop{
  stats : stats
}

function GameStats({stats}:Prop) {

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
    plugins: {
      legend: {
        display: false,

      },
      tooltip: {
        titleColor: 'white',
        bodyColor: 'white',
      },
      datalabels: {
        color: 'white',
      },
      formatter: (value: number) => `${value}%`,
    },
  };

  return (
    <div className='userStats'>
      <h2>Games Stats</h2>
      {
        (stats?.lose !== 0 || stats.win !== 0) &&
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
        stats?.lose === 0 && stats?.win === 0 &&
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
