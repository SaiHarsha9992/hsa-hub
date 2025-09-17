'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductInteractions from '@/app/components/ProductInteractions';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetailPage() {
  const params = useParams();
  const { sku } = params;
      const { user } = useAuth();
      const router = useRouter();
      if (!user) {
        router.push("/login");
      }
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${sku}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [sku]);

  if (loading) return <div className="text-center py-20">Loading product...</div>;
  if (error || !product)
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">
          &larr; Back to all products
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-800">{product.productName}</span>
        </div>

        {/* Main Product Content */}
        <ProductInteractions product={product} />
      </main>
    </div>
  );
}
