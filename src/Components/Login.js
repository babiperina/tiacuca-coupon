import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Styles/Auth.css'; // Importando o CSS comum

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [couponCode, setCouponCode] = useState(''); // Estado para o cupom
  const navigate = useNavigate();

  // Função para lidar com login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://tiacuca-discount.onrender.com/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token); // Salva o token
      setMessage('Login bem-sucedido!');
      navigate('/coupons'); // Redireciona para a página protegida
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setMessage('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  // Função para lidar com o envio do cupom
  const handleCouponCheck = (e) => {
    e.preventDefault();
    if (couponCode.trim() !== '') {
      navigate(`/cupom-da-muvuka/${couponCode}`); // Redireciona para a rota do cupom
    }
  };

  return (
    <div className="auth-container">
      <div>
      <h2>Confira seu Cupom</h2>
      {/* Formulário de verificação de cupom */}
      <div className="coupon-check-container">
        <form onSubmit={handleCouponCheck} className="coupon-form">
          <input
            type="text"
            placeholder="Insira o código do cupom"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="auth-input"
          />
          <button type="submit" className="auth-button">Verificar Cupom</button>
        </form>
      </div>
      <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button type="submit" className="auth-button">Login</button>
      </form>
      <p className="auth-message">{message}</p>

      <p className="auth-link">
        Não tem uma conta? <Link to="/register">Registrar</Link>
      </p>
      </div>
      </div>
    </div>
  );
};

export default Login;
