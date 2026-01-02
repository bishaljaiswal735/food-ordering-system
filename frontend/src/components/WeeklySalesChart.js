import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function WeeklySalesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/weekly-sales/')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <>
      <h5 className="text-center">📊 Weekly Sales</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#198754" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default WeeklySalesChart;
