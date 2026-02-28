import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/shared/store/auth.store';
import { Button } from '@/shared/components/ui/button';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Search */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search for anything"
            className="block h-10 w-full rounded-md border-0 bg-gray-50 py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Notification Button */}
        <button
          type="button"
          className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
        </button>

        {/* Profile dropdown */}
        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-x-3 cursor-pointer">
            <img
              className="h-8 w-8 rounded-full bg-gray-200"
              src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=6B1B3D&color=fff`}
              alt=""
            />
            <div className="hidden lg:block">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs leading-5 text-gray-500">{user?.email}</p>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
