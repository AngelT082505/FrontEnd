import { useState, useEffect, useContext } from "react";
import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import API_BASE_URL from "../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    if (!token) {
      setError("You must be logged in to view tasks.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/task`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTasks(data);
        setError(null);
      } else {
        const errText = await res.text();
        setError(errText || "Failed to fetch tasks.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Borrar tarea
  const handleDelete = async (taskId) => {
    if (!token) {
      setError("You must be logged in.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        const errText = await res.text();
        setError(errText || "Failed to delete task.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  // Navegar a edición
  const handleEdit = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  if (loading)
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p>Loading tasks...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (tasks.length === 0)
    return (
      <Container className="mt-4">
        <Alert variant="info">No tasks found.</Alert>
      </Container>
    );

  return (
    <Container className="mt-4" style={{ maxWidth: "900px" }}>
      <h2>Your Tasks</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Urgency</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status.replace("_", " ")}</td>
              <td>{task.urgency}</td>
              <td>{new Date(task.dateEnd).toLocaleString()}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(task.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                >
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
