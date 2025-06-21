import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import SidebarLayout from '../components/SidebarLayout';
import { Typography, TextField, Button, Paper, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';

const RegistroStandbyPage = () => {
  const { token } = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      setError('La descripción es requerida');
      return;
    }
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await api.post('/standby', { descripcion });
      enqueueSnackbar('Standby registrado correctamente.', { variant: 'success' });
      setDescripcion('');
      setError('');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al registrar el standby.';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>Registrar Standby</Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="descripcion"
                fullWidth
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>Registrar</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </SidebarLayout>
  );
};

export default RegistroStandbyPage;
