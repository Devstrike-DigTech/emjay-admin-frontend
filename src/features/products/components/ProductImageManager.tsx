import { useState, useRef } from 'react';
import { Star, Trash2, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { productsApi } from '@/features/products/api/products.api';
import { ProductImageInfo } from '@/features/products/types/product.types';

interface ProductImageManagerProps {
  productId: string;
  initialImages: ProductImageInfo[];
}

export function ProductImageManager({ productId, initialImages }: ProductImageManagerProps) {
  const [images, setImages] = useState<ProductImageInfo[]>(
    [...initialImages].sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return a.displayOrder - b.displayOrder;
    })
  );
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedImage = images[selectedIdx] ?? null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      // First image uploaded becomes the primary automatically
      const isFirstImage = images.length === 0;
      await productsApi.uploadImage(productId, file, isFirstImage);
      // Refresh from server to get accurate state (correct displayOrder, etc.)
      const fresh = await productsApi.getImages(productId);
      const sorted = [...fresh].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.displayOrder - b.displayOrder;
      });
      setImages(sorted);
      setSelectedIdx(sorted.length - 1);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    setError(null);
    setSettingPrimary(imageId);
    try {
      await productsApi.setPrimaryImage(productId, imageId);
      setImages((prev) =>
        prev.map((img) => ({ ...img, isPrimary: img.id === imageId }))
      );
    } catch {
      setError('Could not set primary image. Please try again.');
    } finally {
      setSettingPrimary(null);
    }
  };

  const handleDelete = async (imageId: string) => {
    setError(null);
    setDeleting(imageId);
    try {
      await productsApi.deleteImage(productId, imageId);
      const next = images.filter((img) => img.id !== imageId);
      setImages(next);
      setSelectedIdx((prev) => (prev >= next.length ? Math.max(0, next.length - 1) : prev));
    } catch {
      setError('Could not delete image. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Main image */}
      <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-square">
        {selectedImage ? (
          <>
            <img
              src={selectedImage.imageUrl}
              alt="Product"
              className="w-full h-full object-cover"
            />
            {selectedImage.isPrimary && (
              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
                <Star className="w-3 h-3 fill-white" />
                Primary
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <Plus className="w-8 h-8" />
            <span className="text-sm">No images yet</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {images.map((image, idx) => (
            <div key={image.id} className="relative group">
              <button
                onClick={() => setSelectedIdx(idx)}
                className={cn(
                  'w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors',
                  selectedIdx === idx ? 'border-primary' : 'border-gray-200 hover:border-gray-400'
                )}
              >
                <img
                  src={image.imageUrl}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Primary star badge */}
              {image.isPrimary && (
                <div className="absolute top-1 left-1 bg-primary rounded-full p-0.5 pointer-events-none">
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                </div>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {!image.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(image.id)}
                    disabled={settingPrimary === image.id}
                    title="Set as primary"
                    className="p-1 bg-white/95 rounded-full hover:bg-white transition-colors"
                  >
                    {settingPrimary === image.id ? (
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    ) : (
                      <Star className="w-3 h-3 text-primary" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(image.id)}
                  disabled={deleting === image.id}
                  title="Delete image"
                  className="p-1 bg-white/95 rounded-full hover:bg-white transition-colors"
                >
                  {deleting === image.id ? (
                    <Loader2 className="w-3 h-3 animate-spin text-red-500" />
                  ) : (
                    <Trash2 className="w-3 h-3 text-red-500" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 mb-2 text-center">{error}</p>
      )}

      {/* Upload button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleUpload}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Add Image
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center mt-1.5">
        JPEG, PNG, WEBP · max 5 MB · hover thumbnail to set primary or delete
      </p>
    </div>
  );
}
