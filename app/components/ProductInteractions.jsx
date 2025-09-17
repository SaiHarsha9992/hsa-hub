'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

export default function ProductInteractions({ product }) {
  // Image gallery state
  const [mainImage, setMainImage] = useState(product.imageUrl);

  // Quantity selector
  const [quantity, setQuantity] = useState(1);

  // Campaign state
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);

  // Fetch campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        setCampaigns(data);

        // Pick first active campaign
        const active = data.find(c => c.status === 'Active') || null;
        setActiveCampaign(active);
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
      }
    };
    fetchCampaigns();
  }, []);

  // Compute discounted price if product is part of active campaign
  const discountedPrice = useMemo(() => {
    if (!activeCampaign) return null;

    const isInCampaign = activeCampaign.products?.includes(product.sku);
    if (!isInCampaign) return null;

    let price = product.price;
    if (activeCampaign.discountType === 'percentage') {
      price = product.price * (1 - activeCampaign.discountValue / 100);
    } else if (activeCampaign.discountType === 'fixed') {
      price = product.price - activeCampaign.discountValue;
    }
    return Math.max(price, 0);
  }, [product, activeCampaign]);

  const handleAddToCart = () => {
    const priceToUse = discountedPrice ?? product.price;
    console.log(`Added ${quantity} of ${product.productName} at ₹${priceToUse} to cart.`);
    alert(`${quantity} x ${product.productName} added to cart!`);
  };
  console.log("Active Campaign in ProductInteractions:", activeCampaign);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Image Gallery */}
      <div className="flex flex-col gap-4 sticky top-28">
        <div className="aspect-square relative rounded-xl overflow-hidden shadow-lg">
          <Image
            src={mainImage}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      </div>

      {/* Product Details & Actions */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{product.productName}</h1>
        {activeCampaign && (
            <h2 className="text-2xl font-bold text-red-600">
            {activeCampaign.name} Offer
            </h2>
        )}
        <div className="flex items-center gap-3">
          {discountedPrice ? (
            <>
              <span className="text-3xl font-bold text-red-600">₹{discountedPrice}</span>
              <span className="text-gray-400 line-through text-xl">₹{product.price}</span>
              <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                {activeCampaign.discountType === 'percentage'
                  ? `${activeCampaign.discountValue}% OFF`
                  : `₹${activeCampaign.discountValue} OFF`}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-blue-600">₹{product.price}</span>
          )}
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">In Stock</span>
        </div>

        <p className="text-gray-600 leading-relaxed">{product.description || 'No description available for this product.'}</p>

        <div className="w-full h-px bg-gray-200 my-4"></div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-xl font-semibold text-gray-700">-</button>
            <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-xl font-semibold text-gray-700">+</button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
