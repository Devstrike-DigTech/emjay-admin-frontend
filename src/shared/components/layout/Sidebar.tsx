import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Megaphone,
  DollarSign, 
  MessageSquare, 
  Users,
  Settings,
  PanelLeftClose,
  PanelLeft,
  X
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

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 flex flex-col transition-all duration-300 mt-16 bg-white border-r border-gray-200 z-50",
          // Mobile styles
          "lg:hidden",
          isMobileOpen ? "left-0 w-64" : "-left-64",
        )}
      >
        <div className="flex grow flex-col overflow-y-auto">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <span className="text-sm font-semibold text-gray-900">Menu</span>
            <button
              onClick={onMobileClose}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col px-3 py-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={onMobileClose}
                      className={cn(
                        isActive
                          ? 'bg-[#F5E6EC] text-primary border-r-4 border-primary'
                          : 'text-gray-600 hover:bg-gray-50',
                        'group flex items-center gap-x-3 rounded-l-md p-3 text-sm font-medium transition-colors relative'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-primary' : 'text-gray-400',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 mt-16 bg-white border-r border-gray-200",
          isCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className="flex grow flex-col overflow-y-auto">
          {/* Toggle Button - Desktop only */}
          <div className={cn(
            "flex items-center p-4 border-b border-gray-200",
            isCollapsed ? "justify-center" : "justify-end"
          )}>
            <button
              onClick={onToggle}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation - Desktop */}
          <nav className="flex flex-1 flex-col px-3 py-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-[#F5E6EC] text-primary border-r-4 border-primary'
                          : 'text-gray-600 hover:bg-gray-50',
                        'group flex items-center gap-x-3 rounded-l-md p-3 text-sm font-medium transition-colors relative',
                        isCollapsed && 'justify-center'
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-primary' : 'text-gray-400',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {!isCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}