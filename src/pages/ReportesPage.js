import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Button, Paper, TextField, Grid, Typography, Alert,
  Autocomplete, createFilterOptions
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SidebarLayout from '../components/SidebarLayout';
import api from '../services/api';
import { useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import localeTextEs from '../utils/localeTextEs';

const ReportePage = () => {
  const { token } = useSelector(state => state.auth);
  const [datos, setDatos] = useState([]);
  const [operarios, setOperarios] = useState([]);
  const [dnis, setDnis] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [inputs, setInputs] = useState({ fechaInicio: '', fechaFin: '', dni: '', idEquipo: '', operario: '' });
  const [filtros, setFiltros] = useState({ ...inputs });

  const fetchOperarios = useCallback(async () => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await api.get('/reportes/reporte');
      const registros = res.data;
      setOperarios([...new Set(registros.map(d => d.Operario?.trim()).filter(Boolean))]);
      setDnis([...new Set(registros.map(d => d.DNI?.trim()).filter(Boolean))]);
      setEquipos([...new Set(registros.map(d => d.idEquipo?.trim()).filter(Boolean))]);
    } catch (error) {
      console.error('Error al obtener datos únicos para filtros:', error);
    }
  }, [token]);

  const fetchData = useCallback(async () => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value?.trim()) params.append(key, value);
      });

      const res = await api.get(`/reportes/reporte?${params.toString()}`);
      const dataWithId = res.data.map((item, index) => ({ id: index + 1, ...item }));
      setDatos(dataWithId);
    } catch (error) {
      console.error('Error al cargar datos del reporte:', error);
    }
  }, [token, filtros]);

  const handleExport = async () => {
    if (datos.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Actividades');
    const headers = Object.keys(datos[0]).filter(key => key !== 'id');
    const headerTitles = headers.map(formatearHeader);

    worksheet.addRow(headerTitles);
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1976D2' } };
    headerRow.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    };

    datos.forEach(dato => {
      worksheet.addRow(headers.map(key => dato[key]));
    });

    worksheet.columns.forEach(column => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, cell => {
        maxLength = Math.max(maxLength, String(cell.value || '').length);
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      });
      column.width = maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'ReporteActividades.xlsx');
  };

  const handleClearFilters = () => {
    const clean = { fechaInicio: '', fechaFin: '', dni: '', idEquipo: '', operario: '' };
    setInputs(clean);
    setFiltros(clean);
    setDatos([]);
  };

  useEffect(() => {
    if (token) {
      fetchData();
      fetchOperarios();
    }
  }, [token, fetchData, fetchOperarios]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setFiltros({ ...inputs });
    }, 400);
    return () => clearTimeout(debounce);
  }, [inputs]);

  const formatearHeader = (clave) => {
    const map = {
      Operario: 'Operario', DNI: 'DNI', idEquipo: 'Código Equipo',
      TipoEquipo: 'Tipo de Equipo', fechaHora: 'Fecha y Hora',
      tipoActividad: 'Tipo de Actividad', observaciones: 'Observaciones',
      ValorHorometro: 'Valor Horómetro',
      TipoMantenimiento: 'Tipo de Mantenimiento',
      DescripcionMantenimiento: 'Descripción del Mantenimiento'
    };
    return map[clave] || clave.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const columnas = datos.length > 0
    ? Object.keys(datos[0]).filter(k => k !== 'id').map(key => ({
        field: key, headerName: formatearHeader(key), flex: 1, minWidth: 150
      }))
    : [];

  const filterOptions = createFilterOptions({
    stringify: (option) => option, trim: true, ignoreAccents: true,
  });

  return (
    <SidebarLayout>
      <Box sx={{ mt: 2, px: 2, width: '100%', maxWidth: '1400px', mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>Reporte de Actividades</Typography>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth label="Fecha Inicio" type="date" helperText="Seleccionar Fecha de Inicio"
                InputLabelProps={{ shrink: true }}
                value={inputs.fechaInicio}
                onChange={e => setInputs(prev => ({ ...prev, fechaInicio: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth label="Fecha Fin" type="date" helperText="Seleccionar Fecha Final"
                InputLabelProps={{ shrink: true }}
                value={inputs.fechaFin}
                onChange={e => setInputs(prev => ({ ...prev, fechaFin: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Autocomplete
                options={equipos}
                value={inputs.idEquipo}
                onInputChange={(e, v) => setInputs(prev => ({ ...prev, idEquipo: v.trim() }))}
                renderInput={(params) => (
                  <TextField {...params} label="Código Equipo" fullWidth helperText="Digitar o seleccionar el Equipo"
                    InputProps={{ ...params.InputProps, style: { minHeight: 56, minWidth: 220 } }} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Autocomplete
                options={dnis}
                value={inputs.dni}
                inputValue={inputs.dni}
                onInputChange={(e, v) => {
                  const soloNumeros = v.replace(/\D/g, '');
                  if (soloNumeros.length <= 8) setInputs(prev => ({ ...prev, dni: soloNumeros }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="DNI" fullWidth
                    error={inputs.dni.length > 0 && inputs.dni.length !== 8}
                    helperText="Debe contener exactamente 8 dígitos"
                    inputProps={{ ...params.inputProps, maxLength: 8, inputMode: 'numeric', pattern: '\\d*' }}
                    InputProps={{ ...params.InputProps, style: { minHeight: 56, minWidth: 160 } }} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
              <Autocomplete
                options={operarios}
                filterOptions={filterOptions}
                value={inputs.operario}
                onInputChange={(e, v) => setInputs(prev => ({ ...prev, operario: v.trim() }))}
                renderInput={(params) => (
                  <TextField {...params} label="Operario" placeholder="Buscar por nombre completo" fullWidth
                    helperText="Digitar o seleccionar Operario"
                    InputProps={{ ...params.InputProps, style: { minHeight: 56, minWidth: 450 } }} />
                )}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-start" gap={2} flexWrap="wrap" sx={{ mt: 0 }}>
              <Button variant="contained" onClick={() => setFiltros({ ...inputs })}>Buscar</Button>
              <Button variant="outlined" onClick={handleExport} disabled={datos.length === 0}>Exportar Excel</Button>
              <Button variant="text" color="secondary" onClick={handleClearFilters}>Limpiar Filtros</Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Resultados</Typography>
          {datos.length === 0 ? (
            <Alert severity="info" sx={{ m: 2 }}>
              No se encontraron resultados con los filtros actuales.
            </Alert>
          ) : (
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={datos}
                columns={columnas}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50, 100]}
                pagination
                disableRowSelectionOnClick
                localeText={{ ...localeTextEs, footerPaginationRowsPerPage: 'Filas por página:' }}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>
          )}
        </Paper>
      </Box>
    </SidebarLayout>
  );
};

export default ReportePage;
