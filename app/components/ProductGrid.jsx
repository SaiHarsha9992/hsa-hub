import ProductCard from '../components/ProductCard'; // We can reuse the card from the promotions page

export default function ProductGrid({ products }) {
  return (
    <div>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700">No Products Found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}