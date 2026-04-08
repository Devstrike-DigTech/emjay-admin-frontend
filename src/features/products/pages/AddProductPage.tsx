import { useState } from 'react';
import { ArrowLeft, Upload, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useActiveSuppliers } from '@/features/suppliers/hooks/useSuppliers';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { productsApi } from '../api/products.api';

interface FormData {
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  supplierId: string;
  costPrice: string;
  sellingPrice: string;
  unitAmount: string;
  hasDiscount: boolean;
  discountPercentage: string;
  promoStartDate: string;
  promoEndDate: string;
}

const emptyForm: FormData = {
  name: '',
  sku: '',
  description: '',
  categoryId: '',
  supplierId: '',
  costPrice: '',
  sellingPrice: '',
  unitAmount: '',
  hasDiscount: false,
  discountPercentage: '',
  promoStartDate: '',
  promoEndDate: '',
};

export default function AddProductPage() {
  const navigate = useNavigate();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: suppliers, isLoading: suppliersLoading } = useActiveSuppliers();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formError, setFormError] = useState('');

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
    setFormError('');

    if (!formData.name.trim()) { setFormError('Product name is required.'); return; }
    if (!formData.sku.trim()) { setFormError('SKU is required.'); return; }
    if (!formData.categoryId) { setFormError('Please select a category.'); return; }
    if (!formData.costPrice || isNaN(Number(formData.costPrice))) {
      setFormError('Please enter a valid cost price.'); return;
    }
    if (!formData.sellingPrice || isNaN(Number(formData.sellingPrice))) {
      setFormError('Please enter a valid selling price.'); return;
    }
    if (!formData.unitAmount || isNaN(Number(formData.unitAmount))) {
      setFormError('Please enter a valid unit amount.'); return;
    }

    createProduct(
      {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        description: formData.description.trim() || undefined,
        categoryId: formData.categoryId,
        brandId: formData.supplierId || undefined,
        basePrice: Number(formData.sellingPrice),
        costPrice: Number(formData.costPrice),
        stockQuantity: Number(formData.unitAmount),
        reorderLevel: 10,
        unit: 'PCS',
      },
      {
        onSuccess: async (newProduct) => {
          // Upload image if user selected one
          if (imageFile && newProduct?.id) {
            try {
              await productsApi.uploadImage(newProduct.id, imageFile, true, 0);
            } catch {
              // Image upload failed — product was created; navigate anyway
              console.warn('Image upload failed, but product was created successfully.');
            }
          }
          navigate('/products');
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          setFormError(
            err?.response?.data?.message ?? 'Failed to create product. Please try again.'
          );
        },
      }
    );
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
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add a Product to your Inventory</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-base font-semibold text-gray-900">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="productName"
              type="text"
              placeholder="Enter the name of the product"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12"
              required
            />
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <Label htmlFor="sku" className="text-base font-semibold text-gray-900">
              SKU <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sku"
              type="text"
              placeholder="Unique product code (e.g. SKU-001)"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="h-12"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-gray-900">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Optional product description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-base font-semibold text-gray-900">
              Product Category <span className="text-red-500">*</span>
            </Label>
            <select
              id="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full h-12 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              required
            >
              <option value="">
                {categoriesLoading ? 'Loading categories…' : 'Select a category'}
              </option>
              {(categories ?? []).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parentName ? `${cat.parentName} › ${cat.name}` : cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier */}
          <div className="space-y-2">
            <Label htmlFor="supplierId" className="text-base font-semibold text-gray-900">
              Supplier
            </Label>
            <select
              id="supplierId"
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              className="w-full h-12 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            >
              <option value="">
                {suppliersLoading ? 'Loading suppliers…' : '— No supplier —'}
              </option>
              {(suppliers ?? []).map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice" className="text-base font-semibold text-gray-900">
                Cost Price (₦) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="Purchase price"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice" className="text-base font-semibold text-gray-900">
                Selling Price (₦) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="Retail price"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                className="h-12"
                required
              />
            </div>
          </div>

          {/* Upload Product Image */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">Upload Product Image</Label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Drop files here or choose a file</p>
                    <p className="text-xs text-gray-500">Upload .jpg or .png, max size 10MB</p>
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
                    variant="outline"
                    onClick={() => document.getElementById('imageUpload')?.click()}
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
                  onClick={() => { setImageFile(null); setImagePreview(''); }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100 shadow"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Unit Amount */}
          <div className="space-y-2">
            <Label htmlFor="unitAmount" className="text-base font-semibold text-gray-900">
              Opening Stock (units) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="unitAmount"
              type="number"
              min="0"
              placeholder="How many units are you adding to inventory"
              value={formData.unitAmount}
              onChange={(e) => setFormData({ ...formData, unitAmount: e.target.value })}
              className="h-12"
              required
            />
          </div>

          {/* Discount section */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasDiscount}
                onChange={(e) => setFormData({ ...formData, hasDiscount: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-base font-semibold text-gray-900">
                Does this product have a discount?
              </span>
            </label>

            {formData.hasDiscount && (
              <div className="space-y-4 pl-8 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-2">
                  <Label htmlFor="discountPercentage" className="text-base font-semibold text-gray-900">
                    Discount Percentage (%)
                  </Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 10"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-900">Promo Duration</Label>
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

          {formError && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-base font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Adding Product…
              </>
            ) : (
              '+ Add Product'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
