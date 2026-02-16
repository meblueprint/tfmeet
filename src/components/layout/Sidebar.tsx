'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Settings,
  Users,
  Calendar,
  Trophy,
  FileText,
  BarChart3,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { UserRole } from '@/types';

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    title: '仪表盘',
    href: '/',
    icon: LayoutDashboard,
    roles: ['super_admin', 'class_admin', 'student'],
  },
  {
    title: '运动会配置',
    href: '/settings/meet',
    icon: Settings,
    roles: ['super_admin'],
  },
  {
    title: '用户管理',
    href: '/settings/users',
    icon: Users,
    roles: ['super_admin'],
  },
  {
    title: '班级管理',
    href: '/settings/classes',
    icon: Users,
    roles: ['super_admin'],
  },
  {
    title: '项目管理',
    href: '/settings/events',
    icon: Trophy,
    roles: ['super_admin'],
  },
  {
    title: '报名管理',
    href: '/registration',
    icon: FileText,
    roles: ['super_admin', 'class_admin'],
  },
  {
    title: '赛程管理',
    href: '/schedule',
    icon: Calendar,
    roles: ['super_admin', 'class_admin', 'student'],
  },
  {
    title: '成绩管理',
    href: '/results',
    icon: Trophy,
    roles: ['super_admin', 'class_admin'],
  },
  {
    title: '奖状管理',
    href: '/certificates',
    icon: Trophy,
    roles: ['super_admin', 'class_admin', 'student'],
  },
  {
    title: '数据统计',
    href: '/statistics',
    icon: BarChart3,
    roles: ['super_admin', 'class_admin'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, hasRole } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gray-50/40">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">运动会管理</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems
            .filter((item) => hasRole(item.roles))
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-2',
                      isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
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

      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.role === 'super_admin' && '超级管理员'}
              {user?.role === 'class_admin' && '班级管理员'}
              {user?.role === 'student' && '学生'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-3 w-full justify-start gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>退出登录</span>
        </Button>
      </div>
    </div>
  );
}
