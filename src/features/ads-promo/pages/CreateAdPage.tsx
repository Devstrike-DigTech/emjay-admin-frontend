import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select } from '@/shared/components/ui/select';

const appliesTo = [
  { value: 'ALL', label: 'All Products & Services' },
  { value: 'PRODUCTS', label: 'Specific Products' },
  { value: 'SERVICES', label: 'Specific Services' },
  { value: 'CATEGORIES', label: 'Product Categories' },
];

// Mock products for selection
const mockProducts = [
  { value: '1', label: 'Sterling Bottle' },
  { value: '2', label: 'Makeup Kit' },
  { value: '3', label: 'Perfume Set' },
  { value: '4', label: 'Lipstick' },
];

const mockServices = [
  { value: '1', label: 'Hair Styling' },
  { value: '2', label: 'Makeup Service' },
  { value: '3', label: 'Nail Art' },
];

export default function CreateAdPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    headline: '',
    description: '',
    appliesTo: 'ALL',
    selectedProducts: [] as string[],
    selectedServices: [] as string[],
    startDate: '',
    endDate: '',
  });
  const [_imageFile, setImageFile] = useState<File | null>(null);
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

  const toggleProduct = (productId: string) => {
    setFormData({
      ...formData,
      selectedProducts: formData.selectedProducts.includes(productId)
        ? formData.selectedProducts.filter(id => id !== productId)
        : [...formData.selectedProducts, productId]
    });
  };

  const toggleService = (serviceId: string) => {
    setFormData({
      ...formData,
      selectedServices: formData.selectedServices.includes(serviceId)
        ? formData.selectedServices.filter(id => id !== serviceId)
        : [...formData.selectedServices, serviceId]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating ad:', formData);
    alert('Ad created successfully!');
    navigate('/ads-promo');
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
          
          <h1 className="text-2xl font-bold text-gray-900">Create an Ad</h1>
          <p className="text-gray-600 mt-1">Create a new advertisement for your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-6">
          {/* Ad Headline */}
          <div className="space-y-2">
            <Label htmlFor="headline" className="text-base font-semibold text-gray-900">
              Ad Headline
            </Label>
            <Input
              id="headline"
              type="text"
              placeholder="Enter a catchy headline for your ad"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="h-12"
              required
            />
          </div>

          {/* Ad Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-gray-900">
              Ad Description
            </Label>
            <textarea
              id="description"
              placeholder="Describe your ad campaign and what it offers..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={5}
              required
            />
          </div>

          {/* Applies To */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">
              Ad Applies To
            </Label>
            <Select
              options={appliesTo}
              value={formData.appliesTo}
              onChange={(value) => setFormData({ ...formData, appliesTo: value })}
              className="h-12"
            />
          </div>

          {/* Product Selection */}
          {formData.appliesTo === 'PRODUCTS' && (
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-900">
                Select Products
              </Label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                {mockProducts.map((product) => (
                  <label
                    key={product.value}
                    className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedProducts.includes(product.value)}
                      onChange={() => toggleProduct(product.value)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-900">{product.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {formData.selectedProducts.length} product(s) selected
              </p>
            </div>
          )}

          {/* Service Selection */}
          {formData.appliesTo === 'SERVICES' && (
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-900">
                Select Services
              </Label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                {mockServices.map((service) => (
                  <label
                    key={service.value}
                    className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedServices.includes(service.value)}
                      onChange={() => toggleService(service.value)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-900">{service.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {formData.selectedServices.length} service(s) selected
              </p>
            </div>
          )}

          {/* Upload Ad Image */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">
              Upload Ad Image
            </Label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Drop Files here or Choose File</p>
                    <p className="text-xs text-gray-500">Upload .jpg, .png, max size 10MB</p>
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

          {/* Ad Duration */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">
              Ad Duration
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm text-gray-700">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm text-gray-700">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="h-12"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-primary hover:bg-primary/90"
            >
              Create Ad
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}