import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export type SortOption = 
  | 'name-asc' 
  | 'name-desc' 
  | 'price-asc' 
  | 'price-desc' 
  | 'stock-asc' 
  | 'stock-desc';

interface SortMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: SortOption;
  onSort: (option: SortOption) => void;
}

const sortOptions = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'stock-asc', label: 'Stock (Low to High)' },
  { value: 'stock-desc', label: 'Stock (High to Low)' },
] as const;

export function SortMenu({ isOpen, onClose, currentSort, onSort }: SortMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="py-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSort(option.value as SortOption);
                onClose();
              }}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2 text-sm transition-colors',
                currentSort === option.value
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <span>{option.label}</span>
              {currentSort === option.value && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}