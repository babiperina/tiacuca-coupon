import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Styles/NewAuth.css'; // Importando o CSS comum

const Login = () => {
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Função para lidar com login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://tiacuca-discount.onrender.com/api/auth/login', {
        telefone,
        password,
      });
      localStorage.setItem('token', response.data.token); // Salva o token
      setMessage('Login bem-sucedido!');
      navigate('/home'); // Redireciona para a página protegida
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setMessage('Erro ao fazer login. Verifique suas credenciais.');
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
            <Link to="/register">Criar uma conta</Link>
          </div>
        </div>
        <div className='main-content'>
          <form onSubmit={handleLogin}>
            <h2>Faça seu login</h2>
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
            <button type="submit">Login</button>
            {message && <p>{message}</p>}
          </form>
          <p>Não tem uma conta? <Link to="/register">Registrar</Link></p>
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

export default Login;
