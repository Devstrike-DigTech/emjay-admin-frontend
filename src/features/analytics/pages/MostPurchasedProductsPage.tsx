import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PurchasedProduct {
  rank: number;
  name: string;
  imageUrl: string;
  price: number;
  purchaseDate: string;
}

const mockPurchasedProducts: PurchasedProduct[] = [
  {
    rank: 1,
    name: 'Sterling Bottle',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100',
    price: 1005000,
    purchaseDate: '10th March, 2025',
  },
  {
    rank: 2,
    name: 'Stonehead Perfume',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100',
    price: 15000,
    purchaseDate: '12th March, 2025',
  },
  {
    rank: 3,
    name: 'Makeup Kit',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100',
    price: 15000,
    purchaseDate: '13th March, 2025',
  },
  {
    rank: 4,
    name: 'Beard Oil',
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=100',
    price: 15000,
    purchaseDate: '14th March, 2025',
  },
  {
    rank: 5,
    name: 'Lipstick',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100',
    price: 15000,
    purchaseDate: '15th March, 2025',
  },
  {
    rank: 6,
    name: 'Toothpaste and ToothBrush',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=100',
    price: 15000,
    purchaseDate: '16th March, 2025',
  },
];

export default function MostPurchasedProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<PurchasedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockPurchasedProducts);
      setIsLoading(false);
    }, 500);
  }, []);

  const formatCurrency = (amount: number) => {
    return `NGN ${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Most Purchased Product</h1>
              <p className="text-gray-600 mt-1">Here's a List of your most purchased Items</p>
            </div>
            
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {products.map((product, index) => (
            <div
              key={product.rank}
              className={`flex items-center gap-6 p-6 ${
                index !== products.length - 1 ? 'border-b border-gray-100' : ''
              } hover:bg-gray-50 transition-colors`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-12 text-center">
                <span className="text-lg font-bold text-primary">#{product.rank}</span>
              </div>

              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>

              {/* Product Name */}
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
              </div>

              {/* Price */}
              <div className="flex-shrink-0 w-40">
                <p className="text-base font-bold text-gray-900">{formatCurrency(product.price)}</p>
              </div>

              {/* Purchase Date */}
              <div className="flex-shrink-0 w-48">
                <p className="text-sm text-gray-600">{product.purchaseDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}