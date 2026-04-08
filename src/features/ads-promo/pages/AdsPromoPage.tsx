import { useState } from 'react';
import { Search, Filter as FilterIcon, ArrowUpDown, Plus, Grid3x3, List, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useAds } from '@/features/ads-promo/hooks/useAds';
import { usePromotions } from '@/features/ads-promo/hooks/usePromotions';
import { useBundles } from '@/features/ads-promo/hooks/useBundles';

type TabMode = 'ads' | 'promo' | 'bundles';
type ViewMode = 'grid' | 'list';

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export default function AdsPromoPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabMode>('ads');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const { data: adsResponse, isLoading: adsLoading } = useAds();
  const { data: promosResponse, isLoading: promosLoading } = usePromotions();
  const { data: bundlesResponse, isLoading: bundlesLoading } = useBundles();

  const ads = adsResponse ?? [];
  const promos = promosResponse ?? [];
  const bundles = bundlesResponse ?? [];

  const isLoading =
    (activeTab === 'ads' && adsLoading) ||
    (activeTab === 'promo' && promosLoading) ||
    (activeTab === 'bundles' && bundlesLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
             <h1 className="text-l font-bold text-gray-900">
  Hey Emjay 👋 <span className="text-sm font-normal text-gray-600">- here's what's happing on your store today</span>
</h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('ads')}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-semibold transition-colors',
              activeTab === 'ads'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            )}
          >
            Ads
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-semibold transition-colors',
              activeTab === 'promo'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            )}
          >
            Promo
          </button>
          <button
            onClick={() => setActiveTab('bundles')}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-semibold transition-colors',
              activeTab === 'bundles'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            )}
          >
            Bundles
          </button>
        </div>

        {/* Ads Tab */}
        {activeTab === 'ads' && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Ads</h2>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded transition-colors',
                      viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    )}
                  >
                    <Grid3x3 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded transition-colors',
                      viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    )}
                  >
                    <List className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search.."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-48"
                  />
                </div>

                <Button variant="outline" size="sm">
                  <FilterIcon className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort
                </Button>

                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/ads-promo/create-ad')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create an Ad
                </Button>
              </div>
            </div>

            {/* Ads Grid */}
            {ads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-lg font-medium">No ads yet</p>
                <p className="text-sm mt-1">Create your first ad to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/ads-promo/ad/${ad.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={ad.imageUrl}
                        alt={ad.headline}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{ad.headline}</h3>
                      <p className="text-xs text-gray-600 mb-3 flex items-center gap-2">
                        <span className="text-red-500">📅</span>
                        From {formatDate(ad.startDate)} - To {formatDate(ad.endDate)}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-3">{ad.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Promo Tab */}
        {activeTab === 'promo' && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Promos</h2>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded transition-colors',
                      viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    )}
                  >
                    <Grid3x3 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded transition-colors',
                      viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    )}
                  >
                    <List className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search.."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-48"
                  />
                </div>

                <Button variant="outline" size="sm">
                  <FilterIcon className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort
                </Button>

                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/ads-promo/create-promo')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create an Ad
                </Button>
              </div>
            </div>

            {/* Promos Grid */}
            {promos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-lg font-medium">No promos yet</p>
                <p className="text-sm mt-1">Create your first promotion to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {promos.map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/ads-promo/promo/${promo.id}`)}
                  >
                    <div className="relative">
                      {promo.code && (
                        <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded text-sm font-semibold z-10">
                          {promo.discountValue}
                          {promo.discountType === 'PERCENTAGE' ? '%' : ' NGN'} Off
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 z-10"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Promo</span>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">{promo.name}</h3>
                      {promo.code && (
                        <p className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                          {promo.code}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {promo.currentUses} / {promo.maxUses} uses
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(promo.startDate)} – {formatDate(promo.endDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bundles Tab */}
        {activeTab === 'bundles' && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Bundles</h2>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded transition-colors',
                      viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    )}
                  >
                    <Grid3x3 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded transition-colors',
                      viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    )}
                  >
                    <List className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search.."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-48"
                  />
                </div>

                <Button variant="outline" size="sm">
                  <FilterIcon className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort
                </Button>

                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/ads-promo/create-bundle')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Bundle
                </Button>
              </div>
            </div>

            {/* Bundles Grid */}
            {bundles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-lg font-medium">No bundles yet</p>
                <p className="text-sm mt-1">Create your first bundle to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bundles.map((bundle) => {
                  const savingsPercentage =
                    bundle.originalPrice > 0
                      ? Math.round((bundle.savingsAmount / bundle.originalPrice) * 100)
                      : 0;

                  return (
                    <div
                      key={bundle.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/ads-promo/bundle/${bundle.id}`)}
                    >
                      <div className="relative">
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Bundle</span>
                        </div>
                        {/* Savings Badge */}
                        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                          Save {savingsPercentage}%
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{bundle.name}</h3>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-xl font-bold text-primary">
                            NGN {bundle.bundlePrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            NGN {bundle.originalPrice.toLocaleString()}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📦 {bundle.productIds.length} Products</p>
                          <p>
                            {bundle.discountType === 'PERCENTAGE' ? '📊 Percentage' : '💰 Fixed Amount'} Discount
                          </p>
                          <p className="text-xs text-gray-500">
                            📅 {formatDate(bundle.startDate)} - {formatDate(bundle.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
