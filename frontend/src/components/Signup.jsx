import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STAFF');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/auth/register', { username, password, role });
      setMessage('✓ Account created successfully! Redirecting to login...');
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed. Username might already exist.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card border-0 shadow-premium animate-fade-in" style={{ maxWidth: '600px' }}>
        <Card.Body className="p-0">
          <div className="auth-logo">Stockify</div>
          <p className="auth-subtitle">Join the professional management network</p>

          {message && (
            <Alert variant={isSuccess ? 'success' : 'danger'} className="border-0 shadow-sm mb-4">
              <span className="me-2">{isSuccess ? '✅' : '⚠️'}</span>{message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-uppercase letter-spacing-1 text-muted">Choose Username</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">👤</span>
                    <Form.Control
                      className="border-start-0 ps-0"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-uppercase letter-spacing-1 text-muted">Create Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">🔒</span>
                    <Form.Control
                      className="border-start-0 ps-0"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-uppercase letter-spacing-1 text-muted">Assign Role</Form.Label>
                  <Row className="g-3">
                    <Col xs={6}>
                      <div
                        className={`p-3 border rounded-3 text-center cursor-pointer transition-all ${role === 'STAFF' ? 'bg-primary-light border-primary' : 'bg-light'}`}
                        onClick={() => setRole('STAFF')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="fs-3 mb-1">👨‍💼</div>
                        <div className={`fw-bold small ${role === 'STAFF' ? 'text-primary' : 'text-muted'}`}>STAFF</div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div
                        className={`p-3 border rounded-3 text-center cursor-pointer transition-all ${role === 'ADMIN' ? 'bg-primary-light border-primary' : 'bg-light'}`}
                        onClick={() => setRole('ADMIN')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="fs-3 mb-1">👑</div>
                        <div className={`fw-bold small ${role === 'ADMIN' ? 'text-primary' : 'text-muted'}`}>ADMIN</div>
                      </div>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <Button
              type="submit"
              className="w-100 btn-primary py-3 fw-bold shadow-sm"
              disabled={loading || isSuccess}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Creating Account...</>
              ) : (
                'Create My Account'
              )}
            </Button>
          </Form>

          <div className="text-center mt-4 pt-4 border-top border-light">
            <span className="text-muted small">Already have an account? </span>
            <Link to="/login" className="text-primary fw-bold small text-decoration-none">Sign In</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signup;