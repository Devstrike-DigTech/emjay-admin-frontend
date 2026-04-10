import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SetTargetModal } from '@/features/products/components/SetTargetModal';
import { EditProductModal } from '@/features/products/components/EditProductModal';
import { ProductImageManager } from '@/features/products/components/ProductImageManager';
import { cn } from '@/shared/lib/utils';
import { productsApi } from '@/features/products/api/products.api';
import { BackendProductResponse, ProductImageInfo } from '@/features/products/types/product.types';

interface ProductDetail {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  description?: string;
  price: number;
  costPrice?: number;
  brand?: string;
  discount?: number;
  totalRevenue: number;
  lastStockDate: string;
  lastStockQuantity: number;
  totalPurchased: number;
  lastPurchasedDate: string;
  addedDate: string;
  monthlyTarget?: number;
  stockQuantity: number;
  reorderLevel: number;
  isActive: boolean;
  reviews: Review[];
  averageRating: number;
  ratingBreakdown: { [key: number]: number };
}

interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function mapBackendToDetail(raw: BackendProductResponse): ProductDetail {
  return {
    id: raw.id,
    name: raw.name,
    sku: raw.sku,
    categoryId: raw.categoryId,
    categoryName: raw.categoryName ?? raw.categoryId,
    description: raw.description,
    price: typeof raw.retailPrice === 'object'
      ? Number(raw.retailPrice)
      : raw.retailPrice,
    costPrice: raw.costPrice !== undefined
      ? typeof raw.costPrice === 'object' ? Number(raw.costPrice) : raw.costPrice
      : undefined,
    brand: raw.brand,
    discount: undefined,
    totalRevenue: 0,
    lastStockDate: '—',
    lastStockQuantity: 0,
    totalPurchased: 0,
    lastPurchasedDate: '—',
    addedDate: formatDate(raw.createdAt),
    monthlyTarget: undefined,
    stockQuantity: raw.stockQuantity,
    reorderLevel: raw.minStockThreshold,
    isActive: raw.status === 'ACTIVE',
    reviews: [],
    averageRating: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [images, setImages] = useState<ProductImageInfo[]>([]);
  const [stockAmount, setStockAmount] = useState(0);
  const [isSetTargetModalOpen, setIsSetTargetModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!id) return;
    setError(null);
    try {
      const raw = await productsApi.getByIdFull(id);
      const mapped = mapBackendToDetail(raw);
      setProduct(mapped);
      setStockAmount(mapped.stockQuantity);
      // Sort: primary first, then by displayOrder
      const sorted = [...(raw.images ?? [])].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.displayOrder - b.displayOrder;
      });
      setImages(sorted);
    } catch {
      setError('Failed to load product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    loadProduct();
  }, [loadProduct]);

  const formatCurrency = (amount: number) =>
    `NGN ${amount.toLocaleString()}`;

  const handleStockChange = (increment: boolean) => {
    setStockAmount((prev) => (increment ? prev + 1 : Math.max(0, prev - 1)));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-lg font-semibold text-gray-800">{error}</p>
        <Button onClick={() => navigate(-1)} variant="outline">Go back</Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg font-semibold text-gray-700">Product not found.</p>
        <Button onClick={() => navigate(-1)} variant="outline">Go back</Button>
      </div>
    );
  }

  const totalReviews = Object.values(product.ratingBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              SKU: {product.sku}
            </span>
            <span
              className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
              )}
            >
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBox icon="💰" label="Total Revenue" value={formatCurrency(product.totalRevenue)} />
          <StatBox icon="📅" label="Last Stock Date" value={product.lastStockDate} />
          <StatBox icon="📦" label="Last Stock Quantity" value={product.lastStockQuantity.toString()} />
          <StatBox icon="🛒" label="Total Purchased" value={product.totalPurchased.toString()} />
          <StatBox icon="📅" label="Last Purchased Date" value={product.lastPurchasedDate} />
          <StatBox
            icon="🗓️"
            label="Added On"
            value={product.addedDate}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Image Manager */}
          <div className="lg:col-span-1">
            <ProductImageManager
              productId={product.id}
              initialImages={images}
            />
          </div>

          {/* Right Column — Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price & Category Card */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{product.categoryName}</h2>
                  {product.brand && (
                    <p className="text-sm text-gray-500 mt-0.5">Brand: {product.brand}</p>
                  )}
                </div>
                <button
                  onClick={() => setIsEditProductModalOpen(true)}
                  className="text-sm font-medium text-primary hover:text-primary/80 border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  Edit Product
                </button>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {product.discount && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {product.discount}% off
                  </span>
                )}
              </div>

              {product.costPrice !== undefined && (
                <p className="text-sm text-gray-500 mb-4">
                  Cost price: {formatCurrency(product.costPrice)}
                </p>
              )}

              {/* Reorder Level */}
              <div className="flex items-center gap-2 mb-5 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-sm">⚠️</span>
                <span className="text-sm text-amber-700 font-medium">
                  Reorder at: <strong>{product.reorderLevel}</strong> units
                </span>
              </div>

              {/* Monthly Target */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Monthly Target</span>
                  <button
                    onClick={() => setIsSetTargetModalOpen(true)}
                    className="text-sm text-primary hover:text-primary/80 underline"
                  >
                    View History
                  </button>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {product.monthlyTarget ? formatCurrency(product.monthlyTarget) : '—'}
                </div>
                <Button
                  onClick={() => setIsSetTargetModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Set Target
                </Button>
              </div>
            </div>

            {/* Amount in Stock Card */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amount In Stock</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleStockChange(false)}
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 text-xl font-bold"
                >
                  -
                </button>
                <div className="flex-1 bg-gray-100 rounded-lg px-6 py-3 text-center">
                  <span className="text-2xl font-bold text-gray-900">{stockAmount}</span>
                </div>
                <button
                  onClick={() => handleStockChange(true)}
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>

          {product.reviews.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No reviews yet.</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-6">
                Showing {product.reviews.length} of {totalReviews} reviews
              </p>
              <div className="flex items-start gap-8 mb-8 pb-8 border-b">
                <div className="text-center">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{product.averageRating}</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-4">{rating}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: totalReviews
                              ? `${(product.ratingBreakdown[rating] / totalReviews) * 100}%`
                              : '0%',
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        {product.ratingBreakdown[rating]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <img
                      src={review.customerAvatar}
                      alt={review.customerName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modals */}
        <SetTargetModal
          isOpen={isSetTargetModalOpen}
          onClose={() => setIsSetTargetModalOpen(false)}
          currentTarget={product.monthlyTarget}
          productName={product.name}
        />

        <EditProductModal
          isOpen={isEditProductModalOpen}
          onClose={() => setIsEditProductModalOpen(false)}
          product={{
            id: product.id,
            name: product.name,
            sku: product.sku,
            categoryId: product.categoryId,
            price: product.price,
            costPrice: product.costPrice,
            reorderLevel: product.reorderLevel,
            brand: product.brand,
            description: product.description,
            isActive: product.isActive,
          }}
          onSave={loadProduct}
        />
      </div>
    </div>
  );
}

interface StatBoxProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
}

function StatBox({ icon, label, value, subtitle }: StatBoxProps) {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
}
