import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('https://tiacuca-discount.onrender.com/api/coupons');
        setCoupons(response.data);
        setLoading(false);
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
            <Link to={`/coupon/${coupon.coupon_code}`}>
              {coupon.coupon_code} - {coupon.discount}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
