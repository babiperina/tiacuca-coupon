import React, { useState } from 'react';
import axios from 'axios';

function CreateCoupon() {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCoupon = {
        coupon_code: couponCode,
        discount,
        expiration_date: expirationDate,
      };
      await axios.post('https://tiacuca-discount.onrender.com/api/coupons', newCoupon);
      alert('Cupom criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar o cupom:', error);
      alert('Erro ao criar o cupom.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Novo Cupom</h2>
      <input
        type="text"
        placeholder="Código do Cupom"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <input
        type="text"
        placeholder="Desconto"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
      />
      <input
        type="date"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
      />
      <button type="submit">Criar Cupom</button>
    </form>
  );
}

export default CreateCoupon;
