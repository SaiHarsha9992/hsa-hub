import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  // Determine if the product has a discount
  const hasDiscount = product.discountedPrice != null && product.discountedPrice < product.price;

  const getBadge = () => {
    if (!hasDiscount) return null;

    const baseClasses = "absolute top-3 left-3 text-xs font-bold text-white py-1 px-2.5 rounded-full";

    if (product.discountType === 'percentage') {
      return <div className={`${baseClasses} bg-blue-500`}>{product.discountValue}% OFF</div>;
    } else if (product.discountType === 'fixed') {
      return <div className={`${baseClasses} bg-red-500`}>₹{product.discountValue} OFF</div>;
    }

    return <div className={`${baseClasses} bg-green-500`}>SALE</div>;
  };

  return (
    <Link href={`/products/${product.sku}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
        <div className="relative">
          <Image
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.productName}
            width={400}
            height={400}
            className="w-full h-56 object-cover"
          />
          {getBadge()}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.productName}</h3>
          <div className="flex items-baseline gap-2 mt-2">
            {hasDiscount ? (
              <>
                <p className="text-xl font-bold text-red-600">₹{product.discountedPrice}</p>
                <p className="text-md text-gray-400 line-through">₹{product.price}</p>
              </>
            ) : (
              <p className="text-xl font-bold text-gray-800">₹{product.price}</p>
            )}
          </div>
          <div className="w-full mt-4 bg-orange-500 text-white font-semibold py-2 rounded-lg text-center">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
