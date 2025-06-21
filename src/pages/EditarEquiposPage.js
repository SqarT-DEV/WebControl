import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import SidebarLayout from '../components/SidebarLayout';
import {
  Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Paper, TableContainer, Box, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { useSnackbar } from 'notistack';

const EditarEquiposPage = () => {
  const { token } = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [equipos, setEquipos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchEquipos = useCallback(async () => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/equipos');
      setEquipos(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchTipos = useCallback(async () => {
    try {
      const response = await api.get('/equipos/tipos');
      setTipos(response.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchEquipos();
    fetchTipos();
  }, [fetchEquipos, fetchTipos]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este equipo?')) return;
    try {
      await api.delete(`/equipos/${id}`);
      enqueueSnackbar('Equipo eliminado correctamente.', { variant: 'success' });
      fetchEquipos();
    } catch (err) {
      enqueueSnackbar('Error al eliminar equipo.', { variant: 'error' });
      console.error(err);
    }
  };

  const handleEdit = (equipo) => {
    setSelected({ ...equipo });
  };

  const handleUpdate = async () => {
    if (!selected.idEquipo || !selected.idTipoEquipo) {
      enqueueSnackbar('Todos los campos son obligatorios.', { variant: 'warning' });
      return;
    }

    try {
      const data = {
        idTipoEquipo: selected.idTipoEquipo,
        estado: selected.estado || 'Disponible'
      };
      await api.put(`/equipos/${selected.idEquipo}`, data);
      enqueueSnackbar('Equipo actualizado correctamente.', { variant: 'success' });
      setSelected(null);
      fetchEquipos();
    } catch (err) {
      enqueueSnackbar('Error al actualizar equipo.', { variant: 'error' });
      console.error(err);
    }
  };

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>Editar / Eliminar Equipos</Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Paper sx={{ minWidth: 600 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código de Equipo</TableCell>
                  <TableCell>Tipo de Equipo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {equipos.map((e) => (
                  <TableRow key={e.idEquipo}>
                    <TableCell>{e.idEquipo}</TableCell>
                    <TableCell>{tipos.find(t => t.idTipoEquipo === e.idTipoEquipo)?.descripcionEquipo || '—'}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(e)}>Editar</Button>
                      <Button color="error" onClick={() => handleDelete(e.idEquipo)}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Equipo</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Código de Equipo"
                value={selected?.idEquipo || ''}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Equipo</InputLabel>
                <Select
                  value={selected?.idTipoEquipo || ''}
                  label="Tipo de Equipo"
                  onChange={(e) => setSelected({ ...selected, idTipoEquipo: e.target.value })}
                >
                  {tipos.map((tipo) => (
                    <MenuItem key={tipo.idTipoEquipo} value={tipo.idTipoEquipo}>
                      {tipo.descripcionEquipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default EditarEquiposPage;
