import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { EditAdModal } from '@/features/ads-promo/components/EditAdModal';
import { useAd, useDeleteAd } from '@/features/ads-promo/hooks/useAds';

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

export default function AdDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: adResponse, isLoading, isError } = useAd(id ?? '');
  const deleteAd = useDeleteAd();

  const ad = adResponse;

  const handleDelete = () => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this ad?')) {
      deleteAd.mutate(id, {
        onSuccess: () => {
          navigate('/ads-promo');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !ad) {
    return <div className="p-6 text-gray-600">Ad not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ad.headline}</h1>
              <p className="text-sm text-gray-600 mt-1">Created on {formatDate(ad.createdAt)}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={deleteAd.isPending}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteAd.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            ad.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : ad.status === 'SCHEDULED'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {ad.status}
          </span>
        </div>

        {/* Ad Image */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ad Image</h2>
          <img
            src={ad.imageUrl}
            alt={ad.headline}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Ad Details */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ad Details</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
              <p className="text-gray-900">{ad.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Start Date</p>
                <p className="text-gray-900">{formatDate(ad.startDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">End Date</p>
                <p className="text-gray-900">{formatDate(ad.endDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Applies To</p>
                <p className="text-gray-900">{ad.appliesTo}</p>
              </div>
              {ad.createdBy && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Created By</p>
                  <p className="text-gray-900">{ad.createdBy}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <EditAdModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          adId={id ?? ''}
          ad={ad}
          onSaved={() => setIsEditModalOpen(false)}
        />
      </div>
    </div>
  );
}
