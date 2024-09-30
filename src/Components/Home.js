import React, { useState } from "react";
import CouponManager from "./CouponManager"; // Importa o componente do gerenciador de cupons
import Login from "./Login"; // Importa o componente do gerenciador de cupons
// import Amigos from "./Amigos"; // Importa o componente Amigos
// import Setup from "./Setup"; // Importa o componente de configurações
import "./Styles/Home.css"; // Importa o arquivo CSS

function Home() {
  // Estado para controlar qual componente está ativo
  const [activeComponent, setActiveComponent] = useState("amigos");

  // Função para renderizar o componente ativo
  const renderContent = () => {
    switch (activeComponent) {
      case "amigos":
        // return <Login />;
      case "cupons":
        return <CouponManager />;
      case "configuracoes":
        // return <Setup />;
      default:
        return <CouponManager />; // Componente padrão
    }
  };

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
                <li>
                  <button onClick={() => setActiveComponent("cupons")}>
                    Meus Cupons
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
              <img src="logo192.png" alt="Tia Cuca" />
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
