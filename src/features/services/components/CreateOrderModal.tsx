import { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectOption } from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData) => void;
  services: SelectOption[];
  subcategories: SelectOption[];
}

export interface OrderFormData {
  // Step 1: Service Details
  serviceName: string;
  subcategoryId: string;
  
  // Step 2: Client Details
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  
  // Step 3: Date and Time
  date: string;
  time: string;
}

type Step = 1 | 2 | 3;

export function CreateOrderModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  services, 
  subcategories 
}: CreateOrderModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<OrderFormData>({
    serviceName: '',
    subcategoryId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    date: '',
    time: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});

  if (!isOpen) return null;

  const updateField = (field: keyof OrderFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};
    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service name is required';
    }
    if (!formData.subcategoryId) {
      newErrors.subcategoryId = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Invalid email format';
    }
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleFinish = () => {
    if (validateStep3()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      serviceName: '',
      subcategoryId: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      date: '',
      time: '',
    });
    setErrors({});
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create an Order for a Client</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors',
                    step < currentStep && 'bg-primary text-white',
                    step === currentStep && 'bg-primary text-white',
                    step > currentStep && 'bg-white text-gray-400 border-2 border-gray-300'
                  )}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={cn(
                      'w-32 h-0.5 mx-2',
                      step < currentStep ? 'bg-primary' : 'bg-gray-300 border-dashed border-t-2'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Service Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary">Service Details</h3>
              
              <div className="space-y-2">
                <Label className="text-base font-semibold">Service Name</Label>
                <Select
                  options={services}
                  value={formData.serviceName}
                  onChange={(value) => updateField('serviceName', value)}
                  placeholder="Enter the Name of the Product"
                  error={!!errors.serviceName}
                  className="h-12"
                />
                {errors.serviceName && (
                  <p className="text-sm text-red-600">{errors.serviceName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">Service Sub-category Name</Label>
                <Select
                  options={subcategories}
                  value={formData.subcategoryId}
                  onChange={(value) => updateField('subcategoryId', value)}
                  placeholder="Select the Category ot belongs to or create a new one"
                  error={!!errors.subcategoryId}
                  className="h-12"
                />
                {errors.subcategoryId && (
                  <p className="text-sm text-red-600">{errors.subcategoryId}</p>
                )}
              </div>

              <Button
                onClick={handleNext}
                className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                Next Step
              </Button>
            </div>
          )}

          {/* Step 2: Client Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary">Client Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-base font-semibold">Name</Label>
                <Input
                  id="clientName"
                  type="text"
                  placeholder="Enter Client Name"
                  value={formData.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  className={cn('h-12', errors.clientName && 'border-red-500')}
                />
                {errors.clientName && (
                  <p className="text-sm text-red-600">{errors.clientName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="text-base font-semibold">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="Select the Category ot belongs to or create a new one"
                  value={formData.clientEmail}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                  className={cn('h-12', errors.clientEmail && 'border-red-500')}
                />
                {errors.clientEmail && (
                  <p className="text-sm text-red-600">{errors.clientEmail}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone" className="text-base font-semibold">Phone Number</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  placeholder="Select the Category ot belongs to or create a new one"
                  value={formData.clientPhone}
                  onChange={(e) => updateField('clientPhone', e.target.value)}
                  className={cn('h-12', errors.clientPhone && 'border-red-500')}
                />
                {errors.clientPhone && (
                  <p className="text-sm text-red-600">{errors.clientPhone}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 h-14 text-base font-semibold"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 h-14 text-base font-semibold bg-primary hover:bg-primary/90"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Date and Time */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary">Date and Time</h3>
              
              <div className="space-y-2">
                <Label htmlFor="date" className="text-base font-semibold">Date</Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className={cn('h-12 pr-12', errors.date && 'border-red-500')}
                  />
                  <CalendarIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                </div>
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-base font-semibold">Time</Label>
                <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateField('time', e.target.value)}
                    className={cn('h-12 pr-12', errors.time && 'border-red-500')}
                  />
                  <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                </div>
                {errors.time && (
                  <p className="text-sm text-red-600">{errors.time}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 h-14 text-base font-semibold"
                >
                  Back
                </Button>
                <Button
                  onClick={handleFinish}
                  className="flex-1 h-14 text-base font-semibold bg-primary hover:bg-primary/90"
                >
                  Finish
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}