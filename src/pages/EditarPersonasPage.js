import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import SidebarLayout from '../components/SidebarLayout';
import {
  Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Paper, TableContainer, Box, MenuItem
} from '@mui/material';
import { useSnackbar } from 'notistack';

const EditarPersonasPage = () => {
  const { token } = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [personas, setPersonas] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [token]);

  const fetchCargos = useCallback(async () => {
    try {
      const response = await api.get('/personas/cargos');
      setCargos(response.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchPersonas = useCallback(async () => {
    try {
      const response = await api.get('/personas');
      setPersonas(response.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCargos();
    fetchPersonas();
  }, [fetchCargos, fetchPersonas]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta persona?')) return;
    try {
      await api.delete(`/personas/${id}`);
      enqueueSnackbar('Persona eliminada correctamente.', { variant: 'success' });
      fetchPersonas();
    } catch (err) {
      enqueueSnackbar('Error al eliminar persona.', { variant: 'error' });
      console.error(err);
    }
  };

  const handleEdit = (persona) => {
    setSelected({ ...persona, Clave: '' });
  };

  const handleUpdate = async () => {
    if (!selected.Nombres.trim() || selected.Nombres.length < 2) {
      enqueueSnackbar('El nombre debe tener al menos 2 caracteres.', { variant: 'warning' });
      return;
    }
    if (!selected.Apellidos.trim() || selected.Apellidos.length < 2) {
      enqueueSnackbar('El apellido debe tener al menos 2 caracteres.', { variant: 'warning' });
      return;
    }
    if (!selected.idCargo) {
      enqueueSnackbar('Debes seleccionar un cargo.', { variant: 'warning' });
      return;
    }
    if (selected.Clave && selected.Clave.length < 6) {
      enqueueSnackbar('La clave debe tener al menos 6 caracteres.', { variant: 'warning' });
      return;
    }

    try {
      const data = { ...selected };
      if (!data.Clave) delete data.Clave;
      await api.put(`/personas/${selected.idPersona}`, data);
      enqueueSnackbar('Datos actualizados correctamente.', { variant: 'success' });
      setSelected(null);
      fetchPersonas();
    } catch (err) {
      enqueueSnackbar('Error al actualizar datos.', { variant: 'error' });
      console.error(err);
    }
  };

  const obtenerDescripcionCargo = (idCargo) => {
    return cargos.find(c => c.idCargo === idCargo)?.descripcionCargo || '—';
  };

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>Editar / Eliminar Personas</Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Paper sx={{ minWidth: 600 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>DNI</TableCell>
                  <TableCell>Nombres</TableCell>
                  <TableCell>Apellidos</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {personas.map((p) => (
                  <TableRow key={p.idPersona}>
                    <TableCell>{p.DNI}</TableCell>
                    <TableCell>{p.Nombres}</TableCell>
                    <TableCell>{p.Apellidos}</TableCell>
                    <TableCell>{obtenerDescripcionCargo(p.idCargo)}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(p)}>Editar</Button>
                      <Button color="error" onClick={() => handleDelete(p.idPersona)}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Persona</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombres" value={selected?.Nombres || ''}
                onChange={(e) => setSelected({ ...selected, Nombres: e.target.value })} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Apellidos" value={selected?.Apellidos || ''}
                onChange={(e) => setSelected({ ...selected, Apellidos: e.target.value })} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Clave" type="password" value={selected?.Clave || ''}
                onChange={(e) => setSelected({ ...selected, Clave: e.target.value })}
                fullWidth placeholder="Dejar en blanco para no cambiar" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Cargo" value={selected?.idCargo || ''}
                onChange={(e) => setSelected({ ...selected, idCargo: e.target.value })} fullWidth>
                <MenuItem disabled value="">Seleccione un cargo</MenuItem>
                {cargos.map(c => (
                  <MenuItem key={c.idCargo} value={c.idCargo}>{c.descripcionCargo || c.descripcion}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdate}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </SidebarLayout>
  );
};

export default EditarPersonasPage;