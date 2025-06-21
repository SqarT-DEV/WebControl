import React, { useState } from 'react';
import {
  Drawer, List, ListItemText, AppBar, Toolbar,
  Typography, CssBaseline, Box, Button, Divider,
  ListItemButton, ListItemIcon, Collapse, Avatar, Menu, MenuItem,
  Slide, Fade
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  ExpandLess, ExpandMore, Build, Dashboard, Assessment,
  People, Assignment, Block, PauseCircle
} from '@mui/icons-material';
import Footer from '../components/Footer';

const drawerWidth = 260;

const SidebarLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [openMenu, setOpenMenu] = useState({
    equipos: false,
    personas: false,
    fases: false,
    paralizaciones: false,
    standby: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  

  const toggleMenu = (key) => {
    setOpenMenu(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    dispatch(logout());
    navigate('/');
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handlePerfil = () => {
    navigate('/perfil');
    handleMenuClose();
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: <Dashboard />,
      to: '/dashboard'
    },
    {
      label: 'Reportes',
      icon: <Assessment />,
      to: '/reportes'
    },
  ];

  const adminSections = [
    {
      key: 'equipos',
      icon: <Build />,
      label: 'Equipos',
      routes: [
        { label: 'Registrar Equipo', to: '/registrar-equipo' },
        { label: 'Editar / Eliminar Equipo', to: '/editar-equipos', adminOnly: true }
      ]
    },
    {
      key: 'personas',
      icon: <People />,
      label: 'Personas',
      routes: [
        { label: 'Registrar Persona', to: '/registrar-persona' },
        { label: 'Editar / Eliminar Persona', to: '/editar-personas', adminOnly: true }
      ]
    },
    {
      key: 'fases',
      icon: <Assignment />,
      label: 'Fases',
      routes: [
        { label: 'Registrar Fase', to: '/registrar-fase' },
        { label: 'Editar / Eliminar Fase', to: '/editar-fases', adminOnly: true }
      ]
    },
    {
      key: 'paralizaciones',
      icon: <Block />,
      label: 'Paralizaciones',
      routes: [
        { label: 'Registrar Paralización', to: '/registrar-paralizacion' },
        { label: 'Editar / Eliminar Paralización', to: '/editar-paralizaciones', adminOnly: true }
      ]
    },
    {
      key: 'standby',
      icon: <PauseCircle />,
      label: 'Standby',
      routes: [
        { label: 'Registrar Standby', to: '/registrar-standby' },
        { label: 'Editar / Eliminar Standby', to: '/editar-standby', adminOnly: true }
      ]
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1300, background: '#111927', boxShadow: 3, borderRadius: 0 }}>
<Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>Control de Operaciones</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              onClick={handleMenuClick}
              sx={{ textTransform: 'none', color: '#fff' }}
              startIcon={
                <Avatar
                  src={user?.fotoPerfil || null}
                  sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}
                >
                  {!user?.fotoPerfil && (user?.nombres?.charAt(0).toUpperCase() || '?')}
                </Avatar>
              }
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{user?.nombres}</Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handlePerfil}>Perfil</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f3f4f6',
            borderRight: '1px solid #ddd',
            pt: 1,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map(({ label, icon, to }) => (
            <Slide key={label} direction="right" in mountOnEnter unmountOnExit timeout={300}>
              <NavLink to={to} style={{ textDecoration: 'none' }} key={label}>
  {({ isActive }) => (
    <ListItemButton
      sx={{
        backgroundColor: isActive ? '#e2e8f0' : 'transparent',
        borderLeft: isActive ? '4px solid #475569' : '4px solid transparent',
        '&:hover': {
          backgroundColor: '#e2e8f0',
          borderLeft: '4px solid #3b82f6'
        },
        pl: 2.5
      }}
    >
      <ListItemIcon sx={{ color: isActive ? '#1e293b' : 'inherit' }}>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ color: isActive ? '#1e293b' : 'inherit' }} />
    </ListItemButton>
  )}
</NavLink>
            </Slide>
          ))}

          <Divider sx={{ my: 1 }} />

          {(user.rol === 1 || user.rol === 2) && adminSections.map(({ key, icon, label, routes }) => (
            <React.Fragment key={key}>
              <ListItemButton onClick={() => toggleMenu(key)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
                {openMenu[key] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMenu[key]} timeout={{ enter: 400, exit: 300 }} unmountOnExit>
                <Slide direction="down" in={openMenu[key]} mountOnEnter unmountOnExit>
                  <List component="div" disablePadding>
                    {routes.map(({ label: subLabel, to, adminOnly }) => {
                      if (adminOnly && user.rol !== 1) return null;
                      return (
                        <NavLink to={to} style={{ textDecoration: 'none' }} key={subLabel}>
                          {({ isActive }) => (
                            <ListItemButton
                              sx={{
                                backgroundColor: isActive ? '#e2e8f0' : 'transparent',
                                borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                                '&:hover': {
                                  backgroundColor: '#edf2f7',
                                  borderLeft: '4px solid #3b82f6'
                                },
                                pl: 4
                              }}
                            >
                              <ListItemText primary={subLabel} primaryTypographyProps={{ color: isActive ? '#1e293b' : 'inherit' }} />
                            </ListItemButton>
                          )}
                        </NavLink>
                      );
                        
                    })}
                  </List>
                </Slide>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: '#f0f2f5',
          minHeight: '100vh',
          transition: 'padding 0.3s ease'
        }}
      >
        <Toolbar />
        <Fade in={true} timeout={500}>
          <Box>
            {children}
          </Box>
        </Fade>
        <Footer />
      </Box>
    </Box>
  );
};

export default SidebarLayout;
