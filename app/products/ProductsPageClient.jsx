'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterSidebar from '../components/FilterSidebar';
import ProductGrid from '../components/ProductGrid';

export default function ProductsPageClient() {
  const [allProducts, setAllProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);

  const searchParams = useSearchParams();
  const campaignName = searchParams?.get('campaign'); // optional chaining

  // Fetch products
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(console.error);
  }, []);

  // Fetch campaigns
  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => {
        setCampaigns(data);
        if (campaignName) {
          const campaign = data.find(
            c => c.name.toLowerCase() === campaignName.toLowerCase()
          );
          if (campaign) setActiveCampaign(campaign);
        }
      })
      .catch(console.error);
  }, [campaignName]);

  // Apply campaign discount only
  const discountedProducts = useMemo(() => {
    if (!activeCampaign) return allProducts;

    return allProducts
      .filter(p => activeCampaign.products?.includes(p.sku))
      .map(p => {
        let discountPrice = p.price;
        if (activeCampaign.discountType === 'percentage') {
          discountPrice = p.price * (1 - activeCampaign.discountValue / 100);
        } else if (activeCampaign.discountType === 'fixed') {
          discountPrice = p.price - activeCampaign.discountValue;
        }
        return { ...p, discountedPrice: Math.max(discountPrice, 0) };
      });
  }, [allProducts, activeCampaign]);

  return (
    <div className="bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {activeCampaign ? `${activeCampaign.name} Offers` : 'Discover Our Collection'}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            {activeCampaign
              ? activeCampaign.description || 'Exclusive discounts on selected products!'
              : 'Find the perfect item from our curated selection of high-quality products.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            searchQuery=""
            setSearchQuery={() => {}}
            categories={[]}
            selectedCategories={[]}
            setSelectedCategories={() => {}}
            setActivePriceRange={() => {}}
            activePriceRange={null}
          />
          <div className="lg:w-3/4">
            <ProductGrid products={discountedProducts} />
          </div>
        </div>
      </main>
    </div>
  );
}
