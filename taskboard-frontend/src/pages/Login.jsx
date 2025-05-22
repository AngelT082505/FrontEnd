import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { usernameOrEmail, password };

    try {
      const res = await fetch("https://taskboard-koyv.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        login({ token: data.token, userId: data.userId, userRole: data.role });
        setMessage("Login successful!");
        setError(null);
        navigate("/tasks");
      } else {
        const errData = await res.text();
        setError(errData || "Login failed");
        setMessage(null);
      }
    } catch (err) {
      setError("Network error");
      setMessage(null);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h2 className="mb-4 text-center">Login</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsernameOrEmail">
            <Form.Label>Username or Email</Form.Label>
            <Form.Control
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
