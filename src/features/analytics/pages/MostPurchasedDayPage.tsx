import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSalesByDay } from '../hooks/useAnalytics';

export default function MostPurchasedDayPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSalesByDay();

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

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Failed to load sales data. Please try again.</p>
      </div>
    );
  }

  // Sort by totalSales descending and assign rank from sort order
  const daySales = [...(data ?? [])]
    .sort((a, b) => b.totalSales - a.totalSales)
    .map((item, index) => ({
      rank: index + 1,
      day: item.dayName,
      totalSales: item.totalSales,
      unitsSold: item.unitsSold,
    }));

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

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Most Purchased Day</h1>
            <p className="text-gray-600 mt-1">Here's a list the most purchased days of the week</p>
          </div>
        </div>

        {/* Days List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {daySales.map((daySale, index) => (
            <div
              key={index}
              className={`flex items-center gap-8 p-6 ${
                index !== daySales.length - 1 ? 'border-b border-gray-100' : ''
              } hover:bg-gray-50 transition-colors`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-12 text-center">
                <span className="text-lg font-bold text-primary">#{daySale.rank}</span>
              </div>

              {/* Day Name */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{daySale.day}</h3>
              </div>

              {/* Total Sales */}
              <div className="flex-shrink-0 w-48">
                <p className="text-lg font-bold text-primary">{formatCurrency(daySale.totalSales)}</p>
              </div>

              {/* Units Sold */}
              <div className="flex-shrink-0 w-48">
                <p className="text-sm text-gray-600">{daySale.unitsSold} Units Sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
