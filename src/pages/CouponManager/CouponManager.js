import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CouponManager.css'; // Importando o CSS externo

function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [discountFilter, setDiscountFilter] = useState('all');
  const itemsPerPage = 21;

  useEffect(() => {
    const fetchCoupons = async () => {
      const authToken = localStorage.getItem('token');

      try {
        const response = await axios.get('https://tiacuca-discount.onrender.com/api/coupons', {
          headers: {
            Authorization: `Bearer ${authToken}`,
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
    return ['all', ...new Set(discounts)];
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return { label: 'Disponível', color: '#4CAF50' };
      case 'used':
        return { label: 'Utilizado', color: '#808080' };
      case 'expired':
        return { label: 'Expirado', color: '#FF4C4C' };
      default:
        return { label: 'Indefinido', color: '#000000' };
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

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/#';
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Lista de Cupons</h1>
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
      </div>
      <div className="couponCount">Total de Cupons: {coupons.length}</div>

      {/* Filtros */}
      <div className="filterContainer">
        <input 
          type="text" 
          placeholder="Filtrar por código do cupom" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="filterInput"
        />

        <select
          value={discountFilter}
          onChange={(e) => setDiscountFilter(e.target.value)}
          className="filterSelect"
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
          className="filterSelect"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativo</option>
          <option value="used">Usado</option>
          <option value="expired">Expirado</option>
        </select>
      </div>

      {/* Exibição dos cupons */}
      <div style={{ width: '100%' }}>
        {currentCoupons.map((coupon) => (
          <div key={coupon.coupon_code} className="coupon-item">
            <h3>
              <Link to={`/cupom-da-muvuka/${coupon.coupon_code}`} className="coupon-code">
                {coupon.coupon_code}
              </Link>
            </h3>
            <p className="coupon-detail"><strong>{coupon.discount}</strong> de desconto.</p>
            <p className={`coupon-status ${coupon.status}`}>
              <strong>{getStatusLabel(coupon.status).label}</strong>
            </p>
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
  );
}

function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="paginationContainer">
      <ul className="paginationList">
        {pageNumbers.map((number) => (
          <li key={number} className="paginationItem">
            <button
              onClick={() => paginate(number)}
              className="paginationButton"
              style={{
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

export default CouponManager;
