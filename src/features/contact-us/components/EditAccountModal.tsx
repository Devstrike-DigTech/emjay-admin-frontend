import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { StoreAccountData } from '../api/settings.api';

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountInfo: StoreAccountData;
  onSave: (data: Partial<StoreAccountData>) => void;
}

export function EditAccountModal({ isOpen, onClose, accountInfo, onSave }: EditAccountModalProps) {
  const [formData, setFormData] = useState<StoreAccountData>({
    storeName: accountInfo.storeName,
    storeDescription: accountInfo.storeDescription,
    logoUrl: accountInfo.logoUrl,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      storeName: accountInfo.storeName,
      storeDescription: accountInfo.storeDescription,
      logoUrl: accountInfo.logoUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Edit Account</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeDescription">Store Description</Label>
            <textarea
              id="storeDescription"
              value={formData.storeDescription ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, storeDescription: e.target.value || null })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={formData.logoUrl ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value || null })
              }
              className="h-12"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 h-12">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-12 bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
