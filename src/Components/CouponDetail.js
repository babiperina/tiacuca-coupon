import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CouponDetail() {
  const { couponCode } = useParams(); // Captura o código do cupom da URL
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

  // Função para copiar o código do cupom
  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.coupon_code);
    alert('Código do cupom copiado!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span>@tiacucasobremesas</span>
          <span style={styles.title}>TIA CUCA SOBREMESAS</span>
        </div>
        
        <h2 style={styles.discount}>Você ganhou <strong>{coupon.discount}</strong> de desconto!</h2>

        <p style={styles.info}>
          Este cupom é válido apenas para os pedidos feitos pelo WhatsApp.
          <br />
          Este cupom é válido até <strong>{new Date(coupon.expiration_date).toLocaleDateString()}</strong>.
          <br />
          Este cupom só poderá ser utilizado uma vez.
        </p>

        <div style={styles.couponSection}>
          <span style={styles.couponLabel}>Código do Cupom</span>
          <div style={styles.couponCodeContainer}>
            <input type="text" value={coupon.coupon_code} readOnly style={styles.couponCodeInput} />
            <button onClick={handleCopy} style={styles.copyButton}>COPIAR</button>
          </div>
        </div>

        <a href="https://api.whatsapp.com/send?phone=SEU_NUMERO&text=Oi, quero usar o cupom!" style={styles.whatsappButton}>
          WPP FAÇA SEU PEDIDO AGORA
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#FFD447',
    padding: '20px',
    borderRadius: '10px',
    width: '350px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  title: {
    fontWeight: 'bold',
  },
  discount: {
    fontSize: '24px',
    color: '#333',
  },
  info: {
    fontSize: '14px',
    color: '#333',
    margin: '10px 0',
  },
  couponSection: {
    marginTop: '20px',
  },
  couponLabel: {
    fontWeight: 'bold',
  },
  couponCodeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    padding: '5px',
  },
  couponCodeInput: {
    border: 'none',
    fontSize: '16px',
    width: '75%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: '#D3D3D3',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  whatsappButton: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#38C857',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
};

export default CouponDetail;
