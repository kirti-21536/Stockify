import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav, Tab, Tabs, Table, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import SaleForm from './SaleForm';

const AdminDashboardNew = ({ onLogout }) => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchSales();
    fetchProducts();
    fetchLowStock();
  }, [refresh]);

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/sales', {
        auth: {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password')
        }
      });
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products', {
        auth: {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password')
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchLowStock = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products', {
        auth: {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password')
        }
      });
      const low = response.data.filter(product => product.quantity < 10);
      setLowStock(low);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleRefresh = () => {
    setRefresh(refresh + 1);
  };

  const downloadPdf = async (saleId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/sales/${saleId}/pdf`, {
        auth: {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password')
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${saleId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalInventoryValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const avgSaleValue = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : 0;

  const adminFeatures = [
    { icon: '📊', title: 'Sales Analytics', desc: 'View detailed sales reports and trends' },
    { icon: '📦', title: 'Inventory Control', desc: 'Manage stock, pricing & categories' },
    { icon: '👥', title: 'Staff Management', desc: 'Create & manage user accounts' },
    { icon: '💰', title: 'Pricing & Margins', desc: 'Set prices and track profit margins' },
    { icon: '🧾', title: 'Invoice Management', desc: 'Generate & download receipts' },
    { icon: '⚙️', title: 'System Settings', desc: 'Configure business parameters' }
  ];

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand style={{ fontSize: '20px', fontWeight: '700' }}>
            👑 Stockify - Admin Dashboard
          </Navbar.Brand>
          <Nav className="ms-auto">
            <span style={{ color: 'white', marginRight: '1rem', alignSelf: 'center' }}>
              Welcome, {localStorage.getItem('username')}!
            </span>
            <Button variant="outline-light" onClick={onLogout}>🚪 Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="px-4">
        <Row className="mb-4">
          <Col>
            <h2 style={{ fontWeight: '700', marginBottom: '2rem' }}>📊 Business Overview</h2>
          </Col>
        </Row>

        {/* Key Metrics */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center" style={{ borderWidth: '2px', borderColor: '#667eea' }}>
              <Card.Body style={{ padding: '2rem' }}>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📈</div>
                <Card.Title style={{ fontSize: '14px', color: '#718096' }}>Total Sales</Card.Title>
                <h3 style={{ color: '#667eea', fontWeight: '700' }}>{sales.length}</h3>
                <small style={{ color: '#718096' }}>transactions</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center" style={{ borderWidth: '2px', borderColor: '#48bb78' }}>
              <Card.Body style={{ padding: '2rem' }}>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>💵</div>
                <Card.Title style={{ fontSize: '14px', color: '#718096' }}>Total Revenue</Card.Title>
                <h3 style={{ color: '#48bb78', fontWeight: '700' }}>₹{totalRevenue.toFixed(2)}</h3>
                <small style={{ color: '#718096' }}>collected</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center" style={{ borderWidth: '2px', borderColor: '#f6ad55' }}>
              <Card.Body style={{ padding: '2rem' }}>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📦</div>
                <Card.Title style={{ fontSize: '14px', color: '#718096' }}>Avg Sale Value</Card.Title>
                <h3 style={{ color: '#f6ad55', fontWeight: '700' }}>₹{avgSaleValue}</h3>
                <small style={{ color: '#718096' }}>per transaction</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center" style={{ borderWidth: '2px', borderColor: '#ed8936' }}>
              <Card.Body style={{ padding: '2rem' }}>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>💎</div>
                <Card.Title style={{ fontSize: '14px', color: '#718096' }}>Inventory Value</Card.Title>
                <h3 style={{ color: '#ed8936', fontWeight: '700' }}>₹{totalInventoryValue.toFixed(2)}</h3>
                <small style={{ color: '#718096' }}>stock worth</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <Row className="mb-4">
            <Col>
              <Alert variant="warning" style={{ borderWidth: '2px' }}>
                <Alert.Heading>🔔 Low Stock Alert ({lowStock.length} items)</Alert.Heading>
                <hr />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {lowStock.map(product => (
                    <Card key={product.id} style={{ borderColor: '#f6ad55' }}>
                      <Card.Body style={{ padding: '1rem' }}>
                        <Card.Title style={{ fontSize: '14px' }}>{product.name}</Card.Title>
                        <div>
                          <Badge bg="warning" style={{ marginRight: '0.5rem' }}>
                            Stock: {product.quantity}
                          </Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Admin Features Showcase */}
        <Row className="mb-4">
          <Col>
            <h4 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>👑 Your Admin Capabilities</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {adminFeatures.map((feature, idx) => (
                <Card key={idx} style={{ border: '1px solid #e2e8f0', backgroundColor: '#f7fafc' }}>
                  <Card.Body style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '0.5rem' }}>{feature.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>
                      {feature.title}
                    </div>
                    <small style={{ color: '#718096' }}>{feature.desc}</small>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>

        {/* Main Tabs */}
        <Row>
          <Col>
            <Tabs defaultActiveKey="products" className="mb-4" style={{ borderBottom: '2px solid #e2e8f0' }}>
              <Tab eventKey="products" title="📦 Inventory Management">
                <Card>
                  <Card.Body>
                    <AddProduct onProductAdded={handleRefresh} />
                    <hr style={{ margin: '2rem 0' }} />
                    <ProductList key={refresh} />
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="sales" title="💰 Process Sale">
                <Card>
                  <Card.Body>
                    <SaleForm onSaleMade={handleRefresh} />
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="reports" title="📊 Sales Reports">
                <Card>
                  <Card.Body>
                    <h5 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>📋 Complete Sales History</h5>
                    {sales.length === 0 ? (
                      <Alert variant="info">No sales recorded yet. Start processing sales to see reports here.</Alert>
                    ) : (
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr style={{ backgroundColor: '#f7fafc' }}>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Tax</th>
                            <th>Discount</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sales.map(sale => (
                            <tr key={sale.id}>
                              <td><strong>#{sale.id}</strong></td>
                              <td>{sale.product.name}</td>
                              <td><Badge bg="info">{sale.quantity}</Badge></td>
                              <td>₹{sale.unitPrice?.toFixed(2) || 'N/A'}</td>
                              <td>₹{sale.tax?.toFixed(2) || '0.00'}</td>
                              <td>{sale.discount ? `${sale.discount}%` : '0%'}</td>
                              <td><strong style={{ color: '#48bb78' }}>₹{sale.totalPrice.toFixed(2)}</strong></td>
                              <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                              <td>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => downloadPdf(sale.id)}
                                  style={{ fontSize: '11px' }}
                                >
                                  📥 PDF
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="settings" title="⚙️ Settings">
                <Card>
                  <Card.Body>
                    <h5 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>🔧 System Settings</h5>
                    <Alert variant="info">
                      <strong>Coming Soon:</strong> Configure business settings, tax rates, staff permissions, and more.
                    </Alert>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                      <Card style={{ backgroundColor: '#f7fafc', borderColor: '#667eea' }}>
                        <Card.Body>
                          <h6 style={{ fontWeight: '700' }}>⚙️ General Settings</h6>
                          <ul style={{ fontSize: '13px', color: '#718096' }}>
                            <li>💼 Shop Name & Address</li>
                            <li>🏪 Shop Hours</li>
                            <li>📍 Location Map</li>
                            <li>☎️ Contact Details</li>
                          </ul>
                        </Card.Body>
                      </Card>
                      <Card style={{ backgroundColor: '#f7fafc', borderColor: '#667eea' }}>
                        <Card.Body>
                          <h6 style={{ fontWeight: '700' }}>💰 Financial Settings</h6>
                          <ul style={{ fontSize: '13px', color: '#718096' }}>
                            <li>📊 Tax Configuration</li>
                            <li>💵 Currency Settings</li>
                            <li>📈 Profit Margin Targets</li>
                            <li>💳 Payment Methods</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboardNew;
