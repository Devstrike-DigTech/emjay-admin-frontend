import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Appointment } from '@/shared/lib/services-mock-api';

interface CalendarProps {
  appointments: Appointment[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function Calendar({ appointments, currentDate, onDateChange, onAppointmentClick }: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Month navigation
  const goToPreviousMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month's days (grayed out)
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonthDays - i,
      isCurrentMonth: false,
      fullDate: new Date(year, month - 1, prevMonthDays - i),
    });
  }

  // Current month's days
  for (let date = 1; date <= daysInMonth; date++) {
    calendarDays.push({
      date,
      isCurrentMonth: true,
      fullDate: new Date(year, month, date),
    });
  }

  // Next month's days to fill the grid
  const remainingDays = 42 - calendarDays.length; // 6 weeks * 7 days
  for (let date = 1; date <= remainingDays; date++) {
    calendarDays.push({
      date,
      isCurrentMonth: false,
      fullDate: new Date(year, month + 1, date),
    });
  }

  // Get appointments for a specific date
  const getAppointmentsForDate = (fullDate: Date) => {
    const dateStr = fullDate.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  // Format month/year
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const monthYear = `${monthNames[month]} ${year}`;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{monthYear}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day.fullDate);
            const isToday = day.fullDate.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={cn(
                  'min-h-[100px] p-2 border rounded-lg transition-colors',
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  'hover:border-primary/50'
                )}
              >
                {/* Date Number */}
                <div
                  className={cn(
                    'text-sm font-medium mb-2',
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                    isToday && 'text-primary font-bold'
                  )}
                >
                  {day.date}
                </div>

                {/* Appointments */}
                <div className="space-y-1">
                  {dayAppointments.map((appointment) => (
                    <button
                      key={appointment.id}
                      onClick={() => onAppointmentClick?.(appointment)}
                      className={cn(
                        'w-full text-left p-2 rounded-md text-xs transition-all hover:shadow-md',
                        'border-l-4',
                        appointment.service === 'Hair' && 'bg-blue-50 border-blue-500',
                        appointment.service === 'Make Up' && 'bg-pink-50 border-pink-500',
                        appointment.service === 'Nails' && 'bg-purple-50 border-purple-500'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={appointment.customerAvatar}
                          alt={appointment.customerName}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="font-medium text-gray-900 truncate">
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </div>
                      <div className="text-gray-700 font-medium">{appointment.service}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}