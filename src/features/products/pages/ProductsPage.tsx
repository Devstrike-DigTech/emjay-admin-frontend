import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { ProductGrid } from '../components/ProductGrid';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProductsPage() {
  const [filters, setFilters] = useState({});
  const { data: products, isLoading } = useProducts(filters);
  const { mutate: deleteProduct } = useDeleteProduct();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductGrid
        products={products || []}
        onDelete={deleteProduct}
      />
    </div>
  );
}