import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select } from '@/shared/components/ui/select';

const discountTypeOptions = [
  { value: 'PERCENTAGE', label: 'Percentage (%)' },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount (NGN)' },
];

export default function CreatePromoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minPurchase: '',
    usageLimit: '',
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
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating promo:', formData);
    alert('Promo created successfully!');
    navigate('/ads-promo');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create a Promo</h1>
          <p className="text-gray-600 mt-1">Create a new promotional offer</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Promo Code</Label>
            <Input id="code" placeholder="e.g., SUMMER20" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="h-12" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Promo Name</Label>
            <Input id="name" placeholder="e.g., Summer Sale" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select options={discountTypeOptions} value={formData.discountType} onChange={(value) => setFormData({ ...formData, discountType: value })} className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input id="discountValue" type="number" placeholder={formData.discountType === 'PERCENTAGE' ? '20' : '5000'} value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} className="h-12" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPurchase">Min Purchase Amount</Label>
              <Input id="minPurchase" type="number" placeholder="50000" value={formData.minPurchase} onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })} className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input id="usageLimit" type="number" placeholder="100" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })} className="h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Promo Image</Label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-12 h-12 text-gray-400" />
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
            <Button type="submit" className="flex-1 h-12 bg-primary hover:bg-primary/90">Create Promo</Button>
          </div>
        </form>
      </div>
    </div>
  );
}