'use client';

import { useState, useEffect } from 'react';

export default function ProductModal({ isOpen, onClose, onSave, product }) {
  const [formData, setFormData] = useState({
    sku: '',
    productName: '',
    price: '',
    imageUrl: ''
  });

  // This effect runs when the 'product' prop changes (i.e., when 'Edit' is clicked)
  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        productName: product.productName || '',
        price: product.price || '',
        imageUrl: product.imageUrl || ''
      });
    } else {
      // Reset form if we are adding a new product
      setFormData({ sku: '', productName: '', price: '', imageUrl: '' });
    }
  }, [product, isOpen]); // Rerun effect if the product or modal open state changes

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    // Modal Backdrop
    <div className="fixed inset-0 backdrop-blur-xl bg-opacity-50 z-50 flex justify-center items-center">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* SKU Field (read-only when editing) */}
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-600 mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                id="sku"
                value={formData.sku}
                readOnly // Use readOnly to ensure value is submitted, but not editable
                placeholder={product ? '' : 'Will be auto-generated on save'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            {/* Product Name Field */}
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
              <input
                type="text"
                name="productName"
                id="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* Price Field */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-1">Price</label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                step="0.01"
                required
              />
            </div>
            {/* Image URL Field */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-600 mb-1">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}