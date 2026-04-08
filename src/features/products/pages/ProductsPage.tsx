import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { ProductGrid } from '../components/ProductGrid';
import { Button } from '@/shared/components/ui/button';
import { Plus, PackageOpen } from 'lucide-react';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [filters] = useState({});
  const { data: products, isLoading, isError } = useProducts(filters);
  const { mutate: deleteProduct } = useDeleteProduct();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <p className="text-lg font-medium text-gray-700">Failed to load products</p>
        <p className="text-sm text-gray-500">Check your connection and try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate('/products/add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products && products.length > 0 ? (
        <ProductGrid
          products={products}
          onDelete={deleteProduct}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <PackageOpen className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">No products yet</p>
            <p className="text-sm text-gray-500 mt-1">Add your first product to get started.</p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 mt-2"
            onClick={() => navigate('/products/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      )}
    </div>
  );
}
