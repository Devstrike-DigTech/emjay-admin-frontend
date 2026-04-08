import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings.api';

export function useAdminBookings(status?: string) {
  return useQuery({
    queryKey: ['bookings', 'admin', status ?? 'all'],
    queryFn: () => bookingsApi.getAdminBookings(0, 200, status),
    staleTime: 60_000, // refresh every minute
  });
}
