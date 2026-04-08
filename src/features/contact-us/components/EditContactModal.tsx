import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ContactInfoData } from '../api/settings.api';

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo: ContactInfoData;
  onSave: (data: Partial<ContactInfoData>) => void;
}

export function EditContactModal({ isOpen, onClose, contactInfo, onSave }: EditContactModalProps) {
  const [formData, setFormData] = useState<ContactInfoData>({
    contactEmail: contactInfo.contactEmail,
    contactPhone: contactInfo.contactPhone,
    address: contactInfo.address,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      contactEmail: contactInfo.contactEmail,
      contactPhone: contactInfo.contactPhone,
      address: contactInfo.address,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Edit Contact</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value || null })
              }
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, contactPhone: e.target.value || null })
              }
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              value={formData.address ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value || null })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
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
