// pages/RegistroEquipoPage.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import SidebarLayout from '../components/SidebarLayout';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem
} from '@mui/material';
import { useSnackbar } from 'notistack';

const RegistroEquipoPage = () => {
  const { token } = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [tiposEquipo, setTiposEquipo] = useState([]);
  const [form, setForm] = useState({
    idEquipo: '',
    estado: 'Disponible',
    idTipoEquipo: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTiposEquipo = async () => {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/equipos/tipos');
        setTiposEquipo(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTiposEquipo();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    const newErrors = {};
    if (!form.idEquipo.trim()) {
      newErrors.idEquipo = 'Código requerido';
    }
    if (!form.idTipoEquipo) {
      newErrors.idTipoEquipo = 'Selecciona un tipo de equipo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      await api.post('/equipos', form);
      enqueueSnackbar('Equipo registrado correctamente.', { variant: 'success' });
      setForm({ idEquipo: '', estado: 'Disponible', idTipoEquipo: '' });
      setErrors({});
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al registrar equipo.';
      enqueueSnackbar(mensaje, { variant: 'error' });
      if (mensaje.includes('código')) {
        setErrors(prev => ({ ...prev, idEquipo: mensaje }));
      }
    }
  };

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>Registrar Equipo</Typography>

      <Paper sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Código del Equipo"
                name="idEquipo"
                value={form.idEquipo}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.idEquipo}
                helperText={errors.idEquipo}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Tipo de Equipo"
                name="idTipoEquipo"
                value={form.idTipoEquipo}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.idTipoEquipo}
                helperText={errors.idTipoEquipo}
                InputProps={{ style: { minWidth: 223, minHeight: 56 } }}
              >
                <MenuItem disabled value="">Selecciona un tipo...</MenuItem>
                {tiposEquipo.map((tipo) => (
                  <MenuItem key={tipo.idTipoEquipo} value={tipo.idTipoEquipo}>
                    {tipo.descripcionEquipo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Registrar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </SidebarLayout>
  );
};

export default RegistroEquipoPage;