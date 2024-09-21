import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // Default is 'all'
  const [discountFilter, setDiscountFilter] = useState('all');
  const itemsPerPage = 21;

  useEffect(() => {
    const fetchCoupons = async () => {
      const authToken = localStorage.getItem('token'); // Substitua pelo seu token de autenticação

      try {
        const response = await axios.get('https://tiacuca-discount.onrender.com/api/coupons', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Passando o token no cabeçalho
          },
        });
        setCoupons(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar cupons:', error);
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const getUniqueDiscounts = () => {
    const discounts = coupons.map(coupon => coupon.discount);
    return ['all', ...new Set(discounts)]; // Adiciona 'all' como opção padrão
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return { label: 'Disponível', color: '#4CAF50' }; // Verde
      case 'used':
        return { label: 'Utilizado', color: '#808080' }; // Cinza
      case 'expired':
        return { label: 'Expirado', color: '#FF4C4C' }; // Vermelho
      default:
        return { label: 'Indefinido', color: '#000000' }; // Preto para indefinido
    }
  };

  const handleUseCoupon = async (coupon_code) => {
    const authToken = localStorage.getItem('token'); 

    try {
      const response = await axios.post(
        'https://tiacuca-discount.onrender.com/api/coupons/use',
        {
          coupon_code: coupon_code, 
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setCoupons(coupons.map(coupon => 
          coupon.coupon_code === coupon_code ? { ...coupon, status: 'used' } : coupon
        ));
      } else {
        console.error('Erro ao usar o cupom:', response);
      }
    } catch (error) {
      console.error('Erro ao usar o cupom:', error);
    }
  };

  const handleReleaseCoupon = async (coupon_code) => {
    const authToken = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'https://tiacuca-discount.onrender.com/api/coupons/active',
        {
          coupon_code: coupon_code,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setCoupons(coupons.map(coupon => 
          coupon.coupon_code === coupon_code ? { ...coupon, status: 'active' } : coupon
        ));
      } else {
        console.error('Erro ao ativar o cupom:', response);
      }
    } catch (error) {
      console.error('Erro ao ativar o cupom:', error);
    }
  };

  const sortedCoupons = React.useMemo(() => {
    let sortableCoupons = [...coupons];

    if (statusFilter !== 'all') {
      sortableCoupons = sortableCoupons.filter(coupon => coupon.status === statusFilter);
    }

    if (filter) {
      sortableCoupons = sortableCoupons.filter(coupon =>
        coupon.coupon_code.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (discountFilter !== 'all') {
      sortableCoupons = sortableCoupons.filter(coupon => 
        coupon.discount.toString() === discountFilter
      );
    }

    if (sortConfig !== null) {
      sortableCoupons.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableCoupons;
  }, [coupons, sortConfig, filter, statusFilter, discountFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoupons = sortedCoupons.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <div>Carregando cupons...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Lista de Cupons</h1>
        <div style={styles.couponCount}>Total de Cupons: {coupons.length}</div>

        {/* Filtros */}
        <div style={styles.filterContainer}>
          <input 
            type="text" 
            placeholder="Filtrar por código do cupom" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            style={styles.filterInput}
          />

          <select
            value={discountFilter}
            onChange={(e) => setDiscountFilter(e.target.value)}
            style={styles.filterSelect}
          >
            {getUniqueDiscounts().map((discount, index) => (
              <option key={index} value={discount}>
                {discount === 'all' ? 'Todos os Descontos' : `${discount}`}
              </option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativo</option>
            <option value="used">Usado</option>
            <option value="expired">Expirado</option>
          </select>
        </div>

        {/* Exibição dos cupons como cards */}
        <div style={styles.cardGrid}>
          {currentCoupons.map((coupon) => (
            <div key={coupon.coupon_code} style={styles.couponCard}>
              <h3 style={styles.couponCode}>
                <Link to={`/cupom-da-muvuka/${coupon.coupon_code}`} style={styles.link}>
                  {coupon.coupon_code}
                </Link>
              </h3>
              <p style={styles.couponDetail}><strong>{coupon.discount}</strong> de desconto.</p>
              <p style={{ ...styles.couponDetail, color: getStatusLabel(coupon.status).color }}>
                <strong>{getStatusLabel(coupon.status).label}</strong>
              </p>              
              {coupon.status === 'active' ? (
                <button style={{ ...styles.actionButton, backgroundColor: '#FF4C4C' }} onClick={() => handleUseCoupon(coupon.coupon_code)}>
                  Usar Cupom
                </button>
              ) : (
                <button style={{ ...styles.actionButton, backgroundColor: '#007BFF' }} onClick={() => handleReleaseCoupon(coupon.coupon_code)}>
                  Liberar Cupom
                </button>
              )}
            </div>
          ))}
        </div>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={sortedCoupons.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav style={styles.paginationContainer}>
      <ul style={styles.paginationList}>
        {pageNumbers.map((number) => (
          <li key={number} style={styles.paginationItem}>
            <button
              onClick={() => paginate(number)}
              style={{
                ...styles.paginationButton,
                backgroundColor: currentPage === number ? '#643528' : '#FFF',
                color: currentPage === number ? '#FFF' : '#000',
              }}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff2e2',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '800px',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  couponCount: {
    textAlign: 'right',
    fontSize: '18px',
    marginBottom: '10px',
    color: '#666',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  filterInput: {
    flex: '1',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minWidth: '150px',
  },
  filterSelect: {
    flex: '0 0 200px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minWidth: '150px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  couponCard: {
    backgroundColor: '#FFF',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  couponCode: {
    fontSize: '14px',  // Diminua o tamanho da fonte aqui
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  couponDetail: {
    fontSize: '14px',
    marginBottom: '10px',
  },
  actionButton: {
    padding: '10px 15px',
    borderRadius: '5px',
    color: '#FFF', // Cor do texto branca para ambos os botões
    border: 'none',
    cursor: 'pointer',
  },  
  paginationContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  paginationList: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
  },
  paginationItem: {
    margin: '0 5px',
  },
  paginationButton: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#FFF',
  },
  link: {
    color: '#643528',  // Marrom claro  
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default CouponManager;
