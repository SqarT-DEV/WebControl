import React from 'react';
import { Box, Typography } from '@mui/material';

const PrivacidadPage = () => {
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
        Política de Privacidad
      </Typography>

      <Typography variant="body1" paragraph>
        Esta aplicación recolecta y procesa datos personales únicamente con fines de operación interna y mejora del sistema. Toda la información ingresada por los usuarios, incluyendo datos de identificación y registros de actividades, será tratada de forma confidencial.
      </Typography>

      <Typography variant="body1" paragraph>
        No compartimos ni vendemos datos personales a terceros. La información será utilizada exclusivamente por el equipo responsable del sistema para fines de monitoreo, soporte y mejora continua.
      </Typography>

      <Typography variant="body1" paragraph>
        Los usuarios tienen derecho a solicitar la eliminación o modificación de sus datos escribiendo al correo de soporte. Aplicamos medidas de seguridad técnicas y organizativas para proteger los datos frente a accesos no autorizados.
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

export default PrivacidadPage;
