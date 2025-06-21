import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import SidebarLayout from '../components/SidebarLayout';
import { Typography, TextField, Button, Paper, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';

const RegistroFasePage = () => {
  const { token } = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ idFase: '', descripcionFase: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    const newErrors = {};
    if (!form.idFase.trim()) newErrors.idFase = 'El código de fase es requerido';
    if (!form.descripcionFase.trim()) newErrors.descripcionFase = 'La descripción es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await api.post('/fases', form);
      enqueueSnackbar('Fase registrada correctamente.', { variant: 'success' });
      setForm({ idFase: '', descripcionFase: '' });
      setErrors({});
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al registrar la fase.';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>Registrar Fase</Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Código de Fase"
                name="idFase"
                fullWidth
                value={form.idFase}
                onChange={handleChange}
                required
                error={!!errors.idFase}
                helperText={errors.idFase}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción de Fase"
                name="descripcionFase"
                fullWidth
                value={form.descripcionFase}
                onChange={handleChange}
                required
                error={!!errors.descripcionFase}
                helperText={errors.descripcionFase}
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

export default RegistroFasePage;
