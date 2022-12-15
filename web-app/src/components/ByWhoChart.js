import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

function ByWhoChart() {
  const [byWhoData, setByWhoData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [colors, setColors] = useState([]);
    useEffect(()=>{
        axios
        .get("http://localhost:4000/getbywhochart")
        .then(function (response) {
          response.data.forEach(element => {
            setLabels(old => [...old, element._id[0].byWho])
            setByWhoData(old => [...old, element.count])
            setColors(old=>[...old, "#"+Math.random().toString(16).substr(-6)])
          });
          
        });
    },[])
    const data = {
        labels: labels,
        datasets: [
          {
            data: byWhoData,
            backgroundColor: colors,
          },
        ],
      };

    return <div style={{width: "40%", margin: "auto auto"}}><Doughnut data={data} options={{plugins: {legend: {display: false}}}} /></div>;
}

export default ByWhoChart;
