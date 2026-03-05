import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import api from '../api';

const AddProduct = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/products', {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category,
        supplier,
        imageUrl
      });
      setName('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setCategory('');
      setSupplier('');
      setImageUrl('');
      onProductAdded();
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-white py-3 border-0">
        <h5 className="mb-0 fw-bold">Add New Product</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase">Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Wireless Mouse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase">Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Electronics"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-muted text-uppercase">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Brief product description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase">Unit Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase">Initial Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted text-uppercase">Supplier</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Supplier Name"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-muted text-uppercase">Image URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" className="px-5 fw-bold" disabled={loading}>
              {loading ? 'Adding...' : 'Register Product'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddProduct;