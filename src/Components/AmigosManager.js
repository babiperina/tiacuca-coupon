import React, { useState, useEffect } from 'react';
import './Styles/AmigosManager.css'; // Importa o arquivo CSS

function AmigosManager() {
  const [points, setPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [expiringPoints, setExpiringPoints] = useState([]);
  const [showExpiring, setShowExpiring] = useState(false); // Estado para expandir a seção de expiração

  useEffect(() => {
    // Simulação de dados (substitua pela lógica real de busca)
    const fetchPoints = async () => {
      const userPoints = 125; // Exemplo de pontos
      setPoints(userPoints);
    };

    const fetchPointsHistory = async () => {
      // Simulando um histórico de pontos (substitua com chamada real à API)
      const history = [
        { date: '2024-09-20', action: 'Compra', points: 50 },
        { date: '2024-09-18', action: 'Resgate', points: -20 },
        { date: '2024-09-15', action: 'Devolução de Forma', points: 25 },
        { date: '2024-09-10', action: 'Compra', points: 70 },
      ];
      setPointsHistory(history);
    };

    const fetchExpiringPoints = async () => {
      // Simulando pontos que irão expirar (substitua com chamada real à API)
      const expiring = [
        { date: '2024-10-01', points: 30 },
        { date: '2024-10-05', points: 50 },
      ];
      setExpiringPoints(expiring);
    };

    fetchPoints();
    fetchPointsHistory();
    fetchExpiringPoints();
  }, []);

  const toggleExpiringPoints = () => {
    setShowExpiring(!showExpiring); // Alterna entre mostrar e ocultar os pontos que irão expirar
  };

  return (
    <div className="amigos-container">
      <div className="main-info">
        <h1>Seus Pontos</h1>
        <div className="points-box">
          <p>Total de Pontos:</p>
          <h2>R${points}</h2>
        </div>
      </div>

      <div className="expiring-section">
        <button className="toggle-expiring" onClick={toggleExpiringPoints}>
          {showExpiring ? 'Ocultar Pontos que Expiram' : 'Ver Pontos que Expiram'}
        </button>
        {showExpiring && (
          <div className="expiring-points">
            <h3>Pontos que expiram em breve</h3>
            <table>
              <thead>
                <tr>
                  <th>Data de Expiração</th>
                  <th>Pontos</th>
                </tr>
              </thead>
              <tbody>
                {expiringPoints.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
                    <td className="expiring">{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="points-history">
        <h2>Histórico de Pontos</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Ação</th>
              <th>Pontos</th>
            </tr>
          </thead>
          <tbody>
            {pointsHistory.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
                <td>{entry.action}</td>
                <td className={entry.points > 0 ? 'positive' : 'negative'}>
                  {entry.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AmigosManager;
