import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AuthLoader = ({ children }) => {
  const { token, user } = useSelector(state => state.auth);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simula la rehidratación de Redux
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.token && parsed.user) {
        setReady(true);
      }
    } else {
      setReady(true); // No hay sesión guardada
    }
  }, [token, user]);

  if (!ready) return null; // O spinner

  return children;
};

export default AuthLoader;
