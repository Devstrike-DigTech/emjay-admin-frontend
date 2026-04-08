import { apiClient } from '@/shared/lib/api-client';
import { Appointment } from '@/shared/lib/services-mock-api';

/** Raw booking summary from GET /api/v1/bookings/admin */
export interface BackendBookingSummary {
  id: string;
  bookingNumber: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;   // LocalDate serialised as "YYYY-MM-DD"
  startTime: string;     // LocalTime serialised as "HH:mm:ss"
  endTime: string;       // LocalTime serialised as "HH:mm:ss"
  durationMinutes: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  totalAmount: number;
  isPaid: boolean;
}

export interface BackendBookingListResponse {
  content: BackendBookingSummary[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/** Map a LocalTime string ("HH:mm:ss") to "HH:mm" */
function toHHMM(timeStr: string): string {
  return timeStr?.substring(0, 5) ?? '';
}

/** Map a placeholder avatar using booking number as seed */
function placeholderAvatar(seed: string): string {
  const num = (seed.charCodeAt(seed.length - 1) % 70) + 1;
  return `https://i.pravatar.cc/150?img=${num}`;
}

function mapBooking(b: BackendBookingSummary): Appointment {
  return {
    id: b.id,
    date: b.bookingDate,                        // already "YYYY-MM-DD"
    startTime: toHHMM(b.startTime),
    endTime: toHHMM(b.endTime),
    service: b.serviceName,                     // "Service" until fully implemented
    customerName: `Booking #${b.bookingNumber}`,
    customerAvatar: placeholderAvatar(b.bookingNumber),
    status: b.status,
  };
}

export const bookingsApi = {
  getAdminBookings: async (
    page = 0,
    size = 100,
    status?: string
  ): Promise<Appointment[]> => {
    const params: Record<string, unknown> = { page, size };
    if (status) params.status = status;
    const raw = await apiClient.get<BackendBookingListResponse>('/bookings/admin', { params });
    const list = raw as unknown as BackendBookingListResponse;
    return (list.content ?? []).map(mapBooking);
  },
};
