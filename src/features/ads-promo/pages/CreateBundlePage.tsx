import { useState } from 'react';
import { ArrowLeft, Upload, X, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select } from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';

const discountTypeOptions = [
  { value: 'PERCENTAGE', label: 'Percentage (%)' },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount (NGN)' },
];

// Mock products
const mockProducts = [
  { id: '1', name: 'Sterling Bottle', price: 100000, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100' },
  { id: '2', name: 'Makeup Kit', price: 50000, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100' },
  { id: '3', name: 'Perfume Set', price: 80000, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100' },
  { id: '4', name: 'Lipstick', price: 15000, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100' },
  { id: '5', name: 'Face Serum', price: 45000, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100' },
];

interface BundleProduct {
  productId: string;
  quantity: number;
}

export default function CreateBundlePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    applyToAll: true, // true = must buy together, false = individual discounts
    startDate: '',
    endDate: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<BundleProduct[]>([]);
  const [_imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addProduct = (productId: string) => {
    if (!selectedProducts.find(p => p.productId === productId)) {
      setSelectedProducts([...selectedProducts, { productId, quantity: 1 }]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedProducts(
      selectedProducts.map(p => 
        p.productId === productId ? { ...p, quantity } : p
      )
    );
  };

  const calculatePricing = () => {
    let originalTotal = 0;
    selectedProducts.forEach(bp => {
      const product = mockProducts.find(p => p.id === bp.productId);
      if (product) {
        originalTotal += product.price * bp.quantity;
      }
    });

    let bundlePrice = originalTotal;
    if (formData.discountValue) {
      if (formData.discountType === 'PERCENTAGE') {
        bundlePrice = originalTotal * (1 - Number(formData.discountValue) / 100);
      } else {
        bundlePrice = originalTotal - Number(formData.discountValue);
      }
    }

    const savings = originalTotal - bundlePrice;
    const savingsPercentage = originalTotal > 0 ? (savings / originalTotal) * 100 : 0;

    return { originalTotal, bundlePrice, savings, savingsPercentage };
  };

  const pricing = calculatePricing();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length < 2) {
      alert('Please select at least 2 products for the bundle');
      return;
    }
    console.log('Creating bundle:', { ...formData, products: selectedProducts, pricing });
    alert('Bundle created successfully!');
    navigate('/ads-promo');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create a Bundle</h1>
          <p className="text-gray-600 mt-1">Create a product bundle with special pricing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-6">
              {/* Bundle Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Bundle Name</Label>
                <Input id="name" placeholder="e.g., Beauty Essentials Bundle" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12" required />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea id="description" placeholder="Describe what's included..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" rows={3} required />
              </div>

              {/* Product Selection */}
              <div className="space-y-2">
                <Label>Select Products for Bundle</Label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="space-y-2 mb-4">
                    {mockProducts.map((product) => {
                      const isSelected = selectedProducts.find(p => p.productId === product.id);
                      return (
                        <div key={product.id} className={cn("flex items-center gap-3 p-3 rounded-lg border-2 transition-colors", isSelected ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-gray-50')}>
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">NGN {product.price.toLocaleString()}</p>
                          </div>
                          {isSelected ? (
                            <Button type="button" size="sm" variant="outline" onClick={() => removeProduct(product.id)}>Remove</Button>
                          ) : (
                            <Button type="button" size="sm" onClick={() => addProduct(product.id)}>Add</Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{selectedProducts.length} product(s) selected (min. 2 required)</p>
              </div>

              {/* Selected Products Quantities */}
              {selectedProducts.length > 0 && (
                <div className="space-y-2">
                  <Label>Product Quantities</Label>
                  <div className="space-y-3">
                    {selectedProducts.map(bp => {
                      const product = mockProducts.find(p => p.id === bp.productId);
                      if (!product) return null;
                      return (
                        <div key={bp.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                          <span className="flex-1 text-sm font-medium text-gray-900">{product.name}</span>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => updateQuantity(bp.productId, bp.quantity - 1)} className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold">{bp.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(bp.productId, bp.quantity + 1)} className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Discount Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select options={discountTypeOptions} value={formData.discountType} onChange={(value) => setFormData({ ...formData, discountType: value })} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input id="discountValue" type="number" placeholder={formData.discountType === 'PERCENTAGE' ? '20' : '50000'} value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} className="h-12" required />
                </div>
              </div>

              {/* Apply To All */}
              <div className="space-y-2">
                <Label>How should the discount apply?</Label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: formData.applyToAll ? '#6B1B3D' : '#E5E7EB' }}>
                    <input type="radio" checked={formData.applyToAll} onChange={() => setFormData({ ...formData, applyToAll: true })} className="mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">🔗 Must Buy Together (Bundle Price)</p>
                      <p className="text-sm text-gray-600 mt-1">Customer must purchase all items together to get the bundle price</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: !formData.applyToAll ? '#6B1B3D' : '#E5E7EB' }}>
                    <input type="radio" checked={!formData.applyToAll} onChange={() => setFormData({ ...formData, applyToAll: false })} className="mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">📍 Individual Discounts</p>
                      <p className="text-sm text-gray-600 mt-1">Each product gets the discount applied individually</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Bundle Image</Label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="w-10 h-10 text-gray-400" />
                      <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} className="hidden" />
                      <Button type="button" onClick={() => document.getElementById('imageUpload')?.click()}>Choose File</Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="absolute top-2 right-2 p-2 bg-white rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="h-12" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="h-12" required />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1 h-12">Cancel</Button>
                <Button type="submit" className="flex-1 h-12 bg-primary hover:bg-primary/90">Create Bundle</Button>
              </div>
            </form>
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bundle Pricing</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Original Total</p>
                  <p className="text-xl font-bold text-gray-900">NGN {pricing.originalTotal.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Bundle Price</p>
                  <p className="text-2xl font-bold text-primary">NGN {pricing.bundlePrice.toLocaleString()}</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">Customer Saves</p>
                  <p className="text-lg font-bold text-green-600">
                    NGN {pricing.savings.toLocaleString()} ({pricing.savingsPercentage.toFixed(1)}%)
                  </p>
                </div>

                {selectedProducts.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Bundle Includes:</p>
                    <ul className="space-y-1">
                      {selectedProducts.map(bp => {
                        const product = mockProducts.find(p => p.id === bp.productId);
                        return product ? (
                          <li key={bp.productId} className="text-sm text-gray-600">
                            • {bp.quantity}x {product.name}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}