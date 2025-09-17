'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductSelector({ allProducts, selectedProducts, setSelectedProducts }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredProducts = allProducts.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleProduct = (sku) => {
    if (selectedProducts.includes(sku)) {
      setSelectedProducts(selectedProducts.filter(s => s !== sku));
    } else {
      setSelectedProducts([...selectedProducts, sku]);
    }
  };

  return (
    <>
      {/* Open Modal Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Add Products
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Products</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700 font-bold">
                ✕
              </button>
            </div>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 p-2 border rounded-md"
            />

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <label
                  key={product.sku}
                  className="flex flex-col items-center border p-2 rounded cursor-pointer hover:bg-gray-100"
                >
                  <div className="w-full aspect-square relative mb-2">
                    <Image
                      src={product.imageUrl || '/placeholder.png'} // fallback placeholder
                      alt={product.productName}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.sku)}
                      onChange={() => toggleProduct(product.sku)}
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700">{product.productName}</span>
                  </div>
                </label>
              ))}
              {filteredProducts.length === 0 && (
                <p className="col-span-full text-gray-500 text-sm text-center">No products found.</p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end mt-6 gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
