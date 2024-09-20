import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CouponDetail() {
  const { couponCode } = useParams(); // Pega o código do cupom da URL
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await axios.get(`https://tiacuca-discount.onrender.com/api/coupons/${couponCode}`);
        setCoupon(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar o cupom:', error);
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [couponCode]);

  if (loading) {
    return <div>Carregando detalhes do cupom...</div>;
  }

  if (!coupon) {
    return <div>Cupom não encontrado!</div>;
  }

  return (
    <div>
      <h1>Detalhes do Cupom</h1>
      <p><strong>Código:</strong> {coupon.coupon_code}</p>
      <p><strong>Desconto:</strong> {coupon.discount}</p>
      <p><strong>Status:</strong> {coupon.status}</p>
      <p><strong>Data de Expiração:</strong> {new Date(coupon.expiration_date).toLocaleDateString()}</p>
    </div>
  );
}

export default CouponDetail;
