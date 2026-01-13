import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Product.module.css'; 

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({ title: '', price: '', image_url: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleSave = async (id) => {
    if (!formData.title || !formData.price || !formData.image_url) {
      alert('Please fill all fields before saving.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/products/${id}`, formData);
      setProducts(products.map((product) =>
        product.id === id ? response.data : product
      ));
      setEditProduct(null);
      setFormData({ title: '', price: '', image_url: '' });
    } catch (error) {
      console.error('Error updating product:', error.message);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error.message);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product.id);
    setFormData({ title: product.title, price: product.price, image_url: product.image_url });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={styles.productContainer}>
      {products.map((product) => (
        <div key={product.id} className={styles.product}>
          <img src={product.image_url} alt={product.title} className={styles.productImage} />
          {editProduct === product.id ? (
            <div>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
              />
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Image URL"
              />
              <button onClick={() => handleSave(product.id)}>Save</button>
              <button onClick={() => setEditProduct(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <h3>{product.title}</h3>
              <p><strong>Price:</strong> Rs.{product.price}</p>
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
