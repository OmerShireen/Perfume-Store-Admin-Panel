import React, { useState } from 'react';
import axios from 'axios';

export default function AddProduct() {
  const [formData, setFormData] = useState({ title: '', description: '', image_url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.image_url.match(/^(http|https):\/\/[^\s$.?#].[^\s]*$/)) {
      setError('Please enter a valid URL');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/products', formData);
      setSuccess(response.data.message);
      setFormData({ title: '', description: '', image_url: '' }); // Reset form
    } catch (err) {
      console.error('Error adding product:', err.message);
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          name="image_url"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
}
