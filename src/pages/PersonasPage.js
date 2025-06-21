import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import SidebarLayout from '../components/SidebarLayout';


const PersonasPage = () => {
  const [personas, setPersonas] = useState([]);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/personas');
        setPersonas(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPersonas();
  }, [token]);

  return (
    <SidebarLayout>
      <Typography variant="h4" gutterBottom>
        Personas
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombres</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Celular</TableCell>
              <TableCell>Cargo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personas.map((persona) => (
              <TableRow key={persona.idPersona}>
                <TableCell>{persona.idPersona}</TableCell>
                <TableCell>{persona.Nombres}</TableCell>
                <TableCell>{persona.Apellidos}</TableCell>
                <TableCell>{persona.DNI}</TableCell>
                <TableCell>{persona.Celular}</TableCell>
                <TableCell>{persona.idCargo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </SidebarLayout>
  );
};

export default PersonasPage;
