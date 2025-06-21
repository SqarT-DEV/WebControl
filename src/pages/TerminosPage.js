import React from 'react';
import { Box, Typography } from '@mui/material';

const TerminosPage = () => {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 800,
        mx: 'auto',
        mt: 4,
        mb: 6,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h5" gutterBottom>
        Términos de Uso
      </Typography>

      <Typography variant="body1" paragraph>
        Al utilizar esta aplicación, el usuario acepta cumplir con las políticas y normas internas establecidas por la organización. El acceso está restringido a personal autorizado con credenciales válidas.
      </Typography>

      <Typography variant="body1" paragraph>
        Está prohibido compartir credenciales, manipular registros o intentar acceder a funciones sin permiso. Cualquier uso indebido será motivo de sanciones conforme al reglamento interno de la empresa.
      </Typography>

      <Typography variant="body1" paragraph>
        El sistema puede registrar actividad para fines de auditoría. La organización se reserva el derecho de modificar estos términos sin previo aviso.
      </Typography>

      <Box mt={4}>
        <a
          href="/dashboard"
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e40af'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          ← Volver al inicio
        </a>
      </Box>
    </Box>
  );
};

export default TerminosPage;
