import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSalesSummary, useSalesTrend } from '../hooks/useAnalytics';

// Compute year-to-date date range (YYYY-MM-DD strings)
function currentYearRange(): [string, string] {
  const today = new Date();
  return [`${today.getFullYear()}-01-01`, today.toISOString().split('T')[0]];
}

export default function TotalSalesPage() {
  const navigate = useNavigate();
  const [startDate, endDate] = currentYearRange();
  const { data: summary, isLoading: summaryLoading, isError: summaryError } = useSalesSummary(startDate, endDate);
  const { data: trend, isLoading: trendLoading, isError: trendError } = useSalesTrend('DAILY', 30);

  const isLoading = summaryLoading || trendLoading;
  const isError = summaryError || trendError;

  const formatCurrency = (amount: number) => {
    return `NGN ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-NG', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
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

  const trendRows = trend ?? [];

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
              <h1 className="text-2xl font-bold text-gray-900">Total Sales</h1>
              <p className="text-gray-600 mt-1">Monthly summary and recent daily trend</p>
            </div>

            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalOrders.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {summary.completionRate.toFixed(1)}% completion &middot; {summary.cancellationRate.toFixed(1)}% cancellation
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.averageOrderValue)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {summary.completionRate.toFixed(1)}% completion rate
              </p>
            </div>
          </div>
        )}

        {/* Daily Trend Table */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">Daily Trend (Last 30 Days)</h3>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {trendRows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(row.periodDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(row.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.completedOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatCurrency(row.averageOrderValue)}
                  </td>
                </tr>
              ))}
              {trendRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No trend data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
