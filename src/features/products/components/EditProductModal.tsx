import { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select } from '@/shared/components/ui/select';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    category: string;
    price: number;
    stockQuantity: number;
    images: string[];
  };
  onSave: (updatedProduct: Partial<ProductUpdate>) => void;
}

interface ProductUpdate {
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
}

const categoryOptions = [
  { value: 'utilities', label: 'Utilities' },
  { value: 'makeup', label: 'Make Up' },
  { value: 'fragrances', label: 'Fragrances' },
  { value: 'personal-care', label: 'Personal Care' },
  { value: 'oral-care', label: 'Oral Care' },
];

export function EditProductModal({ isOpen, onClose, product, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    category: 'utilities',
    price: product.price,
    stockQuantity: product.stockQuantity,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      name: product.name,
      category: 'utilities',
      price: product.price,
      stockQuantity: product.stockQuantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-sm font-semibold text-gray-900">
              Edit Product Name
            </Label>
            <Input
              id="productName"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-11"
            />
          </div>

          {/* Product Category */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">
              Edit Product Category
            </Label>
            <Select
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              className="h-11"
            />
          </div>

          {/* Product Price */}
          <div className="space-y-2">
            <Label htmlFor="productPrice" className="text-sm font-semibold text-gray-900">
              Edit Product Price
            </Label>
            <Input
              id="productPrice"
              type="text"
              value={`NGN ${formData.price.toLocaleString()}`}
              onChange={(e) => {
                const numValue = e.target.value.replace(/[^0-9]/g, '');
                setFormData({ ...formData, price: Number(numValue) });
              }}
              className="h-11"
            />
          </div>

          {/* Unit Amount */}
          <div className="space-y-2">
            <Label htmlFor="unitAmount" className="text-sm font-semibold text-gray-900">
              Edit Unit Amount
            </Label>
            <Input
              id="unitAmount"
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
              className="h-11"
            />
          </div>

          {/* Product Image */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">
              Edit Product Image
            </Label>
            <div className="flex items-center gap-3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-base font-semibold"
          >
            Create Service
          </Button>
        </form>
      </div>
    </div>
  );
}