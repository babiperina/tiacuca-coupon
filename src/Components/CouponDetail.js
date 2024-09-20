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
        
        <div style={styles.mainContent}>
          <h2 style={styles.discount}>Você ganhou <strong style={styles.discountPercentage}>{coupon.discount}</strong> de desconto!</h2>

          <div style={styles.rules}>
            <p style={styles.info}>
              Este cupom é válido apenas para os pedidos feitos pelo WhatsApp.
            </p>
            <p style={styles.info}>
              Este cupom é válido até <strong>{new Date(coupon.expiration_date).toLocaleDateString()}</strong>.
            </p>
            <p style={styles.info}>
              Este cupom só poderá ser utilizado uma vez.
            </p>
          </div>
        </div>

        <div style={styles.couponSection}>
          <span style={styles.couponLabel}>Código do Cupom</span>
          <div style={styles.couponCodeContainer}>
            <input type="text" value={coupon.coupon_code} readOnly style={styles.couponCodeInput} />
            <button onClick={handleCopy} style={styles.copyButton}>COPIAR</button>
          </div>
        </div>

        <a href="https://api.whatsapp.com/send?phone=SEU_NUMERO&text=Oi, quero usar o cupom!" style={styles.whatsappButton}>
          FAÇA SEU PEDIDO AGORA
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
    width: '400px',
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
  mainContent: {
    display: 'flex',        // Ativa o layout flex
    flexDirection: 'row',  
    gap: '10px',  
  },
  rules: {
    display: 'flex',        // Ativa o layout flex
    flexDirection: 'column',  
    alignItems: 'center',
    justifyContent: 'center'
  },
  discount: {
    fontSize: '22px',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',   // Garante que os elementos sejam empilhados em uma coluna
    alignItems: 'flex-start',
    minWidth: '140px',  // Define a largura mínima de 140px
  },
  discountPercentage:{
    fontSize: '65px',
    textAlign: 'center',
  },
  info: {
    fontSize: '14px',
    color: '#333',
    margin: '10px 0',   // Garante que os elementos sejam empilhados em uma coluna
    textAlign: 'left',  // Alinha os itens à esquerda
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
    fontWeight: 'bold'
  },
  whatsappButton: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#38C857',
    color: '#fff',
    textDecoration: 'none',
    width: '92%',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
};

export default CouponDetail;
