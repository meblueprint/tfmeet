'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  Calendar,
  Users,
  Trophy,
  Settings,
  ChevronLeft,
} from 'lucide-react';

const settingsMenuItems = [
  {
    title: '运动会信息',
    href: '/settings/meet',
    icon: Calendar,
  },
  {
    title: '用户管理',
    href: '/settings/users',
    icon: Users,
  },
  {
    title: '班级管理',
    href: '/settings/classes',
    icon: Users,
  },
  {
    title: '项目管理',
    href: '/settings/events',
    icon: Trophy,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const { hasRole } = useAuth();

  if (!hasRole('super_admin')) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="border-b bg-white p-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              返回仪表盘
            </Button>
          </Link>
          <h1 className="text-2xl font-bold mt-2">系统设置</h1>
        </div>

        <div className="flex">
          <div className="w-56 border-r bg-gray-50/40">
            <ScrollArea className="h-[calc(100vh-120px)] p-4">
              <nav className="space-y-1">
                {settingsMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-2',
                          isActive &&
                            'bg-primary/10 text-primary hover:bg-primary/20'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>

          <div className="flex-1 p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
