import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2' // azul profesional
    },
    secondary: {
      main: '#9c27b0' // púrpura
    },
    success: {
      main: '#2e7d32'
    },
    error: {
      main: '#d32f2f'
    },
    background: {
      default: '#f4f6f8'
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 500
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none'
        }
      }
    }
  }
});

export default theme;
