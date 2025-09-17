'use client';

import { useState, useEffect, useMemo } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductGrid from '../components/ProductGrid';

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null); // currently selected campaign

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activePriceRange, setActivePriceRange] = useState(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch campaigns
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

  // Apply campaign discount first
  const discountedProducts = useMemo(() => {
    if (!activeCampaign) return allProducts;

    return allProducts.map(product => {
      const isInCampaign = activeCampaign.products?.includes(product.sku);
      if (isInCampaign) {
        let discountPrice = product.price;
        if (activeCampaign.discountType === 'percentage') {
          discountPrice = product.price * (1 - activeCampaign.discountValue / 100);
        } else if (activeCampaign.discountType === 'fixed') {
          discountPrice = product.price - activeCampaign.discountValue;
        }
        discountPrice = Math.max(discountPrice, 0);
        return { ...product, discountedPrice: discountPrice };
      }
      return product;
    });
  }, [allProducts, activeCampaign]);

  // Filter discounted products
  const filteredProducts = useMemo(() => {
    let temp = [...discountedProducts];

    if (searchQuery) {
      temp = temp.filter(p =>
        p.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      temp = temp.filter(p => selectedCategories.includes(p.category));
    }

    if (activePriceRange) {
      temp = temp.filter(p => {
        const price = p.discountedPrice ?? p.price; // use discountedPrice if exists
        return price >= activePriceRange.min && price <= activePriceRange.max;
      });
    }

    return temp;
  }, [discountedProducts, searchQuery, selectedCategories, activePriceRange]);

  // Derive categories
  const categories = useMemo(() => {
    if (allProducts.length === 0) return [];
    return [...new Set(allProducts.map(p => p.category).filter(Boolean))];
  }, [allProducts]);

  return (
    <div className="bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Discover Our Collection</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Find the perfect item from our curated selection of high-quality products.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            setActivePriceRange={setActivePriceRange}
            activePriceRange={activePriceRange}
          />

          <div className="lg:w-3/4">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </main>
    </div>
  );
}
