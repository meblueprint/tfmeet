'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storage } from '@/lib/storage';
import { Users, Trophy, Calendar, Award, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalResults: 0,
    totalCertificates: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 加载统计数据
    const classes = storage.getClasses();
    const students = storage.getStudents();
    const events = storage.getEvents();
    const registrations = storage.getRegistrations();
    const results = storage.getResults();
    const certificates = storage.getCertificates();

    setStats({
      totalClasses: classes.length,
      totalStudents: students.length,
      totalEvents: events.length,
      totalRegistrations: registrations.filter(r => r.status === 'approved').length,
      totalResults: results.length,
      totalCertificates: certificates.length,
    });
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="border-b bg-white p-6">
          <h1 className="text-2xl font-bold">
            欢迎回来，{user?.name}！
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'super_admin' && '系统超级管理员'}
            {user?.role === 'class_admin' && `班级管理员 - ${user?.className}`}
            {user?.role === 'student' && `学生 - ${user?.className}`}
          </p>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">数据概览</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  参赛班级
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClasses}</div>
                <p className="text-xs text-muted-foreground">
                  个班级参与
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  参赛学生
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  名学生报名
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  比赛项目
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  个比赛项目
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  有效报名
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalRegistrations}
                </div>
                <p className="text-xs text-muted-foreground">
                  条报名记录
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  已录入成绩
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalResults}</div>
                <p className="text-xs text-muted-foreground">
                  条成绩记录
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  已生成奖状
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalCertificates}
                </div>
                <p className="text-xs text-muted-foreground">
                  张奖状
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">快速开始</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {user?.role === 'super_admin' && (
                    <>
                      <QuickAction
                        title="配置运动会"
                        description="设置运动会基本信息"
                        href="/settings/meet"
                        color="blue"
                      />
                      <QuickAction
                        title="管理班级"
                        description="添加和管理参赛班级"
                        href="/settings/classes"
                        color="green"
                      />
                      <QuickAction
                        title="管理项目"
                        description="添加和管理比赛项目"
                        href="/settings/events"
                        color="purple"
                      />
                      <QuickAction
                        title="数据统计"
                        description="查看详细统计数据"
                        href="/statistics"
                        color="orange"
                      />
                    </>
                  )}

                  {user?.role === 'class_admin' && (
                    <>
                      <QuickAction
                        title="班级报名"
                        description="为本班学生报名参赛"
                        href="/registration"
                        color="blue"
                      />
                      <QuickAction
                        title="录入成绩"
                        description="录入本班学生成绩"
                        href="/results"
                        color="green"
                      />
                      <QuickAction
                        title="查看赛程"
                        description="查看比赛赛程安排"
                        href="/schedule"
                        color="purple"
                      />
                      <QuickAction
                        title="生成奖状"
                        description="为获奖学生生成奖状"
                        href="/certificates"
                        color="orange"
                      />
                    </>
                  )}

                  {user?.role === 'student' && (
                    <>
                      <QuickAction
                        title="我的成绩"
                        description="查看我的比赛成绩"
                        href="/results"
                        color="blue"
                      />
                      <QuickAction
                        title="查看赛程"
                        description="查看比赛赛程安排"
                        href="/schedule"
                        color="green"
                      />
                      <QuickAction
                        title="我的奖状"
                        description="查看和保存我的奖状"
                        href="/certificates"
                        color="purple"
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  description,
  href,
  color,
}: {
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'hover:bg-blue-50 hover:border-blue-200',
    green: 'hover:bg-green-50 hover:border-green-200',
    purple: 'hover:bg-purple-50 hover:border-purple-200',
    orange: 'hover:bg-orange-50 hover:border-orange-200',
  };

  return (
    <a
      href={href}
      className={`block rounded-lg border bg-white p-4 transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </a>
  );
}
