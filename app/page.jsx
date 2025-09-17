"use client";

import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { useRouter } from "next/navigation";

const Footer = () => (
  <footer className="backdrop-blur-md bg-white/30 mt-16 border-t border-white/20">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-600">
      &copy; 2025 Promotional Retail Hub. All rights reserved.
    </div>
  </footer>
);

export default function PromotionsPage() {
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      console.log("Fetched campaigns:", data); // <--- check what fields exist
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCampaigns();
}, []);


  // Handle clicking a campaign poster
  const handleCampaignClick = (campaignSlug) => {
    // Pass the campaign slug to the products page
    router.push(`/products`);
  };

  // Only show first 6 products in featured section
  const featuredProducts = products.slice(0, 6);

  // Optional: pick first active campaign as current festive offer
  const currentCampaign = campaigns.find(c => c.status === "Active");

  console.log("Current Campaign:", currentCampaign);

  // Sort products by latest first and take only top 6
const latestProducts = [...products]
  .sort((a, b) => new Date(b.createdAt || b.addedDate || Date.now()) - new Date(a.createdAt || a.addedDate || Date.now()))
  .slice(0, 6);

  return (
    <div className="bg-white min-h-screen text-white flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Festive Campaign Poster */}
        {currentCampaign && (
          <div
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-2xl p-12 mb-12 text-center cursor-pointer relative overflow-hidden hover:scale-105 transition-transform"
            onClick={() => handleCampaignClick(currentCampaign.name)}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              🎉 {currentCampaign.name} 🎉
            </h1>
            <p className="text-lg md:text-xl mb-6 text-white">
              {currentCampaign.description || "Enjoy exclusive discounts on selected products!"}
            </p>
            <span className="inline-block bg-white text-red-600 font-bold py-3 px-10 rounded-full shadow-xl hover:bg-gray-100 transition-colors">
              Shop Now
            </span>
          </div>
        )}

        {/* Featured Products Section */}
        <div>
          <h2 className="text-3xl font-bold text-black mb-8">
            Featured Products
          </h2>

{loading ? (
  <p className="text-gray-400">Loading products...</p>
) : latestProducts.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {latestProducts.map((product) => (
      <div
        key={product.sku}
        className="bg-gray-400 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:scale-[1.02] transition-transform"
      >
        <ProductCard product={product} />
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-400">No products found.</p>
)}

        </div>
      </main>

      <Footer />
    </div>
  );
}
