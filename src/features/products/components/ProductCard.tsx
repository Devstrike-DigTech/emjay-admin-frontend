import { Card } from '@/shared/components/ui/card';
import { MoreVertical } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/utils';
import { Product } from '@/features/products/types/product.types';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking menu
    // Handle menu actions here
    console.log('Menu clicked for product:', product.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1" onClick={handleCardClick}>
      <div className="relative group">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"           onClick={handleMenuClick}
>
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-gray-900">{formatCurrency(product.basePrice)}</p>
        <h3 className="text-sm font-medium text-gray-900 mt-1 truncate">{product.name}</h3>
        <p className="text-xs text-gray-600 mt-1">{product.stockQuantity} Units Instock</p>
      </div>
    </Card>
  );
}