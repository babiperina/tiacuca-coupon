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
  const itemsPerPage = 20;

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

  // Função para obter os valores únicos de desconto para o select
  const getUniqueDiscounts = () => {
    const discounts = coupons.map(coupon => coupon.discount);
    return ['all', ...new Set(discounts)]; // Adiciona 'all' como opção padrão
  };

  // Função para converter o status do cupom
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'used':
        return 'Usado';
      case 'expired':
        return 'Expirado';
      default:
        return 'Indefinido';
    }
  };

  // Função para usar o cupom com a API fornecida
  const handleUseCoupon = async (coupon_code) => {
    try {
      const response = await axios.post('https://tiacuca-discount.onrender.com/api/coupons/use', {
        coupon_code: coupon_code,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

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

  // Função para liberar o cupom (marcar como ativo)
  const handleReleaseCoupon = async (coupon_code) => {
    try {
      const response = await axios.post('https://tiacuca-discount.onrender.com/api/coupons/active', {
        coupon_code: coupon_code,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

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

  // Função para ordenar e filtrar os cupons
  const sortedCoupons = React.useMemo(() => {
    let sortableCoupons = [...coupons];

    // Filtro por status
    if (statusFilter !== 'all') {
      sortableCoupons = sortableCoupons.filter(coupon => coupon.status === statusFilter);
    }

    // Filtro por código do cupom
    if (filter) {
      sortableCoupons = sortableCoupons.filter(coupon =>
        coupon.coupon_code.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Filtro por desconto
    if (discountFilter !== 'all') {
      sortableCoupons = sortableCoupons.filter(coupon => 
        coupon.discount.toString() === discountFilter
      );
    }

    // Ordenação
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

        {/* Filtros organizados em uma linha */}
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

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader} onClick={() => requestSort('coupon_code')}>
                Código do Cupom {sortConfig.key === 'coupon_code' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
              </th>
              <th style={styles.tableHeader} onClick={() => requestSort('discount')}>
                Desconto {sortConfig.key === 'discount' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
              </th>
              <th style={styles.tableHeader} onClick={() => requestSort('status')}>
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
              </th>
              <th style={styles.tableHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentCoupons.map((coupon, index) => (
              <tr key={coupon.coupon_code} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.tableData}>
                  <Link to={`/cupom-da-muvuka/${coupon.coupon_code}`} style={styles.link}>
                    {coupon.coupon_code}
                  </Link>
                </td>
                <td style={styles.tableData}>{coupon.discount}</td>
                <td style={styles.tableData}>{getStatusLabel(coupon.status)}</td>
                <td style={styles.tableData}>
                  {coupon.status === 'active' ? (
                    <button style={styles.actionButton} onClick={() => handleUseCoupon(coupon.coupon_code)}>
                      Usar Cupom
                    </button>
                  ) : (
                    <button style={styles.actionButton} onClick={() => handleReleaseCoupon(coupon.coupon_code)}>
                      Liberar Cupom
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                backgroundColor: currentPage === number ? '#4CAF50' : '#FFF',
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
    paddingTop: '50px',
  },
  card: {
    backgroundColor: '#F4F4F9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '80%',
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
    marginBottom: '20px',
    gap: '10px',
  },
  filterInput: {
    flex: '1',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  filterSelect: {
    flex: '0 0 200px', // Largura fixa para o select
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tableData: {
    padding: '12px',
    textAlign: 'center',
    border: '1px solid #ddd',
  },
  rowEven: {
    backgroundColor: '#F9F9F9',
  },
  rowOdd: {
    backgroundColor: '#FFF',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontWeight: 'bold',
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
  actionButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: '#FFF',
    border: 'none',
    cursor: 'pointer',
  },
};

export default CouponManager;
