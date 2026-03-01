import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectOption } from '@/shared/components/ui/select';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  categories: SelectOption[];
}

export interface ServiceFormData {
  name: string;
  subcategoryId: string;
}

export function AddServiceModal({ isOpen, onClose, onSubmit, categories }: AddServiceModalProps) {
  const [serviceName, setServiceName] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [errors, setErrors] = useState<{ name?: string; subcategory?: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { name?: string; subcategory?: string } = {};
    if (!serviceName.trim()) {
      newErrors.name = 'Service name is required';
    }
    if (!selectedSubcategory) {
      newErrors.subcategory = 'Category is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    onSubmit({
      name: serviceName,
      subcategoryId: selectedSubcategory,
    });

    // Reset form
    setServiceName('');
    setSelectedSubcategory('');
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setServiceName('');
    setSelectedSubcategory('');
    setErrors({});
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add a Service</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Name */}
          <div className="space-y-2">
            <Label htmlFor="serviceName" className="text-base font-semibold text-gray-900">
              Service Name
            </Label>
            <Input
              id="serviceName"
              type="text"
              placeholder="Enter the Name of the Product"
              value={serviceName}
              onChange={(e) => {
                setServiceName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={cn(
                'h-12',
                errors.name && 'border-red-500'
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Service Sub-category */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">
              Service Sub-category Name
            </Label>
            <Select
              options={categories}
              value={selectedSubcategory}
              onChange={(value) => {
                setSelectedSubcategory(value);
                if (errors.subcategory) setErrors({ ...errors, subcategory: undefined });
              }}
              placeholder="Select the Category ot belongs to or create a new one"
              error={!!errors.subcategory}
              className="h-12"
            />
            {errors.subcategory && (
              <p className="text-sm text-red-600">{errors.subcategory}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
          >
            Create Service
          </Button>
        </form>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}