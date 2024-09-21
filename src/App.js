// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Sem BrowserRouter aqui
import CouponManager from './Components/CouponManager';
import Login from './Components/Login';
import Register from './Components/Register';
import PrivateRoute from './Components/PrivateRoute';
import { AuthProvider } from './Components/AuthContext';
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rota pública para registro */}
        <Route path="/register" element={<Register />} />

        {/* Rota pública para login */}
        <Route path="/login" element={<Login />} />

        {/* Rota protegida */}
        <Route path="/coupons" element={<PrivateRoute><CouponManager /></PrivateRoute>} />
        
        {/* Outras rotas podem ser adicionadas aqui */}
      </Routes>
    </AuthProvider>
  );
}

export default App;