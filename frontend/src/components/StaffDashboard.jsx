import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Nav, Table } from 'react-bootstrap';
import api from '../api';
import SaleForm from './SaleForm';
import ProductList from './ProductList';

const StaffDashboard = ({ onLogout }) => {
  const [refresh, setRefresh] = useState(0);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, [refresh]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sales');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => setRefresh(prev => prev + 1);

  const todaysSales = sales.filter(s =>
    new Date(s.saleDate).toLocaleDateString() === new Date().toLocaleDateString()
  );

  const todaysRevenue = todaysSales.reduce((sum, s) => sum + s.totalPrice, 0);

  if (loading && sales.length === 0) return <div className="text-center p-5 mt-5"><span className="spinner-border text-primary"></span></div>;

  return (
    <Container fluid className="py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-800 mb-1">Staff Portal</h2>
          <p className="text-muted small fw-600 mb-0">High-efficiency POS & Inventory</p>
        </div>
        <div className="d-flex gap-2">
          <Badge bg="primary-light" className="text-primary px-3 py-2 d-flex align-items-center">
            Today's Sales: {todaysSales.length}
          </Badge>
          <Badge bg="success-light" className="text-success px-3 py-2 d-flex align-items-center">
            Today's Rev: ₹{todaysRevenue.toFixed(2)}
          </Badge>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <div className="mb-4">
            <SaleForm onSaleMade={handleRefresh} />
          </div>

          <Card className="border-0 shadow-sm overflow-hidden">
            <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Recent Transactions</h6>
              <Button variant="link" size="sm" className="text-decoration-none fw-bold" onClick={handleRefresh}>Refresh</Button>
            </Card.Header>
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 border-0 small text-uppercase">ID</th>
                    <th className="border-0 small text-uppercase">Product</th>
                    <th className="border-0 small text-uppercase text-center">Qty</th>
                    <th className="border-0 small text-uppercase">Total</th>
                    <th className="text-end pe-4 border-0 small text-uppercase">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysSales.slice(0, 5).map(sale => (
                    <tr key={sale.id}>
                      <td className="ps-4 text-primary fw-bold">#{sale.id}</td>
                      <td className="fw-bold">{sale.product.name}</td>
                      <td className="text-center"><Badge bg="light" className="text-dark border">{sale.quantity}</Badge></td>
                      <td className="fw-bold text-success">₹{sale.totalPrice.toFixed(2)}</td>
                      <td className="text-end pe-4 text-muted small">
                        {new Date(sale.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                  {todaysSales.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-muted small">No transactions processed today yet.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 mb-4 bg-primary text-white position-relative overflow-hidden">
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '100px', opacity: 0.1 }}>🧾</div>
            <h6 className="fw-bold mb-3">Quick Actions</h6>
            <div className="d-grid gap-2">
              <Button variant="light" className="text-primary fw-bold text-start p-3 border-0">
                <span>📑</span> Generate Report
              </Button>
              <Button variant="light" className="text-primary fw-bold text-start p-3 border-0">
                <span>📞</span> Support Request
              </Button>
            </div>
          </Card>

          <Card className="border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-3">System Status</h6>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-circle bg-success" style={{ width: '12px', height: '12px' }}></div>
              <span className="small fw-600">Inventory Sync Active</span>
            </div>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-circle bg-success" style={{ width: '12px', height: '12px' }}></div>
              <span className="small fw-600">Database Connection Stable</span>
            </div>
            <hr />
            <div className="text-muted small fw-600">
              Session expires in: <span className="text-primary">23h 45m</span>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StaffDashboard;