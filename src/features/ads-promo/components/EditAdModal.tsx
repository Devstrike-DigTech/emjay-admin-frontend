import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useUpdateAd } from '@/features/ads-promo/hooks/useAds';
import { Ad, AdAppliesTo, AdStatus } from '@/features/ads-promo/types/ads-promo.types';

interface EditAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  ad: Pick<Ad, 'headline' | 'description' | 'imageUrl' | 'startDate' | 'endDate' | 'appliesTo' | 'status'>;
  onSaved: () => void;
}

export function EditAdModal({ isOpen, onClose, adId, ad, onSaved }: EditAdModalProps) {
  const updateAd = useUpdateAd();

  const [formData, setFormData] = useState({
    headline: ad.headline,
    description: ad.description,
    imageUrl: ad.imageUrl,
    startDate: ad.startDate,
    endDate: ad.endDate,
    appliesTo: ad.appliesTo as AdAppliesTo,
    status: ad.status as AdStatus,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAd.mutate(
      { id: adId, data: formData },
      {
        onSuccess: () => {
          onSaved();
        },
      }
    );
  };

  const handleClose = () => {
    setFormData({
      headline: ad.headline,
      description: ad.description,
      imageUrl: ad.imageUrl,
      startDate: ad.startDate,
      endDate: ad.endDate,
      appliesTo: ad.appliesTo as AdAppliesTo,
      status: ad.status as AdStatus,
    });
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Edit Ad</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Headline */}
          <div className="space-y-2">
            <Label htmlFor="headline" className="text-base font-semibold text-gray-900">
              Ad Headline
            </Label>
            <Input
              id="headline"
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-base font-semibold text-gray-900">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="h-12"
              placeholder="https://..."
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                Start Date
              </Label>
              <Input
                type="datetime-local"
                value={formData.startDate ? formData.startDate.slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                End Date
              </Label>
              <Input
                type="datetime-local"
                value={formData.endDate ? formData.endDate.slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="h-11"
              />
            </div>
          </div>

          {/* Applies To */}
          <div className="space-y-2">
            <Label htmlFor="appliesTo" className="text-sm font-semibold text-gray-900">
              Applies To
            </Label>
            <select
              id="appliesTo"
              value={formData.appliesTo}
              onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value as AdAppliesTo })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white h-11"
            >
              <option value="ALL">All</option>
              <option value="PRODUCTS">Products</option>
              <option value="SERVICES">Services</option>
              <option value="CATEGORIES">Categories</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-semibold text-gray-900">
              Status
            </Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AdStatus })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white h-11"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          {/* Error */}
          {updateAd.isError && (
            <p className="text-sm text-red-600">
              Failed to update ad. Please try again.
            </p>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12"
              disabled={updateAd.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-primary hover:bg-primary/90"
              disabled={updateAd.isPending}
            >
              {updateAd.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
