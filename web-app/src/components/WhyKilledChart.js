import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

function WhyKilledChart() {
  const [whyData, setWhyData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [colors, setColors] = useState([]);
    useEffect(()=>{
        axios
        .get("http://localhost:4000/getwhychart")
        .then(function (response) {
          response.data.forEach(element => {
            setLabels(old => [...old, element._id[0].why])
            setWhyData(old => [...old, element.count])
            setColors(old=>[...old, "#"+Math.random().toString(16).substr(-6)])
          });
          
        });
    },[])
    const data = {
        labels: labels,
        datasets: [
          {
            data: whyData,
            backgroundColor: colors,
          },
        ],
      };
    return <div style={{width: "40%", margin: "auto auto", display: "block"}}><Doughnut data={data}/></div>;
}

export default WhyKilledChart;
