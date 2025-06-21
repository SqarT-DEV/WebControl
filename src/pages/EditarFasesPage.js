import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography, TextField, Button, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Box
} from '@mui/material';
import SidebarLayout from '../components/SidebarLayout';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

const EditarFasesPage = () => {
  const { token } = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [fases, setFases] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchFases = useCallback(async () => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/fases');
      setFases(response.data);
    } catch (err) {
      console.error('Error al obtener fases:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchFases();
  }, [fetchFases]);

  const handleDelete = async (idFase) => {
    if (!window.confirm('¿Estás seguro de eliminar esta fase?')) return;
    try {
      await api.delete(`/fases/${idFase}`);
      enqueueSnackbar('Fase eliminada correctamente.', { variant: 'success' });
      fetchFases();
    } catch (err) {
      enqueueSnackbar('Error al eliminar fase.', { variant: 'error' });
    }
  };

  const handleUpdate = async () => {
    if (!selected.descripcionFase.trim()) {
      enqueueSnackbar('La descripción no puede estar vacía.', { variant: 'warning' });
      return;
    }

    try {
      await api.put(`/fases/${selected.idFase}`, selected);
      enqueueSnackbar('Fase actualizada correctamente.', { variant: 'success' });
      setSelected(null);
      fetchFases();
    } catch (err) {
      enqueueSnackbar('Error al actualizar fase.', { variant: 'error' });
    }
  };

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>Editar / Eliminar Fases</Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fases.map((fase) => (
                  <TableRow key={fase.idFase}>
                    <TableCell>{fase.idFase}</TableCell>
                    <TableCell>{fase.descripcionFase}</TableCell>
                    <TableCell>
                      <Button onClick={() => setSelected(fase)}>Editar</Button>
                      <Button color="error" onClick={() => handleDelete(fase.idFase)}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Fase</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                value={selected?.descripcionFase || ''}
                onChange={(e) => setSelected({ ...selected, descripcionFase: e.target.value })}
                fullWidth
              />
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

export default EditarFasesPage;
