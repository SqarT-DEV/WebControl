// Guardar actividad localmente
export function saveOfflineActividad(actividad) {
  const data = JSON.parse(localStorage.getItem('offline_actividades')) || [];
  data.push(actividad);
  localStorage.setItem('offline_actividades', JSON.stringify(data));
}

// Obtener actividades pendientes
export function getOfflineActividades() {
  return JSON.parse(localStorage.getItem('offline_actividades')) || [];
}

// Limpiar actividades offline
export function clearOfflineActividades() {
  localStorage.removeItem('offline_actividades');
}
