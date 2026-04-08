import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTopProducts } from '../hooks/useAnalytics';

export default function MostPurchasedProductsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useTopProducts('MONTHLY', 20);

  const formatCurrency = (amount: number) => {
    return `NGN ${amount.toLocaleString()}`;
  };

  const getProductInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Failed to load products data. Please try again.</p>
      </div>
    );
  }

  const products = data?.products ?? [];

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
              key={product.productId}
              className={`flex items-center gap-6 p-6 ${
                index !== products.length - 1 ? 'border-b border-gray-100' : ''
              } hover:bg-gray-50 transition-colors`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-12 text-center">
                <span className="text-lg font-bold text-primary">#{product.rank}</span>
              </div>

              {/* Product Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {getProductInitial(product.productName)}
                  </span>
                </div>
              </div>

              {/* Product Name */}
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">{product.productName}</h3>
                <p className="text-sm text-gray-500">{product.unitsSold} units sold</p>
              </div>

              {/* Revenue */}
              <div className="flex-shrink-0 w-40">
                <p className="text-base font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
              </div>

              {/* Orders Count */}
              <div className="flex-shrink-0 w-48">
                <p className="text-sm text-gray-600">{product.ordersCount} Orders</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
