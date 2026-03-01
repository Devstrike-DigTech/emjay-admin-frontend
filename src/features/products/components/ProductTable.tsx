import { MoreVertical } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/utils';
import { Product } from '../types/product.types';
import { useNavigate } from 'react-router-dom';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {

     const navigate = useNavigate();

  const handleRowClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleMenuClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation(); // Prevent row click when clicking menu
    console.log('Menu clicked for product:', productId);
    // Handle menu actions here
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit In Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
             <tr 
              key={product.id} 
              onClick={() => handleRowClick(product.id)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.sku}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/50'}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(product.basePrice)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.stockQuantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-gray-400 hover:text-gray-600"  onClick={(e) => handleMenuClick(e, product.id)}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}