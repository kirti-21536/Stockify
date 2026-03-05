import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card border-0 shadow-premium animate-fade-in">
        <Card.Body className="p-0">
          <div className="auth-logo">Stockify</div>
          <p className="auth-subtitle">Professional Shop & Inventory Suite</p>

          {error && (
            <Alert variant="danger" className="border-0 shadow-sm mb-4">
              <span className="me-2">⚠️</span>{error}
            </Alert>
          )}

          <div className="p-3 mb-4 rounded-3" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <div className="d-flex align-items-center mb-1">
              <span className="text-primary fw-bold small me-2">🔐 DEMO ACCESS</span>
            </div>
            <div className="text-muted small">
              <div className="d-flex justify-content-between">
                <span>Admin: <strong>admin</strong> / admin</span>
                <span>Staff: <strong>staff</strong> / staff</span>
              </div>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-uppercase letter-spacing-1 text-muted">Username</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">👤</span>
                <Form.Control
                  className="border-start-0 ps-0"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-uppercase letter-spacing-1 text-muted">Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">🔒</span>
                <Form.Control
                  className="border-start-0 ps-0"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 btn-primary py-3 fw-bold shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Signing in...</>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </Form>

          <div className="text-center mt-4 pt-4 border-top border-light">
            <span className="text-muted small">Don't have an account? </span>
            <Link to="/signup" className="text-primary fw-bold small text-decoration-none">Create Account</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;