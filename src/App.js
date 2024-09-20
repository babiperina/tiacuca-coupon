import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home.js';
import CouponDetail from './Components/CouponDetail.js';

function App() {
  return (
    <div>
      <Routes>
        {/* Página inicial (exibe todos os cupons) */}
        <Route path="/" element={<Home />} />

        {/* Página de um cupom específico */}
        <Route path="/coupon/:couponCode" element={<CouponDetail />} />
      </Routes>
    </div>
  );
}

export default App;
