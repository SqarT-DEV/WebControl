import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { Paper, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PersonasPorCargoChart = () => {
  const { token } = useSelector(state => state.auth);
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/dashboard/personas-por-cargo');

        const labels = response.data.map(item => item.descripcionCargo);
        const cantidades = response.data.map(item => item.cantidad);

        setData({
          labels,
          datasets: [
            {
              label: 'Personas',
              data: cantidades,
              backgroundColor: 'rgba(25, 118, 210, 0.6)'
            }
          ]
        });
      } catch (err) {
        console.error('Error al cargar datos de personas por cargo:', err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Personas por Tipo de Cargo
      </Typography>
      <Bar data={data} />
    </Paper>
  );
};

export default PersonasPorCargoChart;
