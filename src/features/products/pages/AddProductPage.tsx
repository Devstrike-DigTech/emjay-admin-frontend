import { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select } from '@/shared/components/ui/select';

const categoryOptions = [
  { value: 'makeup', label: 'Make Up' },
  { value: 'fragrances', label: 'Fragrances' },
  { value: 'personal-care', label: 'Personal Care' },
  { value: 'oral-care', label: 'Oral Care' },
];

export default function AddProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    unitAmount: '',
    hasDiscount: false,
    discountPercentage: '',
    promoStartDate: '',
    promoEndDate: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding product:', formData);
    alert('Product added successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">Add a Product to your Inventory</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-base font-semibold text-gray-900">
              Product Name
            </Label>
            <Input
              id="productName"
              type="text"
              placeholder="Enter the Name of the Product"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12"
              required
            />
          </div>

          {/* Product Category */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">
              Select Product Category
            </Label>
            <Select
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              placeholder="Select the Category ot belongs to or create a new one"
              className="h-12"
            />
          </div>

          {/* Product Cost Price */}
          <div className="space-y-2">
            <Label htmlFor="costPrice" className="text-base font-semibold text-gray-900">
              Product Cost Price
            </Label>
            <Input
              id="costPrice"
              type="text"
              placeholder="How much did you purchase this item"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              className="h-12"
              required
            />
          </div>

          {/* Product Selling Price */}
          <div className="space-y-2">
            <Label htmlFor="sellingPrice" className="text-base font-semibold text-gray-900">
              Product Selling Price
            </Label>
            <Input
              id="sellingPrice"
              type="text"
              placeholder="How much you go selling"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              className="h-12"
              required
            />
          </div>

          {/* Upload Product Image */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">
              Upload Product Image
            </Label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Drop Files here or Choose File</p>
                    <p className="text-xs text-gray-500">Upload .jpg, .png, .mp4, max size 10MB</p>
                  </div>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Choose File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Unit Amount */}
          <div className="space-y-2">
            <Label htmlFor="unitAmount" className="text-base font-semibold text-gray-900">
              Unit Amount
            </Label>
            <Input
              id="unitAmount"
              type="number"
              placeholder="How many units are you adding to your inventory"
              value={formData.unitAmount}
              onChange={(e) => setFormData({ ...formData, unitAmount: e.target.value })}
              className="h-12"
              required
            />
          </div>

          {/* Discount Checkbox */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasDiscount}
                onChange={(e) => setFormData({ ...formData, hasDiscount: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-base font-semibold text-gray-900">Does this Product have a Discount</span>
            </label>

            {/* Discount Fields */}
            {formData.hasDiscount && (
              <div className="space-y-4 pl-8 animate-in slide-in-from-top-2 duration-200">
                {/* Promo Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="discountPercentage" className="text-base font-semibold text-gray-900">
                    Promo Percentage
                  </Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    placeholder="Enter Discount Percentage for the Promo"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="h-12"
                  />
                </div>

                {/* Promo Duration */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-900">
                    Promo Duration
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      placeholder="Start Date"
                      value={formData.promoStartDate}
                      onChange={(e) => setFormData({ ...formData, promoStartDate: e.target.value })}
                      className="h-12"
                    />
                    <Input
                      type="date"
                      placeholder="End Date"
                      value={formData.promoEndDate}
                      onChange={(e) => setFormData({ ...formData, promoEndDate: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-base font-semibold"
          >
            + Add Product
          </Button>
        </form>
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}