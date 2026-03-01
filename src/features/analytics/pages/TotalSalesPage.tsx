import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter as FilterIcon, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';

interface Sale {
  id: string;
  item: string;
  itemImage: string;
  price: number;
  unitsSold: number;
  buyer: string;
  dateTime: string;
}

const mockSales: Sale[] = [
  {
    id: '34/9492/0',
    item: 'Sterling Waterbottle',
    itemImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100',
    price: 100000,
    unitsSold: 1,
    buyer: 'Ekiye Benibo',
    dateTime: '12/03/2025; 9:00 Pm',
  },
  {
    id: '34/9492/0',
    item: 'Stronghold Perfume',
    itemImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100',
    price: 100000,
    unitsSold: 883,
    buyer: 'Ezinne Oluchukwu',
    dateTime: '12/03/2025; 9:00 Pm',
  },
  {
    id: '34/9492/0',
    item: 'Makeup kit',
    itemImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100',
    price: 100000,
    unitsSold: 922,
    buyer: 'Safiya Salisu',
    dateTime: '12/03/2025; 9:00 Pm',
  },
  {
    id: '34/9492/0',
    item: 'Beauty Products',
    itemImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100',
    price: 100000,
    unitsSold: 826,
    buyer: 'Yetunde Babalola',
    dateTime: '12/03/2025; 9:00 Pm',
  },
  {
    id: '34/9492/0',
    item: 'Beard Oil',
    itemImage: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=100',
    price: 100000,
    unitsSold: 540,
    buyer: 'Nkemdirim Esite',
    dateTime: '12/03/2025; 9:00 Pm',
  },
];

export default function TotalSalesPage() {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSales(mockSales);
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
              <h1 className="text-2xl font-bold text-gray-900">Total Sales</h1>
              <p className="text-gray-600 mt-1">Here's a list of all sales so far</p>
            </div>
            
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">All Product Sales</h3>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-48"
                />
              </div>

              <Button variant="outline" size="sm">
                <FilterIcon className="w-4 h-4 mr-2" />
                Filter
              </Button>

              <Button variant="outline" size="sm">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sales.map((sale, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.item}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={sale.itemImage}
                      alt={sale.item}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(sale.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.unitsSold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.buyer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sale.dateTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}