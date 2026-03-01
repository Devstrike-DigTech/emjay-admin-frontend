import { X, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {Appointment} from '@/shared/lib/services-mock-api'

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export function AppointmentModal({ isOpen, onClose, appointment }: AppointmentModalProps) {
  if (!isOpen || !appointment) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="flex items-center gap-4">
            <img
              src={appointment.customerAvatar}
              alt={appointment.customerName}
              className="w-16 h-16 rounded-full border-2 border-gray-200"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{appointment.customerName}</h3>
              <p className="text-sm text-gray-600">Customer</p>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Service</p>
                <p className="text-base font-semibold text-gray-900">{appointment.service}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-base font-semibold text-gray-900">{formatDate(appointment.date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p className="text-base font-semibold text-gray-900">
                  {appointment.startTime} - {appointment.endTime}
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Confirmed
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Edit Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}