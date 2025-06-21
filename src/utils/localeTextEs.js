const localeTextEs = {
  noRowsLabel: 'No se encontraron resultados',
  columnMenuLabel: 'Menú',
  columnMenuShowColumns: 'Mostrar columnas',
  columnMenuFilter: 'Filtrar',
  columnMenuHideColumn: 'Ocultar',
  columnMenuUnsort: 'Quitar orden',
  columnMenuSortAsc: 'Orden ascendente',
  columnMenuSortDesc: 'Orden descendente',
  columnMenuManageColumns: 'Gestionar columnas',
  columnsPanelTextFieldLabel: 'Buscar columna',
  columnsPanelTextFieldPlaceholder: 'Nombre de la columna',
  columnsPanelDragIconLabel: 'Reordenar columna',
  columnsPanelShowAllButton: 'Mostrar todas',
  columnsPanelHideAllButton: 'Ocultar todas',
  footerRowSelected: (count) =>
    count === 1
      ? '1 fila seleccionada'
      : `${count.toLocaleString()} filas seleccionadas`,
  footerTotalRows: 'Filas totales:',
  footerPaginationRowsPerPage: 'Filas por página:',
  toolbarExport: 'Exportar',
  toolbarExportCSV: 'Descargar como CSV',
  toolbarExportPrint: 'Imprimir',
};

export default localeTextEs;


//es la traduccion de las opciones de ordenado en la tabla de reporte