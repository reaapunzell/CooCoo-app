import React, { useState } from 'react';

const ProductUpload = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price_per_unit: '',
    available_quantity: '',
    unit: '',
    discounted_price: '',
    image_url: '',
    delivery_information: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
        const token = local.storage.getItem('token');
      if (!token) { 
        throw new Error('User not authenticated. Please log in again.');
      }

      const res = await fetch('https://coocoo-app.onrender.com/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const firstError = Object.values(errorData.detail || {})[0]?.[0] || 'Error uploading product.';
        throw new Error(firstError);
      }

      setSuccess('Product uploaded successfully!');
      setProduct({
        name: '',
        description: '',
        price_per_unit: '',
        available_quantity: '',
        unit: '',
        discounted_price: '',
        image_url: '',
        delivery_information: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Upload a New Product</h2>
      <form onSubmit={handleSubmit}>
        {['name', 'description', 'price_per_unit', 'available_quantity', 'unit', 'discounted_price', 'image_url', 'delivery_information'].map((field) => (
          <div key={field} className="form-group">
            <label>{field.replace(/_/g, ' ')}:</label>
            <input
              type="text"
              name={field}
              value={product[field]}
              onChange={handleChange}
              required={['name', 'description', 'price_per_unit', 'available_quantity'].includes(field)}
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default ProductUpload;
