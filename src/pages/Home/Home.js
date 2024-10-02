import React, { useEffect, useState } from "react";
import CouponManager from "../CouponManager/CouponManager"; // Importa o componente do gerenciador de cupons
import Setup from "../Setup/Setup"; // Importa o componente de configurações
import "./Home.css"; // Importa o arquivo CSS
import AmigosManager from "../AmigosManager/AmigosManager";
import RoleManager from "../RoleManager/RoleManager";

function Home() {
  // Estado para controlar qual componente está ativo
  const [activeComponent, setActiveComponent] = useState("amigos");
  const [isUser, setIsUser] = useState(false);

  // Função para renderizar o componente ativo
  const renderContent = () => {
    switch (activeComponent) {
      case "amigos":
        return <AmigosManager />;
      case "cupons":
        return <CouponManager />;
      case "users":
        return <RoleManager />;
      case "configuracoes":
        return <Setup />;
      default:
        return <AmigosManager />; // Componente padrão
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user.roles.length === 1);
    console.log(user.roles[0] === 'users');
    if (user.roles.length === 1 && user.roles[0] === 'users') {
      console.log('texto aleatório')
       setIsUser(true); 
      };
    console.log(isUser)
  }, []);


  return (
    <div className="home-container">
      {/* Sidebar permanece fixo */}
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div>
              <img src="logo192.png" alt="Tia Cuca" />
            </div>
            <div>
              <p>Tia Cuca</p>
            </div>
          </div>

          {/* Primeira seção de menus (Amigos e Cupons) */}
          <div className="menu-section">
            <nav>
              <ul>
                <li>
                  <button onClick={() => setActiveComponent("amigos")}>
                    Amigos da Tia Cuca
                  </button>
                </li>
                 {isUser && 
                  <li>
                    <button onClick={() => setActiveComponent("cupons")}>
                      Gestor de Cupons
                    </button>
                  </li>}
                <li>
                  <button onClick={() => setActiveComponent("users")}>
                    Gestor de Usuários
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Segunda seção de menu (Configurações) */}
          <div className="config-section">
            <nav>
              <ul>
                <li>
                  <button onClick={() => setActiveComponent("configuracoes")}>
                    Configurações
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Informações do usuário no rodapé */}
          <div className="sidebar-footer">
            <div>
              <img src="profilepic.png" alt="Tia Cuca" />
            </div>
            <div>
              <p>Bárbara Perina</p>
              <p>85991161551</p>
            </div>
          </div>
        </div>
      </div>

      {/* O conteúdo vai mudar aqui conforme o botão clicado */}
      <div className="content">
        {renderContent()} {/* Renderiza o componente ativo */}
      </div>
    </div>
  );
}

export default Home;
