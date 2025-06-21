import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Control de Operaciones</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;

