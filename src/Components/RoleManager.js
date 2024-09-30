import { useEffect, useState } from "react";
import axios from "axios";
import './Styles/RoleManager.css'; // Importa o arquivo CSS externo

function RoleManager() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      const authToken = localStorage.getItem("token"); // Substitua pelo seu token de autenticação

      try {
        const response = await axios.get(
          "https://tiacuca-discount.onrender.com/api/roles",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Passando o token no cabeçalho
            },
          }
        );
        setRoles(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar papéis:", error);
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      const authToken = localStorage.getItem("token"); // Substitua pelo seu token de autenticação

      try {
        const response = await axios.get(
          "https://tiacuca-discount.onrender.com/api/users",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Passando o token no cabeçalho
            },
          }
        );
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setLoading(false);
      }
    };

    fetchRoles();
    fetchUsers();
  }, []);

  // Função para lidar com a mudança de role
  const handleRoleChange = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, roles: [newRole] } : user
      )
    );
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
      <div className="card">
        <div className="header">
          <h1 className="title">Lista de Usuários</h1>
          <button className="logoutButton">Logout</button>
        </div>
        <div className="usersCount">Total de Usuários: {users.length}</div>
        <table>
          <tbody>
            <tr>
              <th>Telefone</th>
              <th>Papel</th>
              <th>Criado em</th>
              <th>Atualizado em</th>
            </tr>
            {users.map((user) => {
              const createdAt = new Date(user.created_at).toLocaleString(
                "pt-BR"
              );
              const updatedAt = new Date(user.updated_at).toLocaleString(
                "pt-BR"
              );

              return (
                <tr key={user.id}>
                  <td>{user.telefone}</td>
                  <td>
                    <select
                      value={user.roles[0]}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.role_name}>
                          {role.role_name}
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

export default RoleManager;
