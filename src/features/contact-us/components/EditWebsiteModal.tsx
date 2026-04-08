import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { WebsiteInfoData } from '../api/settings.api';

interface EditWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteInfo: WebsiteInfoData;
  onSave: (data: Partial<WebsiteInfoData>) => void;
}

export function EditWebsiteModal({ isOpen, onClose, websiteInfo, onSave }: EditWebsiteModalProps) {
  const [formData, setFormData] = useState<WebsiteInfoData>({
    dateStarted: websiteInfo.dateStarted,
    lastMaintenance: websiteInfo.lastMaintenance,
    developerCompany: websiteInfo.developerCompany,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      dateStarted: websiteInfo.dateStarted,
      lastMaintenance: websiteInfo.lastMaintenance,
      developerCompany: websiteInfo.developerCompany,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Edit Website Info</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="dateStarted">Date Started</Label>
            <Input
              id="dateStarted"
              value={formData.dateStarted ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, dateStarted: e.target.value || null })
              }
              placeholder="e.g., 30th March, 2025"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastMaintenance">Last Maintenance Date</Label>
            <Input
              id="lastMaintenance"
              value={formData.lastMaintenance ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, lastMaintenance: e.target.value || null })
              }
              placeholder="e.g., 1st April, 2025"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="developerCompany">Developer Company</Label>
            <Input
              id="developerCompany"
              value={formData.developerCompany ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, developerCompany: e.target.value || null })
              }
              className="h-12"
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
