import { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [status, setStatus] = useState("TO_DO");
  const [urgency, setUrgency] = useState("LOW");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Cargar datos de la tarea
  useEffect(() => {
    if (!token) {
      setError("Authentication required.");
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8080/api/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load task");
        return res.json();
      })
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setDateEnd(data.dateEnd ? data.dateEnd.substring(0, 16) : "");
        setStatus(data.status);
        setUrgency(data.urgency);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [taskId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Authentication required.");
      return;
    }

    const payload = {
      title,
      description,
      dateEnd,
      status,
      urgency,
    };

    try {
      const res = await fetch(`https://taskboard-koyv.onrender.com/api/task/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("Task updated successfully!");
        setError(null);
        // Redirigir a la lista de tareas
        setTimeout(() => navigate("/tasks"), 1000);
      } else {
        const errText = await res.text();
        setError(errText || "Failed to update task");
        setMessage(null);
      }
    } catch (err) {
      setError("Network error");
      setMessage(null);
    }
  };

  if (loading)
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p>Loading task...</p>
      </Container>
    );

  return (
    <Container style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <h2>Edit Task</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDateEnd">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="datetime-local"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formStatus">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUrgency">
          <Form.Label>Urgency</Form.Label>
          <Form.Select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            required
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}
