import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { EditAccountModal } from '@/features/contact-us/components/EditAccountModal';
import { EditContactModal } from '@/features/contact-us/components/EditContactModal';
import { EditWebsiteModal } from '@/features/contact-us/components/EditWebsiteModal';
import {
  useStoreAccount,
  useContactInfo,
  useWebsiteInfo,
  useUpdateStoreAccount,
  useUpdateContactInfo,
  useUpdateWebsiteInfo,
} from '@/features/contact-us/hooks/useSettings';
import { StoreAccountData, ContactInfoData, WebsiteInfoData } from '@/features/contact-us/api/settings.api';

function nullToDisplay(value: string | null | undefined): string {
  return value ?? '—';
}

export default function ContactUsPage() {
  const { data: storeAccount, isLoading: isLoadingStore } = useStoreAccount();
  const { data: contactInfo, isLoading: isLoadingContact } = useContactInfo();
  const { data: websiteInfo, isLoading: isLoadingWebsite } = useWebsiteInfo();

  const updateStoreAccount = useUpdateStoreAccount();
  const updateContactInfo = useUpdateContactInfo();
  const updateWebsiteInfo = useUpdateWebsiteInfo();

  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isEditWebsiteOpen, setIsEditWebsiteOpen] = useState(false);

  const isLoading = isLoadingStore || isLoadingContact || isLoadingWebsite;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-l font-bold text-gray-900">
            Hey Emjay 👋 <span className="text-sm font-normal text-gray-600">- here's what's happing on your store today</span>
          </h1>
        </div>

        {/* Settings Banner */}
        <div className="relative mb-8 rounded-lg overflow-hidden h-32">
          {/* Gradient Background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #8B4513 0%, #6B1B3D 50%, #4B0082 100%)',
            }}
          />

          {/* Diagonal Stripes Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
              )`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Settings</h2>
            <p className="text-sm opacity-90">Manage your account, notifications, and privacy preferences.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Account Section */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Account</h3>
                <button
                  onClick={() => setIsEditAccountOpen(true)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Store Name</p>
                  <p className="text-base font-medium text-gray-900">
                    {nullToDisplay(storeAccount?.storeName)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Store Description</p>
                  <p className="text-base font-medium text-gray-900">
                    {nullToDisplay(storeAccount?.storeDescription)}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Contact</h3>
                <button
                  onClick={() => setIsEditContactOpen(true)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-base font-medium text-gray-900">
                    {nullToDisplay(contactInfo?.contactEmail)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="text-base font-medium text-gray-900">
                    {nullToDisplay(contactInfo?.contactPhone)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="text-base font-medium text-gray-900">
                    {nullToDisplay(contactInfo?.address)}
                  </p>
                </div>
              </div>
            </div>

            {/* About Website Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">About Website</h3>
                <button
                  onClick={() => setIsEditWebsiteOpen(true)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date Started</p>
                  <p className="text-base font-medium text-gray-900">
                    {nullToDisplay(websiteInfo?.dateStarted)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Maintenance Date</p>
                  <p className="text-base font-medium text-gray-900">
                    {nullToDisplay(websiteInfo?.lastMaintenance)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Developer Company</p>
                  <p className="text-base font-medium text-gray-900">
                    {nullToDisplay(websiteInfo?.developerCompany)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Edit Modals — only rendered when data is available */}
        {storeAccount && (
          <EditAccountModal
            isOpen={isEditAccountOpen}
            onClose={() => setIsEditAccountOpen(false)}
            accountInfo={storeAccount}
            onSave={(data: Partial<StoreAccountData>) => {
              updateStoreAccount.mutate(data, {
                onSuccess: () => setIsEditAccountOpen(false),
              });
            }}
          />
        )}

        {contactInfo && (
          <EditContactModal
            isOpen={isEditContactOpen}
            onClose={() => setIsEditContactOpen(false)}
            contactInfo={contactInfo}
            onSave={(data: Partial<ContactInfoData>) => {
              updateContactInfo.mutate(data, {
                onSuccess: () => setIsEditContactOpen(false),
              });
            }}
          />
        )}

        {websiteInfo && (
          <EditWebsiteModal
            isOpen={isEditWebsiteOpen}
            onClose={() => setIsEditWebsiteOpen(false)}
            websiteInfo={websiteInfo}
            onSave={(data: Partial<WebsiteInfoData>) => {
              updateWebsiteInfo.mutate(data, {
                onSuccess: () => setIsEditWebsiteOpen(false),
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
