import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Calendar,
  DollarSign, 
  MessageSquare, 
  Users,
  Megaphone,
  Settings
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Ads & Promo', href: '/ads-promo', icon: Megaphone },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'Contact Us', href: '/contact', icon: Settings },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare },
  { name: 'Staff', href: '/staff', icon: Users },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold text-primary">Emjay</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
