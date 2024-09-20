import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [coupons, setCoupons] = useState([]); // Estado para armazenar os cupons
  const [loading, setLoading] = useState(true); // Estado para controlar o loading

  useEffect(() => {
    // Função para buscar os cupons
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('https://tiacuca-discount.onrender.com/api/coupons'); // URL da sua API no Render
        setCoupons(response.data); // Armazena os cupons no estado
        setLoading(false); // Desativa o loading
      } catch (error) {
        console.error('Erro ao buscar cupons:', error);
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  if (loading) {
    return <div>Carregando cupons...</div>;
  }

  return (
    <div>
      <h1>Lista de Cupons</h1>
      <ul>
        {coupons.map(coupon => (
          <li key={coupon.coupon_code}>
            {coupon.coupon_code} - {coupon.discount} - {coupon.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
