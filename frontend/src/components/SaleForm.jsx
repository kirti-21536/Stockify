import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert, ListGroup, Badge } from 'react-bootstrap';
import api from '../api';

const SaleForm = ({ onSaleMade }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError('Please select a product first.');
      return;
    }
    if (quantity > selectedProduct.quantity) {
      setError(`Insufficient stock. Only ${selectedProduct.quantity} available.`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/sales', null, {
        params: {
          productId: selectedProduct.id,
          quantity: parseInt(quantity),
          discount: parseFloat(discount)
        }
      });
      setSelectedProduct(null);
      setSearchTerm('');
      setQuantity(1);
      setDiscount(0);
      onSaleMade();
      fetchProducts(); // Refresh local product data for stock updates
    } catch (err) {
      setError('Failed to process sale. Please try again.');
      console.error('Error making sale:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time calculations
  const unitPrice = selectedProduct?.price || 0;
  const subtotal = unitPrice * quantity;
  const discountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.1; // 10% tax
  const total = taxableAmount + tax;

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <Card.Header className="bg-white py-3 border-0">
        <h5 className="mb-0 fw-bold text-primary">🛍️ POS Checkout</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger" className="border-0 small py-2 mb-3">{error}</Alert>}

        <Row className="g-4">
          <Col md={7}>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted text-uppercase">Search Product</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type product name or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (!e.target.value) setSelectedProduct(null);
                }}
              />

              {searchTerm && !selectedProduct && (
                <ListGroup className="position-absolute w-100 shadow-lg z-index-1000 mt-1">
                  {filteredProducts.slice(0, 5).map(product => (
                    <ListGroup.Item
                      key={product.id}
                      action
                      onClick={() => {
                        setSelectedProduct(product);
                        setSearchTerm(product.name);
                      }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-bold">{product.name}</div>
                        <small className="text-muted">{product.category}</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-primary">₹{product.price}</div>
                        <Badge bg={product.quantity < 10 ? 'danger' : 'success'} className="small">
                          {product.quantity} in stock
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                  {filteredProducts.length === 0 && (
                    <ListGroup.Item className="text-muted small">No products found.</ListGroup.Item>
                  )}
                </ListGroup>
              )}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted text-uppercase">Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={!selectedProduct}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted text-uppercase">Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    disabled={!selectedProduct}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>

          <Col md={5}>
            <div className="bg-light p-4 rounded-4 h-100 d-flex flex-column">
              <h6 className="fw-bold mb-4">Summary</h6>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Discount ({discount}%)</span>
                <span className="text-danger">-₹{discountAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="text-muted">Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-auto py-2">
                <span className="h5 fw-bold mb-0">Total</span>
                <span className="h5 fw-bold mb-0 text-primary">₹{total.toFixed(2)}</span>
              </div>

              <Button
                variant="primary"
                className="w-100 py-3 fw-800 mt-4 shadow-sm border-0"
                onClick={handleSubmit}
                disabled={loading || !selectedProduct}
              >
                {loading ? 'Processing...' : 'Complete Sale'}
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SaleForm;