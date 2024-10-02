import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Login/Login.css'; // Importando o CSS

const Register = () => {
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://tiacuca-discount.onrender.com/api/auth/register', {
        telefone,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setMessage('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className="parent-div">
      <div className="content-div">
        <div className='header'>
          <div>
            Tia Cuca
          </div>
          <div>
          <Link to="/">Fazer Login</Link>
          </div>
        </div>
        <div className='main-content'>
          <form onSubmit={handleRegister}>
            <h2>Crie sua conta</h2>
            <div>
              <label>Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
                placeholder="(99) 99999-9999"
              />
            </div>
            <div>
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Insira sua senha"
              />
            </div>
            <div>
              <label>Confirmação de senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirme sua senha"
              />
            </div>
            <button type="submit">Cadastrar</button>
            {message && <p>{message}</p>}
          </form>
          <p>Já possui uma conta? <Link to="/">Login</Link></p>
        </div>
        <div className='footer'>Teste</div>
      </div>
      <div className="banner-div">
        <h1>Bem-vindo à Tia Cuca</h1>
        <p>Cadastre-se para receber nossos descontos especiais!</p>
      </div>
    </div>
  );
};

export default Register;
