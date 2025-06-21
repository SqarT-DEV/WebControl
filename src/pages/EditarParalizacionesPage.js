import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import SidebarLayout from '../components/SidebarLayout';
import {
  Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Paper, TableContainer, Box
} from '@mui/material';
import { useSnackbar } from 'notistack';

const EditarParalizacionesPage = () => {
  const { token } = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [paralizaciones, setParalizaciones] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchParalizaciones = useCallback(async () => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await api.get('/paralizaciones');
      setParalizaciones(res.data);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Error al cargar paralizaciones.', { variant: 'error' });
    }
  }, [token, enqueueSnackbar]);

  useEffect(() => {
    fetchParalizaciones();
  }, [fetchParalizaciones]);

  const handleEdit = (item) => {
    setSelected({ ...item });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta paralización?')) return;
    try {
      await api.delete(`/paralizaciones/${id}`);
      enqueueSnackbar('Paralización eliminada.', { variant: 'success' });
      fetchParalizaciones();
    } catch (err) {
      enqueueSnackbar('Error al eliminar paralización.', { variant: 'error' });
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!selected.descripcion.trim()) {
      enqueueSnackbar('La descripción no puede estar vacía.', { variant: 'warning' });
      return;
    }
    try {
      await api.put(`/paralizaciones/${selected.idParalizacion}`, {
        descripcion: selected.descripcion
      });
      enqueueSnackbar('Paralización actualizada.', { variant: 'success' });
      setSelected(null);
      fetchParalizaciones();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Error al actualizar paralización.', { variant: 'error' });
    }
  };

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>Editar / Eliminar Paralizaciones</Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paralizaciones.map((item) => (
                  <TableRow key={item.idParalizacion}>
                    <TableCell>{item.idParalizacion}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(item)}>Editar</Button>
                      <Button color="error" onClick={() => handleDelete(item.idParalizacion)}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Paralización</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                value={selected?.descripcion || ''}
                onChange={(e) => setSelected({ ...selected, descripcion: e.target.value })}
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

export default EditarParalizacionesPage;
