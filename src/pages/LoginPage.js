import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button,
  Avatar, Container, CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSnackbar } from 'notistack';

const LoginPage = () => {
  const [DNI, setDNI] = useState('');
  const [Clave, setClave] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { DNI, Clave });

      const authData = {
        token: response.data.token,
        user: {
          id: response.data.id,
          nombres: response.data.nombres,
          apellidos: response.data.apellidos,
          rol: response.data.rol,
          DNI,
          fotoPerfil: response.data.fotoPerfil || null
        }
      };

      dispatch(setCredentials(authData));
      localStorage.setItem('auth', JSON.stringify(authData));

      enqueueSnackbar('¡Inicio de sesión exitoso!', { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || 'Error al iniciar sesión.',
        { variant: 'error' }
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#e3eaf2'
      }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 2 }}>
          <LockOutlinedIcon fontSize="large" />
        </Avatar>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Avatar sx={{ m: 'auto', bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            Operation Controls V1
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Por favor, inicia sesión para continuar
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="DNI"
              value={DNI}
              onChange={(e) => setDNI(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Clave"
              type="password"
              value={Clave}
              onChange={(e) => setClave(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Iniciar Sesión
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
