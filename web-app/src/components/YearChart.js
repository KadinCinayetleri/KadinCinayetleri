import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function YearChart() {
    const [chartData, setCahrtData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [datas, setDatas] = useState([]); 
    useEffect(()=>{
        axios
        .get("http://localhost:4000/getyearchart")
        .then(function (response) {
          const data = response.data;  
          setCahrtData(data.sort((a,b) => a._id - b._id));
          setLabels([]);
          setDatas([]);
        });
    },[])
    useEffect(()=>{
        chartData.forEach(element => {
            setLabels(before => [...before, element._id]);
            setDatas(before => [...before, element.count]);
        });
    },[chartData]);
    const options = {
        responsive: true,
        plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
        },
        },
    };
    
    const data = {
        labels,
        datasets: [
        {
            label: 'Dataset 1',
            data: datas,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        ],
    };
    return (
        <div style={{width: "80%", margin: "auto auto"}}>
            <Bar options={options} data={data} />
        </div>
    ) ;
}

export default YearChart;
