import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter as FilterIcon, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';

interface InventoryItem {
  id: string;
  item: string;
  itemImage: string;
  unitPrice: number;
  amountInStock: number;
}

const mockInventory: InventoryItem[] = [
  {
    id: '34/9492/0',
    item: 'Sterling Waterbottle',
    itemImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100',
    unitPrice: 100000,
    amountInStock: 0,
  },
  {
    id: '34/9492/0',
    item: 'Sterling Waterbottle',
    itemImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100',
    unitPrice: 100000,
    amountInStock: 1,
  },
  {
    id: '34/9492/0',
    item: 'Sterling Waterbottle',
    itemImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100',
    unitPrice: 100000,
    amountInStock: 10,
  },
  {
    id: '34/9492/0',
    item: 'Sterling Waterbottle',
    itemImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100',
    unitPrice: 100000,
    amountInStock: 15,
  },
  {
    id: '34/9492/0',
    item: 'Sterling Waterbottle',
    itemImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100',
    unitPrice: 100000,
    amountInStock: 32,
  },
  {
    id: '34/9492/0',
    item: 'Sterling Waterbottle',
    itemImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100',
    unitPrice: 100000,
    amountInStock: 20,
  },
];

export default function TotalProductInventoryPage() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInventory(mockInventory);
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
              <h1 className="text-2xl font-bold text-gray-900">Total Product Inventory</h1>
              <p className="text-gray-600 mt-1">Here's a list of your Inventory</p>
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
            <h3 className="text-base font-semibold text-gray-900">Total Product Inventory</h3>
            
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

        {/* Inventory Table */}
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
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount In Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {inventory.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.item}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={item.itemImage}
                      alt={item.item}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      item.amountInStock === 0 
                        ? 'text-red-600' 
                        : item.amountInStock < 20 
                        ? 'text-orange-600' 
                        : 'text-gray-900'
                    }`}>
                      {item.amountInStock}
                    </span>
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