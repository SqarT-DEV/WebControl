import React from 'react';
import { Box } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 260,
        right: 0,
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        px: 2,
        py: 2,
        color: '#6b7280',
        fontSize: 13,
        zIndex: 1200,
        textAlign: 'center'
      }}>
      © 2025 Control de Operaciones | Versión 1.0.0 | 📧 <a href="mailto:soporte@empresa.com" style={{ color: 'inherit', textDecoration: 'underline' }}>soporte@empresa.com</a> | 🔗 <a href="https://www.empresa.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>www.empresa.com</a> | <a href="/privacidad" style={{ color: 'inherit', textDecoration: 'underline' }}>Política de Privacidad</a> | <a href="/terminos" style={{ color: 'inherit', textDecoration: 'underline' }}>Términos de Uso</a>
    </Box>
  );
};

export default Footer;
