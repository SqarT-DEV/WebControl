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

const EditarStandbyPage = () => {
  const { token } = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [standbys, setStandbys] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchStandbys = useCallback(async () => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await api.get('/standby');
      setStandbys(res.data);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Error al cargar standbys.', { variant: 'error' });
    }
  }, [token, enqueueSnackbar]);

  useEffect(() => {
    fetchStandbys();
  }, [fetchStandbys]);

  const handleEdit = (item) => {
    setSelected({ ...item });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este standby?')) return;
    try {
      await api.delete(`/standby/${id}`);
      enqueueSnackbar('Standby eliminado.', { variant: 'success' });
      fetchStandbys();
    } catch (err) {
      enqueueSnackbar('Error al eliminar standby.', { variant: 'error' });
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!selected.descripcion.trim()) {
      enqueueSnackbar('La descripción no puede estar vacía.', { variant: 'warning' });
      return;
    }
    try {
      await api.put(`/standby/${selected.idStandby}`, {
        descripcion: selected.descripcion
      });
      enqueueSnackbar('Standby actualizado.', { variant: 'success' });
      setSelected(null);
      fetchStandbys();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Error al actualizar standby.', { variant: 'error' });
    }
  };

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>Editar / Eliminar Standby</Typography>

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
                {standbys.map((item) => (
                  <TableRow key={item.idStandby}>
                    <TableCell>{item.idStandby}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(item)}>Editar</Button>
                      <Button color="error" onClick={() => handleDelete(item.idStandby)}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Standby</DialogTitle>
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

export default EditarStandbyPage;
