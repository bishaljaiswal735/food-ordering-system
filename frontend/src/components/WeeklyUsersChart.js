import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function WeeklyUsersChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/weekly-users/')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <>
      <h5 className="text-center">👤 Weekly New Users</h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="new_users" stroke="#0d6efd" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default WeeklyUsersChart;
