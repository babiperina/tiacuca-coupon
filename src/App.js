// App.js
import React from "react";
import { Route, Routes } from "react-router-dom"; // Sem BrowserRouter aqui
import CouponManager from "./pages/CouponManager/CouponManager";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home/Home";
import CouponDetail from "./pages/CouponDetail/CouponDetail";
import RoleManager from "./pages/RoleManager/RoleManager";
import { AuthProvider } from "./contexts/AuthContext";


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rota pública para registro */}
        <Route path="/register" element={<Register />} />

        {/* Rota pública para login */}
        <Route path="/" element={<Login />} />

        {/* Rota protegida */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Rota protegida */}
        <Route
          path="/coupons"
          element={
            <PrivateRoute>
              <CouponManager />
            </PrivateRoute>
          }
        />

        {/* Página de um cupom específico */}
        <Route path="/cupom-da-muvuka/:couponCode" element={<CouponDetail />} />

        {/* Gerenciamento de papeis */}
        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <RoleManager />
            </PrivateRoute>
          }
        />

        {/* Outras rotas podem ser adicionadas aqui */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
