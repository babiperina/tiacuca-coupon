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
        const response = await axios.get(`https://tiacuca-discount.onrender.com/api/public-coupons/${couponCode}`);
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
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (!coupon) {
    return <div>Cupom não encontrado!</div>;
  }

  // Função para copiar o código do cupom
  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.coupon_code);
    alert('Código do cupom copiado!');
  };

  // Função para retornar o estilo e o texto de acordo com o status do cupom
  const getCouponStatus = (status) => {
    switch (status) {
      case 'active':
        return { text: 'disponível', color: 'green', fontWeight: 'bold' };
      case 'used':
        return { text: 'utilizado', color: 'gray', fontWeight: 'bold'  };
      case 'expired':
        return { text: 'expirado', color: 'red', fontWeight: 'bold'  };
      default:
        return { text: 'indefinido', color: 'black', fontWeight: 'bold'  };
    }
  };

  const couponStatus = getCouponStatus(coupon.status);

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
            <p style={styles.rulesInfoP}>Você ganhou</p>
            <span style={styles.discountSpanStyle}>10%</span>
            <p style={styles.rulesInfoP}>de desconto!</p>
          </div>
          <div style={styles.couponSection}>
            <span style={styles.couponLabel}>Código do Cupom</span>
            <div style={styles.couponCodeContainer}>
              <input type="text" value={coupon.coupon_code} readOnly style={styles.couponCodeInput} />
              <button onClick={handleCopy} style={styles.copyButton}>COPIAR</button>
            </div>
            <div style={styles.couponStatus}>
              este cupom encontra-se{' '}
              <span style={{ color: couponStatus.color, fontWeight: couponStatus.fontWeight }}>{couponStatus.text}</span>           
            </div>
          </div>
          <div style={styles.rulesInfo}>
            <p style={styles.rulesInfoP}>
              Este cupom é válido apenas para os pedidos feitos pelo WhatsApp.
            </p>
            <p style={styles.rulesInfoP}>
              Este cupom é válido até <strong>{new Date(new Date(coupon.expiration_date).setDate(new Date(coupon.expiration_date).getDate() + 1)).toLocaleDateString()}</strong>.
            </p>
            <p style={styles.rulesInfoP}>
              Este cupom só poderá ser utilizado uma vez.
            </p>
          </div>
        </div>
        <div style={styles.downContainer}>
          <a href={`https://api.whatsapp.com/send?phone=+5585997627499&text=Oi, eu estava na Muvuka e ganhei o cupom ${coupon.coupon_code}, que vale ${coupon.discount} de desconto! Gostaria de fazer um pedido!`} 
            style={styles.whatsappButton} >
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
    padding: '10px',
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },

  spinner: {
    border: '16px solid #f3f3f3', /* Light grey */
    borderRadius: '50%',
    borderTop: '16px solid #3498db', /* Blue */
    width: '120px',
    height: '120px',
    animation: 'spin 2s linear infinite',
  },

  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },

  card: {
    backgroundColor: '#FFD447',
    padding: '10px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '400px', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },

  contactInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10px 0 10px',
    fontSize: '0.9rem', 
  },

  upContainer: {
    backgroundColor: '#FFF2E2',
    padding: '0 10px 0 10px',
  },

  h1Contact: {
    fontSize: '1rem',
    color: '#4B1011',
  },
  discountInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px 0 0 0',
    color: '#4B1011',
    fontSize: '1.25rem',
  },
  discountSpanStyle: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#FA5528',
    lineHeight: '1',
  },

  couponSection: {
    marginTop: '20px',
  },
  couponLabel: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#4B1011',
  },
  couponCodeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    border: '1px solid #CDA300',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  couponCodeInput: {
    border: 'none',
    fontSize: '16px',
    width: '75%',
    textAlign: 'left',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '20px',
    color: '#4B1011',
  },
  copyButton: {
    backgroundColor: '#FFCB00',
    color: '#4B1011',
    border: 'none',
    borderRadius: '0 20px 20px 0',
    padding: '5px 10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderLeft: '1px solid #CDA300',
  },

  couponStatus: {
    marginTop: '5px',
    fontSize: '0.7rem',
  },

  rulesInfo: {
    fontSize: '0.7rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'self-start',
    padding: '20px 10px 10px 10px',
  },

  rulesInfoP: {
    margin: 0,
    color: '#4B1011',
  },

  downContainer: {
    backgroundColor: '#FFF2E2',
    padding: '0 10px 20px 10px',
    borderRadius: '0 0 10px 10px', 
  },

  whatsappButton: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '15px 10px',
    backgroundColor: '#1FBC59',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '50px',
    textAlign: 'center',
    fontWeight: 'bold',
    width: '90%',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

export default CouponDetail;
