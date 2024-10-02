import { useEffect, useState } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';

function RoleManager() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      const authToken = localStorage.getItem('token'); // Substitua pelo seu token de autenticação

      try {
        const response = await axios.get('https://tiacuca-discount.onrender.com/api/roles', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Passando o token no cabeçalho
          },
        });
        setRoles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar papéis:', error);
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      const authToken = localStorage.getItem('token'); // Substitua pelo seu token de autenticação

      try {
        const response = await axios.get('https://tiacuca-discount.onrender.com/api/users', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Passando o token no cabeçalho
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setLoading(false);
      }
    }

    fetchRoles();
    fetchUsers();

  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Lista de Usuários</h1>
          <button style={styles.logoutButton}>Logout</button>
        </div>
        <div style={styles.usersCount}>Total de Usuários: {users.length}</div>
        <table>
          <tbody>
            <tr>
              <th>Telefone</th>
              <th>Papel</th>
              <th>Criado em</th>
              <th>Atualizado em</th>
            </tr>
            {users.map((user) => {
              const createdAt = new Date(user.created_at).toLocaleString('pt-BR');
              const updatedAt = new Date(user.updated_at).toLocaleString('pt-BR');
              console.log(user.roles)

              return (
                <tr key={user.id}>
                  <td>{user.telefone}</td>
                  <td>
                    <select>
                      {roles.map((role) => (
                        <option key={role.id} value={user.roles[0] === role.role_name && user.roles[0]}>
                          {user.roles[0] === role.role_name && user.roles[0]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{createdAt}</td>
                  <td>{updatedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

}
    

const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
    },
    card: {
      backgroundColor: '#fff2e2',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '800px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      textAlign: 'center',
      fontSize: '24px',
      color: '#333',
    },
    logoutButton: {
      padding: '10px 15px',
      borderRadius: '5px',
      backgroundColor: '#FF4C4C',
      color: '#FFF',
      border: 'none',
      cursor: 'pointer',
    },
    usersCount: {
      textAlign: 'right',
      fontSize: '18px',
      marginBottom: '10px',
      color: '#666',
    },
    filterContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '20px',
    },
    filterInput: {
      flex: '1',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      minWidth: '150px',
    },
    filterSelect: {
      flex: '0 0 200px',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      minWidth: '150px',
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
    },
    couponCard: {
      backgroundColor: '#FFF',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    couponCode: {
      fontSize: '14px',  // Diminua o tamanho da fonte aqui
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    couponDetail: {
      fontSize: '14px',
      marginBottom: '10px',
    },
    actionButton: {
      padding: '10px 15px',
      borderRadius: '5px',
      color: '#FFF', // Cor do texto branca para ambos os botões
      border: 'none',
      cursor: 'pointer',
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
    link: {
      color: '#643528',  // Marrom claro  
      textDecoration: 'none',
      fontWeight: 'bold',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
  
    spinner: {
      border: '16px solid #f3f3f3', /* Light grey */
      borderRadius: '50%',
      borderTop: '16px solid #3498db', /* Blue */
      width: '120px',
      height: '120px',
      animation: 'spin 2s linear infinite',
    },
  
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  };

export default RoleManager;
