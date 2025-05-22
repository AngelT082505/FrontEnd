import { useEffect, useState, useContext } from "react";
import { Table, Button, Alert, Spinner, Container } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function AdminUserList() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://taskboard-koyv.onrender.com/api/admin/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setError(null);
      } else {
        const err = await res.text();
        setError(err || "Failed to load users");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (id, currentStatus) => {
    try {
      const res = await fetch(`https://taskboard-koyv.onrender.com/api/admin/user/${id}/block?active=${!currentStatus}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setActionMessage(await res.text());
        fetchUsers();
      } else {
        const err = await res.text();
        setError(err || "Failed to update user");
      }
    } catch {
      setError("Network error");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user and their tasks?")) return;
    try {
      const res = await fetch(`https://taskboard-koyv.onrender.com/api/admin/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setActionMessage(await res.text());
        fetchUsers();
      } else {
        const err = await res.text();
        setError(err || "Failed to delete user");
      }
    } catch {
      setError("Network error");
    }
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /><p>Loading users...</p></Container>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>User Management</h2>
      {actionMessage && <Alert variant="success" onClose={() => setActionMessage(null)} dismissible>{actionMessage}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role.name}</td>
              <td>{u.active ? "Active" : "Blocked"}</td>
              <td>
                <Button size="sm" variant={u.active ? "warning" : "success"} onClick={() => toggleBlockUser(u.id, u.active)}>
                  {u.active ? "Block" : "Unblock"}
                </Button>{" "}
                <Button size="sm" variant="danger" onClick={() => deleteUser(u.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
