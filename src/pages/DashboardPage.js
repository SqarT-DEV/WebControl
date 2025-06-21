import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Container,
  Button
} from '@mui/material';
import SidebarLayout from '../components/SidebarLayout';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import TodayIcon from '@mui/icons-material/Today';
import { deepPurple } from '@mui/material/colors';
import api from '../services/api';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png';
import {
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';

const DashboardCard = ({ icon, title, value, diff, diffColor }) => (
  <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
    <Box display="flex" alignItems="center" gap={2}>
      {icon}
      <Box>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="h5" color="primary">{value}</Typography>
        {diff !== undefined && (
          <Typography variant="caption" sx={{ color: diffColor }}>
            {diff > 0 ? `+${diff}% desde la semana pasada` : `${diff}% desde la semana pasada`}
          </Typography>
        )}
      </Box>
    </Box>
  </Paper>
);

const DashboardPage = () => {
  const { token, user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    totalPersonas: 0,
    totalOperarios: 0,
    totalAuxiliares: 0,
    actividadesHoy: 0,
    actividadesSemana: 0,
    totalReportes: 0,
    totalEquipos: 0,
    equiposDisponibles: 0
  });

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get('/dashboard/resumen');
        setStats(res.data);
      } catch (err) {
        console.error('Error al cargar resumen:', err);
      }
    };
    fetchResumen();
  }, [token]);

  const pieData = [
    { name: 'Disponibles', value: stats.equiposDisponibles },
    { name: 'No Disponibles', value: stats.totalEquipos - stats.equiposDisponibles }
  ];

  const pieColors = ['#00C49F', '#FF8042'];

  return (
    <SidebarLayout>
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#f9fafc' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${logo})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 520,
            opacity: 0.03,
            zIndex: 0
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          <Container maxWidth={false} sx={{ px: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <Typography variant="h4" fontWeight="bold">Dashboard de Análisis</Typography>
                <Typography variant="subtitle1">
                  Hola, {user?.nombres || 'Usuario'} 👋 Nos alegra verte de nuevo.
                </Typography>
              </Box>
              <Button variant="outlined" startIcon={<TodayIcon />}>
                Hoy: {new Date().toLocaleDateString()}
              </Button>
            </Box>

            <Grid container spacing={3}>
              {[{
                icon: <PeopleIcon fontSize="large" color="primary" />,
                title: 'Total Personas',
                value: stats.totalPersonas
              }, {
                icon: <EngineeringIcon fontSize="large" color="success" />,
                title: 'Operarios',
                value: stats.totalOperarios
              }, {
                icon: <SupervisedUserCircleIcon fontSize="large" sx={{ color: deepPurple[800] }} />,
                title: 'Auxiliares',
                value: stats.totalAuxiliares
              }, {
                icon: <AssignmentTurnedInIcon fontSize="large" color="secondary" />,
                title: 'Actividades Diarias',
                value: stats.actividadesHoy
              }, {
                icon: <AssessmentIcon fontSize="large" color="warning" />,
                title: 'Actividades Semanales',
                value: stats.actividadesSemana
              }, {
                icon: <AssessmentIcon fontSize="large" color="error" />,
                title: 'Total de Actividades',
                value: stats.totalReportes
              }, {
                icon: <EngineeringIcon fontSize="large" sx={{ color: 'green' }} />,
                title: 'Equipos Disponibles',
                value: stats.equiposDisponibles
              }, {
                icon: <EngineeringIcon fontSize="large" color="info" />,
                title: 'Equipos Totales',
                value: stats.totalEquipos
              }].map((card, index) => (
                <Grid key={index} data-grid={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                  <DashboardCard {...card} />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid data-grid={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Disponibilidad de Equipos</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </SidebarLayout>
  );
};

export default DashboardPage;
