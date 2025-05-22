import { useState, useContext } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function CreateTask() {
  const { token, userId } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [status, setStatus] = useState("TO_DO");
  const [urgency, setUrgency] = useState("LOW");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !userId) {
      setError("You must be logged in to create tasks.");
      return;
    }

    const payload = {
      title,
      description,
      dateEnd: dateEnd,
      status,
      urgency,
      // Si tu backend no necesita user_id en body, quítalo
      user_id: userId,
    };

    try {
      const res = await fetch("https://taskboard-koyv.onrender.com/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("Task created successfully!");
        setError(null);
        setTitle("");
        setDescription("");
        setDateEnd("");
        setStatus("TO_DO");
        setUrgency("LOW");
      } else {
        const errData = await res.text();
        setError(errData || "Failed to create task");
        setMessage(null);
      }
    } catch (err) {
      setError("Network error");
      setMessage(null);
    }
  };

  return (
    <Container style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <h2>Create Task</h2>
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
          Create Task
        </Button>
      </Form>
    </Container>
  );
}
