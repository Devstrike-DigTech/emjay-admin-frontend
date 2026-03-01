import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  minStock?: number;
}

export function FilterModal({ isOpen, onClose, onApply, currentFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      minPrice: undefined,
      maxPrice: undefined,
      stockStatus: 'all',
      minStock: undefined,
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Filter Products</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-900">Price Range (₦)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="minPrice" className="text-xs text-gray-600">Min Price</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxPrice" className="text-xs text-gray-600">Max Price</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="1,000,000"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-900">Stock Status</Label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Products' },
                { value: 'in-stock', label: 'In Stock (>50 units)' },
                { value: 'low-stock', label: 'Low Stock (1-50 units)' },
                { value: 'out-of-stock', label: 'Out of Stock (0 units)' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="stockStatus"
                    value={option.value}
                    checked={filters.stockStatus === option.value}
                    onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value as any })}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Stock */}
          <div className="space-y-3">
            <Label htmlFor="minStock" className="text-sm font-semibold text-gray-900">Minimum Stock Level</Label>
            <Input
              id="minStock"
              type="number"
              placeholder="e.g., 100"
              value={filters.minStock || ''}
              onChange={(e) => setFilters({ ...filters, minStock: e.target.value ? Number(e.target.value) : undefined })}
            />
            <p className="text-xs text-gray-500">Show products with at least this many units</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Reset All
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="bg-primary hover:bg-primary/90"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}