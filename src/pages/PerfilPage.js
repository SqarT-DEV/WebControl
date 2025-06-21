import React, { useState } from 'react';
import {
  Box, Paper, Typography, Avatar, List, ListItem,
  ListItemIcon, ListItemText, Divider, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import { ContactMail, AssignmentInd, Lock } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateFotoPerfil } from '../redux/authSlice';
import SidebarLayout from '../components/SidebarLayout';
import api from '../services/api';

const PerfilPage = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const [imagenPreview, setImagenPreview] = useState(user?.fotoPerfil || null);
  const [openModal, setOpenModal] = useState(false);

  const [formClave, setFormClave] = useState({
    claveActual: '',
    claveNueva: '',
    confirmarClave: ''
  });

  const [errorClave, setErrorClave] = useState('');
  const [successClave, setSuccessClave] = useState('');
  const [successFoto, setSuccessFoto] = useState('');
  const [errorFoto, setErrorFoto] = useState('');

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
        subirFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const subirFoto = async (base64Image) => {
    try {
      const res = await api.post('/personas/foto', {
        idPersona: user.id,
        imagenBase64: base64Image
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessFoto(res.data.message);
      setErrorFoto('');
      dispatch(updateFotoPerfil(base64Image));
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar la foto';
      setErrorFoto(msg);
      setSuccessFoto('');
    }
  };

  const handleOpenModal = () => {
    setErrorClave('');
    setSuccessClave('');
    setFormClave({ claveActual: '', claveNueva: '', confirmarClave: '' });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeClave = (e) => {
    setFormClave({ ...formClave, [e.target.name]: e.target.value });
  };

  const handleSubmitClave = async () => {
    const { claveActual, claveNueva, confirmarClave } = formClave;

    if (!claveActual || !claveNueva || !confirmarClave) {
      return setErrorClave('Todos los campos son obligatorios');
    }
    if (claveNueva !== confirmarClave) {
      return setErrorClave('Las nuevas contraseñas no coinciden');
    }

    try {
      const res = await api.post('/personas/cambiar-clave', {
        DNI: user.DNI,
        claveActual,
        claveNueva
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessClave(res.data.message || 'Contraseña actualizada correctamente');
      setErrorClave('');
      setFormClave({ claveActual: '', claveNueva: '', confirmarClave: '' });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cambiar la contraseña';
      setErrorClave(mensaje);
      setSuccessClave('');
    }
  };

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom align="center">
        Mi Perfil
      </Typography>

      <Paper
        elevation={4}
        sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 3, mt: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Avatar
            src={imagenPreview}
            sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}
          >
            {!imagenPreview && (user?.nombres?.charAt(0).toUpperCase() || '?')}
          </Avatar>

          <Typography variant="h6" sx={{ mt: 1 }}>
            {user?.nombres || ''} {user?.apellidos || ''}
          </Typography>

          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Subir Foto
            <input type="file" hidden accept="image/*" onChange={handleImagenChange} />
          </Button>

          {successFoto && <Alert severity="success" sx={{ mt: 2 }}>{successFoto}</Alert>}
          {errorFoto && <Alert severity="error" sx={{ mt: 2 }}>{errorFoto}</Alert>}
        </Box>

        <Divider sx={{ my: 3 }} />

        <List dense>
          <ListItem>
            <ListItemIcon><ContactMail /></ListItemIcon>
            <ListItemText
              primary="Cargo"
              secondary={
                user?.rol === 1
                  ? 'Administrador'
                  : user?.rol === 2
                    ? 'Técnico'
                    : `Rol ID ${user?.rol}`
              }
            />
          </ListItem>

          <ListItem>
            <ListItemIcon><AssignmentInd /></ListItemIcon>
            <ListItemText primary="Estado" secondary="Activo" />
          </ListItem>
        </List>

        <Button
          variant="contained"
          startIcon={<Lock />}
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleOpenModal}
        >
          Cambiar contraseña
        </Button>
      </Paper>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          {errorClave && <Alert severity="error" sx={{ mb: 2 }}>{errorClave}</Alert>}
          {successClave && <Alert severity="success" sx={{ mb: 2 }}>{successClave}</Alert>}
          <TextField
            margin="dense"
            label="Contraseña actual"
            name="claveActual"
            type="password"
            fullWidth
            value={formClave.claveActual}
            onChange={handleChangeClave}
          />
          <TextField
            margin="dense"
            label="Nueva contraseña"
            name="claveNueva"
            type="password"
            fullWidth
            value={formClave.claveNueva}
            onChange={handleChangeClave}
          />
          <TextField
            margin="dense"
            label="Confirmar nueva contraseña"
            name="confirmarClave"
            type="password"
            fullWidth
            value={formClave.confirmarClave}
            onChange={handleChangeClave}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmitClave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </SidebarLayout>
  );
};

export default PerfilPage;
