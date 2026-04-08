import { useState } from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useSalesTrend, useSalesSummary } from '@/features/analytics/hooks/useAnalytics';

type TabMode = 'products' | 'services';
type TimeFilter = 'year' | 'month' | 'day';

const serviceEarningsData = [
  { month: 'Jan', amount: 150000 },
  { month: 'Feb', amount: 380000 },
  { month: 'Mar', amount: 630000, badge: '8.2' },
  { month: 'Apr', amount: 550000 },
  { month: 'May', amount: 350000 },
  { month: 'June', amount: 450000 },
  { month: 'July', amount: 400000 },
  { month: 'Aug', amount: 540000 },
  { month: 'Sept', amount: 820000, badge: '9.2' },
  { month: 'Oct', amount: 640000 },
  { month: 'Nov', amount: 680000 },
  { month: 'Dec', amount: 400000 },
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

// Helper: compute year-to-date date range strings (YYYY-MM-DD)
function currentYearRange(): [string, string] {
  const today = new Date();
  const startDate = `${today.getFullYear()}-01-01`;
  const endDate = today.toISOString().split('T')[0];
  return [startDate, endDate];
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabMode>('products');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('year');

  const [startDate, endDate] = currentYearRange();

  const { data: trendData, isLoading: trendLoading } = useSalesTrend('MONTHLY', 12);
  const { data: summary, isLoading: summaryLoading } = useSalesSummary(startDate, endDate);

  const isLoading = trendLoading || summaryLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isProducts = activeTab === 'products';

  // Map trend data to chart format: use periodDate month index to derive label
  const productEarningsData = (trendData ?? []).map((item, index) => {
    let month = MONTH_LABELS[index] ?? `M${index + 1}`;
    if (item.periodDate) {
      try {
        const monthIndex = new Date(item.periodDate).getMonth();
        month = MONTH_LABELS[monthIndex] ?? month;
      } catch {
        // keep fallback
      }
    }
    return { month, amount: item.totalRevenue };
  });

  const earningsData = isProducts ? productEarningsData : serviceEarningsData;
  const maxAmount = Math.max(...earningsData.map(d => d.amount), 1);

  const formatCurrency = (amount: number) =>
    `NGN ${amount.toLocaleString()}`;

  const totalRevenue = summary?.totalRevenue ?? 0;
  const totalOrders = summary?.totalOrders ?? 0;
  const avgOrderValue = summary?.averageOrderValue ?? 0;
  const completionRate = summary?.completionRate ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-l font-bold text-gray-900">
            Hey Emjay <span className="text-sm font-normal text-gray-600">- here's what's happing on your store today</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-semibold transition-colors',
              activeTab === 'products'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            )}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-semibold transition-colors',
              activeTab === 'services'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            )}
          >
            Services
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Revenue"
            value={isProducts ? formatCurrency(totalRevenue) : 'NGN 100,000,000'}
            change={isProducts ? undefined : '+36% ↑'}
            subtitle={isProducts ? `${totalOrders} orders this month` : '300 Units Sold in the last month'}
            monthFilter="This Month"
          />
          <StatCard
            label={isProducts ? 'Last Purchase' : 'Last Order'}
            value={isProducts ? 'NGN 123,000' : 'NGN 123,000'}
            change="+8% ↑"
            subtitle={isProducts ? 'Saved all purchase on 10/04/25' : 'Saved all purchase on 10/04/25'}
            monthFilter="This Month"
          />
          <StatCard
            label={isProducts ? 'Last Order' : 'Last Order'}
            value={isProducts ? formatCurrency(avgOrderValue) : 'NGN 40,000'}
            change="+36% ↑"
            subtitle={isProducts ? 'Average order value this month' : 'Hair Laundry Service on 20/12/25'}
            monthFilter="This Month"
          />
          <StatCard
            label={isProducts ? 'Sales Margin' : 'Total Services Done'}
            value={isProducts ? `${completionRate.toFixed(1)}% Completion` : '300'}
            subtitle={isProducts ? `${summary?.totalOrders ?? 0} total orders` : 'Services Ordered +38% ↑'}
          />
        </div>

        {/* Earnings Chart */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Earnings</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeFilter('year')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  timeFilter === 'year'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                )}
              >
                Year
              </button>
              <button
                onClick={() => setTimeFilter('month')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  timeFilter === 'month'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                )}
              >
                Month
              </button>
              <button
                onClick={() => setTimeFilter('day')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  timeFilter === 'day'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                )}
              >
                Day
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md ml-2">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="relative h-80">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-600">
              <span>N 1,000,000</span>
              <span>N 800,000</span>
              <span>N 650,000</span>
              <span>N 150,000</span>
              <span>N 10,000</span>
            </div>

            {/* Chart area */}
            <div className="ml-20 h-full flex items-end justify-between gap-3 border-b border-gray-200 pb-2">
              {earningsData.map((data, index) => {
                const heightPercentage = (data.amount / maxAmount) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    {/* Bar */}
                    <div
                      className="w-full bg-primary rounded-t transition-all hover:opacity-80 cursor-pointer relative group"
                      style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                        <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          NGN {data.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Month label */}
                    <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Stats - Products */}
        {isProducts && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <BottomStatCard
              label="Best Performing Product"
              title="Sterling Bottle"
              value="NGN 100,000"
              icon="🔍"
            />
            <BottomStatCard
              label="Worst Performing Product"
              title="Stronghead Perfume"
              subtitle="2 Units Sold"
              icon="💛"
            />
            <BottomStatCard
              label="Best Performing Category"
              title="Make Up"
              subtitle="300 Units of makeup sold +1% ↑"
            />
            <BottomStatCard
              label="Total Revenue"
              title={formatCurrency(totalRevenue)}
              subtitle={`${totalOrders} Orders | ${completionRate.toFixed(1)}% completion rate`}
              icon="🔍"
            />
          </div>
        )}

        {/* Bottom Stats - Services */}
        {!isProducts && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <BottomStatCard
              label="Best Performing Service"
              title="Bridal Make Up"
              value="NGN 100,000"
              subtitle="300 Orders"
            />
            <BottomStatCard
              label="Worst Performing Service"
              title="Gele Tying"
              value="NGN 10,000"
              subtitle="30 Orders"
            />
            <BottomStatCard
              label="Best Performing Category"
              title="Nails"
              value="NGN 200,000"
              subtitle="300 Orders"
            />
            <BottomStatCard
              label="Worst Performing Category"
              title="Gele"
              value="NGN 200,000"
              subtitle="200 Orders"
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  subtitle?: string;
  monthFilter?: string;
}

function StatCard({ label, value, change, subtitle, monthFilter }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        {monthFilter && (
          <select className="text-xs border border-gray-200 rounded px-2 py-1">
            <option>{monthFilter}</option>
          </select>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {change && <p className="text-sm text-green-600 font-medium mb-1">{change}</p>}
      {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
    </div>
  );
}

interface BottomStatCardProps {
  label: string;
  title: string;
  value?: string;
  subtitle?: string;
  icon?: string;
}

function BottomStatCard({ label, title, value, subtitle, icon }: BottomStatCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <p className="text-sm text-gray-600 mb-3">{label}</p>
      <div className="flex items-center gap-3 mb-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <p className="font-bold text-gray-900">{title}</p>
          {value && <p className="text-sm text-gray-900">{value}</p>}
        </div>
      </div>
      {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
    </div>
  );
}
