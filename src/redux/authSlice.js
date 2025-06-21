import { createSlice } from '@reduxjs/toolkit';

const storedAuth = localStorage.getItem('auth');

const initialState = storedAuth
  ? JSON.parse(storedAuth)
  : {
      token: null,
      user: null
    };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      localStorage.setItem('auth', JSON.stringify({ token, user }));
    },
    updateFotoPerfil: (state, action) => {
      if (state.user) {
        state.user.fotoPerfil = action.payload;
        localStorage.setItem('auth', JSON.stringify({ token: state.token, user: state.user }));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('auth');
    }
  }
});

export const { setCredentials, logout, updateFotoPerfil } = authSlice.actions;
export default authSlice.reducer;
