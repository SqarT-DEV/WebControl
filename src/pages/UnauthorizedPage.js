import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <SidebarLayout>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" gutterBottom color="error">
          Acceso no autorizado
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          No tienes permisos para acceder a esta sección.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Volver al Dashboard
        </Button>
      </Box>
    </SidebarLayout>
  );
};

export default UnauthorizedPage;
