import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import SidebarLayout from '../components/SidebarLayout';


const ActividadesPage = () => {
  const [actividades, setActividades] = useState([]);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/actividades');
        setActividades(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchActividades();
  }, [token]);

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>
        Actividades
      </Typography>
      <List>
        {actividades.map((actividad) => (
          <ListItem key={actividad.idActividades} divider>
            <ListItemText
              primary={actividad.descripcionActividades}
              secondary={`Estado: ${actividad.estadoActividades} - Código Fase: ${actividad.codigoFase}`}
            />
          </ListItem>
        ))}
      </List>
    </SidebarLayout>
  );
};

export default ActividadesPage;

