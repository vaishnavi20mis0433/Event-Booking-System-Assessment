import React from 'react';
import './BookingsChart.css';
import { Bar } from 'react-chartjs-2';

const BOOKINGS_BUCKETS = {
  'Cheap': {
    min: 0,
    max: 100
  },
  'Normal':  {
    min: 100,
    max: 250
  },
  'Expensive': {
    min: 250,
    max: 99999999
  } 
};

const bookingsChart = props => {

  const chartData = { labels: [], datasets: [] };
  let values = [];

  for(const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = 
      props.bookings.reduce((prev, curr) => {
        if(curr.event.price >= BOOKINGS_BUCKETS[bucket].min && curr.event.price < BOOKINGS_BUCKETS[bucket].max) {
          return prev + 1
        }
        else {
          return prev;
        }
      }, 0);
    
    values.push(filteredBookingsCount);
  
    chartData.labels.push(bucket);
    chartData.datasets.push({
      label: bucket,
      fillColor: 'rgba(220, 220, 220, 0.5)',
      strokeColor: 'rgba(220, 220, 220, 0.8)',
      highlightFill: 'rgba(220, 220, 220, 0.75)',
      highlightStrike: 'rgba(220, 220, 220, 1)',
      data: values
    });

    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div className="chart">
      <Bar data={chartData}/>
    </div>)
};

export default bookingsChart;