import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select } from '@/shared/components/ui/select';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { productsApi } from '@/features/products/api/products.api';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    categoryId: string;
    price: number;
    costPrice?: number;
    reorderLevel: number;
    brand?: string;
    description?: string;
    isActive: boolean;
    sku: string;
  };
  /** Called after a successful save — parent should re-fetch product data */
  onSave: () => void;
}

export function EditProductModal({ isOpen, onClose, product, onSave }: EditProductModalProps) {
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const [formData, setFormData] = useState({
    name: product.name,
    categoryId: product.categoryId,
    price: product.price,
    costPrice: product.costPrice ?? 0,
    reorderLevel: product.reorderLevel,
    brand: product.brand ?? '',
    description: product.description ?? '',
    isActive: product.isActive,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-sync form whenever the modal opens with fresh product data
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: product.name,
        categoryId: product.categoryId,
        price: product.price,
        costPrice: product.costPrice ?? 0,
        reorderLevel: product.reorderLevel,
        brand: product.brand ?? '',
        description: product.description ?? '',
        isActive: product.isActive,
      });
      setError(null);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await productsApi.update(product.id, {
        name: formData.name,
        categoryId: formData.categoryId,
        basePrice: formData.price,
        costPrice: formData.costPrice || undefined,
        reorderLevel: formData.reorderLevel,
        isActive: formData.isActive,
      });
      onSave();
      onClose();
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
            <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-900">
              Product Name
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="h-11"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">Category</Label>
            {loadingCategories ? (
              <div className="h-11 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading categories…
              </div>
            ) : (
              <Select
                options={categoryOptions}
                value={formData.categoryId}
                onChange={(value) => setFormData({ ...formData, categoryId: value })}
                className="h-11"
              />
            )}
          </div>

          {/* Selling Price */}
          <div className="space-y-2">
            <Label htmlFor="edit-price" className="text-sm font-semibold text-gray-900">
              Selling Price (NGN)
            </Label>
            <Input
              id="edit-price"
              type="text"
              value={formData.price === 0 ? '' : `NGN ${formData.price.toLocaleString()}`}
              onChange={(e) => {
                const num = Number(e.target.value.replace(/[^0-9]/g, ''));
                setFormData({ ...formData, price: num });
              }}
              required
              className="h-11"
            />
          </div>

          {/* Cost Price */}
          <div className="space-y-2">
            <Label htmlFor="edit-cost" className="text-sm font-semibold text-gray-900">
              Cost Price (NGN)
            </Label>
            <Input
              id="edit-cost"
              type="text"
              value={formData.costPrice === 0 ? '' : `NGN ${formData.costPrice.toLocaleString()}`}
              onChange={(e) => {
                const num = Number(e.target.value.replace(/[^0-9]/g, ''));
                setFormData({ ...formData, costPrice: num });
              }}
              className="h-11"
            />
          </div>

          {/* Reorder Level */}
          <div className="space-y-2">
            <Label htmlFor="edit-reorder" className="text-sm font-semibold text-gray-900">
              Reorder Level (units)
            </Label>
            <Input
              id="edit-reorder"
              type="number"
              min={0}
              value={formData.reorderLevel}
              onChange={(e) =>
                setFormData({ ...formData, reorderLevel: Number(e.target.value) })
              }
              className="h-11"
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-gray-900">Active</p>
              <p className="text-xs text-gray-500">Product is visible and can be sold</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isActive ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-primary hover:bg-primary/90 font-semibold"
              disabled={saving || loadingCategories}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
