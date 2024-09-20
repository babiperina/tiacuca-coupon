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
        <div>
          <div style={styles.contactInfo}>
              <h1 style={styles.h1Contact}>@tiacucasobremesas</h1>
              <h1 style={styles.h1Contact}>(85) 99762-7499</h1>
          </div>
        </div>
        <div style={styles.upContainer}>
          <div style={styles.discountInfo}>
            <p>Você ganhou</p>
            <span style={styles.discountSpanStyle}>10%</span>
            <p>de desconto!</p>
          </div>
          <div style={styles.couponSection}>
            <span style={styles.couponLabel}>Código do Cupom</span>
            <div style={styles.couponCodeContainer}>
              <input type="text" value={coupon.coupon_code} readOnly style={styles.couponCodeInput} />
              <button onClick={handleCopy} style={styles.copyButton}>COPIAR</button>
            </div>
          </div>
          <div style={styles.rulesInfo}>
            <p>
              Este cupom é válido apenas para os pedidos feitos pelo WhatsApp.
            </p>
            <p>
              Este cupom é válido até <strong>{new Date(coupon.expiration_date).toLocaleDateString()}</strong>.
            </p>
            <p>
              Este cupom só poderá ser utilizado uma vez.
            </p>
          </div>
        </div>
        <div style={styles.downContainer}>
          <a href="https://api.whatsapp.com/send?phone=SEU_NUMERO&text=Oi, quero usar o cupom!" style={styles.whatsappButton}>
            PEÇA AGORA PELO WHATSAPP
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },

  card: {
    backgroundColor: '#FFD447',
    padding: '10px',
    borderRadius: '10px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },

  contactInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10px 0 10px',
  },

  upContainer: {
    backgroundColor: '#FFF2E2',
    padding: '0 10px 0 10px',
  },

  h1Contact: {
    fontSize: '1rem', // Aproximadamente 20px, mas escalável
  },
  discountInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '1.25rem', // Aproximadamente 20px, mas escalável
  },
  discountSpanStyle: {
    fontSize: '4.5rem', // Aproximadamente 72px, mas escalável
    fontWeight: 'bold',
    color: '#FA5528',
    lineHeight: '1', // Ajuste de altura da linha para que o número não fique muito espaçado
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
    textAlign: 'left',
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: '#D3D3D3',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },

  rulesInfo: {
    fontSize: '0.7rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'self-start',
  },

  downContainer: {
    backgroundColor: '#FFF2E2',
    padding: '0 10px 20px 10px',
    borderRadius: '0 0 10px 10px', 
  },

  whatsappButton: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '20px 15px',
    backgroundColor: '#1FBC59',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '50px',
    textAlign: 'center',
    fontWeight: 'bold',
    width: '90%',
  },
};

export default CouponDetail;
