import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import SidebarLayout from '../components/SidebarLayout';
import {
  Typography, TextField, Button, MenuItem, Grid, Paper
} from '@mui/material';
import { useSnackbar } from 'notistack';

const RegistroPersonaPage = () => {
  const { token } = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [cargos, setCargos] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    Nombres: '',
    Apellidos: '',
    DNI: '',
    Celular: '',
    Clave: '',
    Estado: 'Activo',
    idCargo: ''
  });

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get('/personas/cargos');
        setCargos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCargos();
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    const newErrors = {};
    if (!form.Nombres.trim() || form.Nombres.length < 2) newErrors.Nombres = 'Nombres requeridos';
    if (!form.Apellidos.trim() || form.Apellidos.length < 2) newErrors.Apellidos = 'Apellidos requeridos';
    if (!/^[0-9]{8}$/.test(form.DNI)) newErrors.DNI = 'DNI inválido (8 dígitos)';
    if (!/^[0-9]{9}$/.test(form.Celular)) newErrors.Celular = 'Celular inválido (9 dígitos)';
    if (!form.Clave || form.Clave.length < 6) newErrors.Clave = 'Clave muy corta (mínimo 6 caracteres)';
    if (!form.idCargo) newErrors.idCargo = 'Selecciona un cargo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      await api.post('/personas', form);
      enqueueSnackbar('Persona registrada correctamente.', { variant: 'success' });
      setForm({ Nombres: '', Apellidos: '', DNI: '', Celular: '', Clave: '', Estado: 'Activo', idCargo: '' });
      setErrors({});
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al registrar persona.';
      if (mensaje.includes('DNI')) setErrors(prev => ({ ...prev, DNI: mensaje }));
      if (mensaje.toLowerCase().includes('celular')) setErrors(prev => ({ ...prev, Celular: mensaje }));
      enqueueSnackbar(mensaje, { variant: 'error' });
      console.error(err);
    }
  };

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>Registrar Nueva Persona</Typography>
      <Paper sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField label="Nombres" name="Nombres" value={form.Nombres}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) handleChange(e);
                }} fullWidth required error={!!errors.Nombres} helperText={errors.Nombres} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Apellidos" name="Apellidos" value={form.Apellidos}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) handleChange(e);
                }} fullWidth required error={!!errors.Apellidos} helperText={errors.Apellidos} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="DNI"
                name="DNI"
                value={form.DNI}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                  handleChange({ target: { name: 'DNI', value } });
                }}
                fullWidth
                required
                error={!!errors.DNI || form.DNI.length !== 8}
                helperText={form.DNI.length !== 8 ? 'Debe contener exactamente 8 dígitos' : errors.DNI}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Celular"
                name="Celular"
                value={form.Celular}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                  handleChange({ target: { name: 'Celular', value } });
                }}
                fullWidth
                required
                error={!!errors.Celular || form.Celular.length !== 9}
                helperText={form.Celular.length !== 9 ? 'Debe contener exactamente 9 dígitos' : errors.Celular}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Clave" name="Clave" type="password" value={form.Clave}
                onChange={handleChange} fullWidth required error={!!errors.Clave} helperText={errors.Clave} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select label="Cargo" name="idCargo" value={form.idCargo} onChange={handleChange} fullWidth required error={!!errors.idCargo} helperText={errors.idCargo} InputProps={{ style: { minHeight: 56, minWidth: 223 } }}>
                <MenuItem disabled value="">Selecciona un cargo...</MenuItem>
                {cargos.map(c => (
                  <MenuItem key={c.idCargo} value={c.idCargo}>
                    {c.descripcionCargo || c.descripcion || 'Sin descripción'}
                  </MenuItem>
                ))}
              </TextField>
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

export default RegistroPersonaPage;