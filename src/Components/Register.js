import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Styles/Auth.css'; // Importando o CSS comum

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://tiacuca-discount.onrender.com/api/auth/register', {
        email,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setMessage('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className="auth-container">
      <div>
      <h2>Registrar</h2>
      <form onSubmit={handleRegister} className="auth-form">
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
        <button type="submit" className="auth-button">Registrar</button>
      </form>
      <p className="auth-message">{message}</p>
      <p className="auth-link">
        Já tem uma conta? <Link to="/">Login</Link>
      </p>
      </div>
    </div>
  );
};

export default Register;
