import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Image, Badge, Card } from 'react-bootstrap';
import api from '../api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) return <div className="text-center p-5"><span className="spinner-border text-primary"></span></div>;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white py-3 border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Inventory Catalog</h5>
          <Badge bg="primary-light" className="text-primary px-3 py-2">{products.length} Products Total</Badge>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {products.length === 0 ? (
          <div className="text-center p-5 text-muted">No products found in the system.</div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 border-0">Product</th>
                  <th className="border-0">Category</th>
                  <th className="border-0">Price</th>
                  <th className="border-0">Stock</th>
                  <th className="border-0">Supplier</th>
                  <th className="text-end pe-4 border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-3 d-flex align-items-center justify-content-center"
                          style={{ width: '48px', height: '48px', background: '#f1f5f9' }}
                        >
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} className="rounded-3" width={48} height={48} fluid />
                          ) : (
                            <span className="fs-4">📦</span>
                          )}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{product.name}</div>
                          <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td><Badge bg="light" className="text-secondary border">{product.category || 'General'}</Badge></td>
                    <td><span className="fw-bold text-dark">₹{parseFloat(product.price).toFixed(2)}</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`fw-bold ${product.quantity < 10 ? 'text-danger' : 'text-success'}`}>{product.quantity}</span>
                        {product.quantity < 10 && <Badge bg="danger-light" className="text-danger small px-2">Low</Badge>}
                      </div>
                    </td>
                    <td className="text-muted small">{product.supplier || 'Not specified'}</td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-primary" size="sm" className="border-0"><span className="fs-6">✏️</span></Button>
                        <Button variant="outline-danger" size="sm" className="border-0" onClick={() => deleteProduct(product.id)}><span className="fs-6">🗑️</span></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductList;