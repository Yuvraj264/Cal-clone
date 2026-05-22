import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Clock,
  Settings,
  Link as LinkIcon,
  BookOpen,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Event Types', href: '/event-types', icon: LinkIcon },
    { name: 'Availability', href: '/availability', icon: Clock },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col w-64 bg-white dark:bg-black border-r border-gray-150 dark:border-gray-800/80 h-screen sticky top-0',
        className
      )}
    >
      {/* Sidebar Header Brand Logo */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-gray-150 dark:border-gray-800/80">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black">
          <BookOpen className="w-4 h-4 font-bold" />
        </div>
        <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
          CalClone
        </span>
      </div>

      {/* Navigation Panel */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-150',
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/40'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Branding or Settings */}
      <div className="p-4 border-t border-gray-150 dark:border-gray-800/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
          U
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
            User Account
          </p>
          <p className="text-[10px] text-gray-500 truncate">
            host@calclone.com
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
