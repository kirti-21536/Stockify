import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Table, Badge, Alert } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import api from '../api';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import SaleForm from './SaleForm';

const AdminDashboard = ({ onLogout }) => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesRes, productsRes] = await Promise.all([
        api.get('/sales'),
        api.get('/products')
      ]);
      setSales(salesRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const response = await api.get(`/sales/${id}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const handleRefresh = () => setRefresh(prev => prev + 1);

  if (loading) return <div className="text-center p-5 mt-5"><span className="spinner-border text-primary"></span></div>;

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const lowStockItems = products.filter(p => p.quantity < 10);

  // Data for Charts
  const chartData = sales.reduce((acc, sale) => {
    const date = new Date(sale.saleDate).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.revenue += sale.totalPrice;
    } else {
      acc.push({ date, revenue: sale.totalPrice });
    }
    return acc;
  }, []).slice(-7);

  const categoryData = products.reduce((acc, p) => {
    const cat = p.category || 'General';
    const existing = acc.find(item => item.name === cat);
    if (existing) {
      existing.value += p.quantity;
    } else {
      acc.push({ name: cat, value: p.quantity });
    }
    return acc;
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  if (loading) return <div className="text-center p-5 mt-5"><span className="spinner-border text-primary"></span></div>;

  return (
    <Container fluid className="py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-800 mb-1">Admin Dashboard</h2>
          <p className="text-muted small fw-600 mb-0">Overview of your retail performance</p>
        </div>
        <Button variant="primary" onClick={handleRefresh} className="shadow-sm">🔄 Refresh Data</Button>
      </div>

      {/* Analytics Stats */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="stat-card border-0">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value text-primary">₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="text-success small fw-bold">↑ 12% from last month</div>
            <span className="stat-icon">💰</span>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card border-0">
            <div className="stat-label">Total Sales</div>
            <div className="stat-value">{sales.length}</div>
            <div className="text-primary small fw-bold">Live transactions</div>
            <span className="stat-icon">📈</span>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card border-0">
            <div className="stat-label">Inventory Size</div>
            <div className="stat-value">{products.length}</div>
            <div className="text-muted small fw-bold">Total unique SKUs</div>
            <span className="stat-icon">📦</span>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card border-0">
            <div className="stat-label">Low Stock</div>
            <div className="stat-value text-danger">{lowStockItems.length}</div>
            <div className="text-danger small fw-bold">Needs immediate attention</div>
            <span className="stat-icon">⚠️</span>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <h6 className="fw-bold mb-4">Revenue Trend (Last 7 Days)</h6>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <h6 className="fw-bold mb-4">Stock Distribution</h6>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="inventory" className="mb-4 custom-tabs">
        <Tab eventKey="inventory" title="📦 Inventory">
          <Row className="g-4">
            <Col xl={4}>
              <AddProduct onProductAdded={handleRefresh} />
              {lowStockItems.length > 0 && (
                <Card className="border-0 shadow-sm p-4 bg-danger-light mt-4">
                  <h6 className="fw-bold text-danger mb-3">🔔 Low Stock Items</h6>
                  {lowStockItems.map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded-3 shadow-sm">
                      <span className="small fw-bold">{item.name}</span>
                      <Badge bg="danger">{item.quantity} left</Badge>
                    </div>
                  ))}
                </Card>
              )}
            </Col>
            <Col xl={8}>
              <ProductList key={refresh} />
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="sales" title="💰 Sales Reports">
          <Card className="border-0 shadow-sm p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 border-0">Reference</th>
                    <th className="border-0">Product</th>
                    <th className="border-0">Quantity</th>
                    <th className="border-0">Total Price</th>
                    <th className="border-0">Date</th>
                    <th className="text-end pe-4 border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale.id}>
                      <td className="ps-4 fw-bold text-primary">#{sale.id}</td>
                      <td className="fw-bold text-dark">{sale.product.name}</td>
                      <td><Badge bg="light" className="text-dark border">{sale.quantity}</Badge></td>
                      <td className="fw-bold text-success">₹{sale.totalPrice.toFixed(2)}</td>
                      <td className="small text-muted">{new Date(sale.saleDate).toLocaleDateString()}</td>
                      <td className="text-end pe-4">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="border-0 fw-bold"
                          onClick={() => downloadInvoice(sale.id)}
                        >📄 PDF</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Tab>
        <Tab eventKey="pos" title="🛒 POS">
          <SaleForm onSaleMade={handleRefresh} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;