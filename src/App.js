import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CouponManager from './Components/CouponManager.js';
import CouponDetail from './Components/CouponDetail.js';

function App() {
  return (
    <div>
      <Routes>
        {/* Página inicial (exibe todos os cupons)
        <Route path="/" element={<CouponManager />} /> */}

        {/* Página de um cupom específico */}
        <Route path="/cupom-da-muvuka/:couponCode" element={<CouponDetail />} />
      </Routes>
    </div>
  );
}

export default App;
