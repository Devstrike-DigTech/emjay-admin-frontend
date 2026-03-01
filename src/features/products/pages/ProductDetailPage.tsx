import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Edit2, Star } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { SetTargetModal } from '@/features/products/components/SetTargetModal';
import { EditProductModal } from '@/features/products/components/EditProductModal';
import { cn } from '@/shared/lib/utils';

interface ProductDetail {
  id: string;
  name: string;
  category: string;
  price: number;
  discount?: number;
  totalRevenue: number;
  lastStockDate: string;
  lastStockQuantity: number;
  totalPurchased: number;
  lastPurchasedDate: string;
  addedBy: string;
  addedDate: string;
  images: string[];
  videoUrl?: string;
  monthlyTarget?: number;
  stockQuantity: number;
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

// Mock data
const mockProduct: ProductDetail = {
  id: '1',
  name: 'Sterling Bottle',
  category: 'Sterling Bottle - Utilities',
  price: 100000,
  discount: 20,
  totalRevenue: 1000000,
  lastStockDate: '12th March, 2025',
  lastStockQuantity: 5,
  totalPurchased: 83,
  lastPurchasedDate: '15th March, 2025',
  addedBy: 'Chisom Ekemdilichukwu',
  addedDate: 'Monday 25th, March 2025',
  images: [
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
  ],
  monthlyTarget: 10000000,
  stockQuantity: 100,
  reviews: [
    {
      id: '1',
      customerName: 'Aisha Obayabonna',
      customerAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      comment: "I ordered a wig and some skincare products, and I'm beyond impressed! The wig looks so natural, and the beauty products are authentic. Plus, my order arrived earlier than expected. Definitely my go-to store from now on!",
      date: '2 days ago',
    },
    {
      id: '2',
      customerName: 'Tobi Azibzniga',
      customerAvatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      comment: 'I had a question about a hair product, and their customer service was super helpful. They recommended the perfect product for my hair type, and it works wonders! The prices are also very reasonable compared to other stores. Highly recommend!',
      date: '1 week ago',
    },
  ],
  averageRating: 4.9,
  ratingBreakdown: {
    5: 190,
    4: 80,
    3: 40,
    2: 23,
    1: 12,
  },
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [stockAmount, setStockAmount] = useState(100);
  const [isSetTargetModalOpen, setIsSetTargetModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(mockProduct);
      setStockAmount(mockProduct.stockQuantity);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const formatCurrency = (amount: number) => {
    return `NGN ${amount.toLocaleString()}`;
  };

  const handleStockChange = (increment: boolean) => {
    if (increment) {
      setStockAmount(prev => prev + 1);
    } else {
      setStockAmount(prev => Math.max(0, prev - 1));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
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
          
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBox
            icon="💰"
            label="Total Revenue"
            value={formatCurrency(product.totalRevenue)}
          />
          <StatBox
            icon="📅"
            label="Last Stock Date"
            value={product.lastStockDate}
          />
          <StatBox
            icon="📦"
            label="Last Stock Quantity"
            value={product.lastStockQuantity.toString()}
          />
          <StatBox
            icon="🛒"
            label="Total Number Purchased"
            value={product.totalPurchased.toString()}
          />
          <StatBox
            icon="📅"
            label="Last Purchased Date"
            value={product.lastPurchasedDate}
          />
          <StatBox
            icon="👤"
            label="Added by"
            value={product.addedBy}
            subtitle={product.addedDate}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4">
              {/* Main Image */}
              <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.videoUrl && (
                  <button className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-900 ml-1" />
                    </div>
                  </button>
                )}
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100">
                  <Edit2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'aspect-square rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price & Category Card */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{product.category}</h2>
                <button 
                  onClick={() => setIsEditProductModalOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <Edit2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {product.discount && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {product.discount}% off
                  </span>
                )}
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
                  {formatCurrency(product.monthlyTarget || 0)}
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
          <p className="text-sm text-gray-600 mb-6">Showing 5 from {totalReviews} Reviews</p>

          {/* Rating Summary */}
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
                      style={{ width: `${(product.ratingBreakdown[rating] / totalReviews) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">
                    {product.ratingBreakdown[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
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
          product={product}
          onSave={(updatedProduct) => {
            setProduct({ ...product, ...updatedProduct });
            setIsEditProductModalOpen(false);
          }}
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