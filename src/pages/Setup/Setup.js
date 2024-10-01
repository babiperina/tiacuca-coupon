import React, { useState } from 'react';
import './Setup.css'; // Importa o arquivo CSS

function Setup() {
  // Estado para armazenar os valores dos inputs
  const [userData, setUserData] = useState({
    name: 'Bárbara Perina',
    email: 'barbara@example.com',
    phone: '85991161551',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Função para lidar com a alteração de informações
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para lidar com as preferências de notificação
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Função para lidar com alteração de senha
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica de salvar os dados no backend
    alert('Dados salvos com sucesso!');
  };

  return (
    <div className="setup-container">
      <h1>Configurações da Conta</h1>
      <form onSubmit={handleSubmit}>
        {/* Informações pessoais */}
        <div className="setup-section">
          <h2>Informações Pessoais</h2>
          <label>
            Nome:
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            E-mail:
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Telefone:
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
            />
          </label>
        </div>

        {/* Preferências de Notificação */}
        <div className="setup-section">
          <h2>Preferências de Notificação</h2>
          <label>
            <input
              type="checkbox"
              name="email"
              checked={notifications.email}
              onChange={handleNotificationChange}
            />
            Receber notificações por e-mail
          </label>
          <label>
            <input
              type="checkbox"
              name="sms"
              checked={notifications.sms}
              onChange={handleNotificationChange}
            />
            Receber notificações por SMS
          </label>
        </div>

        {/* Alteração de Senha */}
        <div className="setup-section">
          <h2>Alterar Senha</h2>
          <label>
            Senha Atual:
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <label>
            Nova Senha:
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <label>
            Confirmar Nova Senha:
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
            />
          </label>
        </div>

        <button type="submit" className="save-button">Salvar Alterações</button>
      </form>
    </div>
  );
}

export default Setup;
