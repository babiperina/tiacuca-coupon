import { useEffect, useState } from "react";
import axios from "axios";
import './RoleManager.css'; // Importa o arquivo CSS externo

function RoleManager() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modifiedUsers, setModifiedUsers] = useState({});

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
        console.log(response.data[0]._id);
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

  const handleRoleChange = (userId, newRole) => {
    // Log do ID do usuário e do novo papel
    console.log("Alterando role do usuário:", userId, "para:", newRole);

    setUsers((prevUsers) => {
      // Log da lista de usuários antes da alteração
      console.log("Lista de usuários antes da alteração:", prevUsers);
      
      const updatedUsers = prevUsers.map((user) =>
        user._id === userId ? { ...user, newRole } : user
      );

      // Log da lista de usuários depois da alteração
      console.log("Lista de usuários após a alteração:", updatedUsers);

      return updatedUsers;
    });

    setModifiedUsers((prevModifiedUsers) => {
      // Log das modificações anteriores
      console.log("Usuários modificados anteriormente:", prevModifiedUsers);

      const updatedModifiedUsers = {
        ...prevModifiedUsers,
        [userId]: newRole,
      };

      // Log das modificações após a alteração
      console.log("Usuários modificados após a alteração:", updatedModifiedUsers);

      return updatedModifiedUsers;
    });
  };

  const saveUserRole = async (userId) => {
    const newRole = modifiedUsers[userId];
    const authToken = localStorage.getItem("token");


    try {
      const response = await axios.put(
        `https://tiacuca-discount.onrender.com/api/users/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Role atualizada com sucesso!");
        setModifiedUsers((prevModifiedUsers) => {
          const { [userId]: _, ...remainingUsers } = prevModifiedUsers;
          return remainingUsers;
        });
      }
    } catch (error) {
      console.error("Erro ao salvar a role:", error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/#';
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
      <div className="header">
        <h1 className="title">Lista de Usuários</h1>
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
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
              <tr key={user._id}>
                <td>{user.telefone}</td>
                <td>
                  <select
                    value={user.newRole || user.roles[0]}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
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
                  <button
                    onClick={() => saveUserRole(user._id)}
                    disabled={!(modifiedUsers[user._id] && modifiedUsers[user._id] !== user.roles[0])}
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
  );
}

export default RoleManager;
