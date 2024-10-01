import { useEffect, useState } from "react";
import axios from "axios";
import './Styles/RoleManager.css'; // Importa o arquivo CSS externo

function RoleManager() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modifiedUsers, setModifiedUsers] = useState({}); // Armazena as mudanças nos usuários

  useEffect(() => {
    const fetchRoles = async () => {
      const authToken = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "https://tiacuca-discount.onrender.com/api/roles",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setRoles(response.data);
      } catch (error) {
        console.error("Erro ao buscar papéis:", error);
      }
    };

    const fetchUsers = async () => {
      const authToken = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "https://tiacuca-discount.onrender.com/api/users",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
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
        user.id === userId ? { ...user, newRole } : user
      )
    );

    // Marca o usuário como modificado
    setModifiedUsers((prevModifiedUsers) => ({
      ...prevModifiedUsers,
      [userId]: newRole,
    }));
  };

  // Função para salvar a alteração da role
  const saveUserRole = async (userId) => {
    const newRole = modifiedUsers[userId];
    const authToken = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `https://tiacuca-discount.onrender.com/api/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Role atualizada com sucesso!");
        // Remove o usuário modificado da lista de modificações
        setModifiedUsers((prevModifiedUsers) => {
          const { [userId]: _, ...remainingUsers } = prevModifiedUsers;
          return remainingUsers;
        });
      }
    } catch (error) {
      console.error("Erro ao salvar a role:", error);
    }
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
          <thead>
            <tr>
              <th>Telefone</th>
              <th>Papel</th>
              <th>Criado em</th>
              <th>Atualizado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const createdAt = new Date(user.created_at).toLocaleString("pt-BR");
              const updatedAt = new Date(user.updated_at).toLocaleString("pt-BR");

              return (
                <tr key={user.id}>
                  <td>{user.telefone}</td>
                  <td>
                    <select
                      value={user.newRole || user.roles[0]}
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
                  <td>
                    {/* O botão "Salvar" está sempre visível, mas é habilitado apenas se houver uma alteração */}
                    <button
                      onClick={() => saveUserRole(user.id)}
                      disabled={!(modifiedUsers[user.id] && modifiedUsers[user.id] !== user.roles[0])} // Habilita o botão apenas se a role for alterada
                    >
                      Salvar
                    </button>
                  </td>
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
