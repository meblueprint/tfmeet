'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { Result, Class, ClassScore, Event, Registration } from '@/types';
import { BarChart3, Trophy, Download, RefreshCw, TrendingUp, Medal } from 'lucide-react';

export default function StatisticsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [classScores, setClassScores] = useState<ClassScore[]>([]);
  const [eventStats, setEventStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = () => {
    setIsLoading(true);

    const results = storage.getResults();
    const classes = storage.getClasses();
    const events = storage.getEvents();
    const registrations = storage.getRegistrations();

    // 计算班级总分
    const scores: ClassScore[] = classes.map(cls => {
      const classResults = results.filter(r => r.classId === cls.id);
      const totalPoints = classResults.reduce((sum, r) => sum + r.points, 0);
      const goldMedals = classResults.filter(r => r.rank === 1).length;
      const silverMedals = classResults.filter(r => r.rank === 2).length;
      const bronzeMedals = classResults.filter(r => r.rank === 3).length;

      return {
        classId: cls.id,
        className: cls.name,
        totalPoints,
        goldMedals,
        silverMedals,
        bronzeMedals,
      };
    });

    // 按总分排序
    scores.sort((a, b) => b.totalPoints - a.totalPoints);
    setClassScores(scores);

    // 计算项目统计
    const eventStatList = events.map(event => {
      const eventResults = results.filter(r => r.eventId === event.id);
      const eventRegistrations = registrations.filter(r => r.eventId === event.id && r.status === 'approved');
      const participationRate = eventRegistrations.length > 0
        ? ((eventResults.length / eventRegistrations.length) * 100).toFixed(1)
        : '0';

      return {
        eventId: event.id,
        eventName: event.name,
        eventCategory: event.category,
        totalParticipants: eventRegistrations.length,
        completedCount: eventResults.length,
        participationRate: `${participationRate}%`,
      };
    });

    setEventStats(eventStatList);
    setIsLoading(false);
  };

  // 导出班级总分排名
  const exportClassScores = () => {
    const headers = ['排名', '班级', '总分', '金牌', '银牌', '铜牌'];
    const rows = classScores.map((score, index) => [
      index + 1,
      score.className,
      score.totalPoints,
      score.goldMedals,
      score.silverMedals,
      score.bronzeMedals,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `班级总分排名_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    storage.addLog({
      userId: user?.id || '',
      userName: user?.name || '',
      action: '导出',
      target: '班级总分排名',
      details: '导出班级总分排名数据',
    });

    toast.success('导出成功！');
  };

  // 导出项目统计
  const exportEventStats = () => {
    const headers = ['项目名称', '类别', '总报名数', '完成数', '完成率'];
    const rows = eventStats.map(stat => [
      stat.eventName,
      stat.eventCategory,
      stat.totalParticipants,
      stat.completedCount,
      stat.participationRate,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `项目统计_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    storage.addLog({
      userId: user?.id || '',
      userName: user?.name || '',
      action: '导出',
      target: '项目统计',
      details: '导出项目统计数据',
    });

    toast.success('导出成功！');
  };

  // 导出所有数据
  const exportAllData = () => {
    const data = storage.exportAllData();
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `运动会数据备份_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);

    storage.addLog({
      userId: user?.id || '',
      userName: user?.name || '',
      action: '导出',
      target: '完整数据备份',
      details: '导出所有数据备份',
    });

    toast.success('导出成功！');
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="border-b bg-white p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">数据统计</h1>
              <p className="text-muted-foreground mt-1">
                查看运动会统计数据和报表
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadStatistics}>
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
              <Button variant="outline" onClick={exportAllData}>
                <Download className="h-4 w-4 mr-2" />
                导出全部数据
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 班级总分排名 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  班级总分排名
                </div>
                <Button variant="outline" size="sm" onClick={exportClassScores}>
                  <Download className="h-4 w-4 mr-2" />
                  导出
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">加载中...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>排名</TableHead>
                      <TableHead>班级</TableHead>
                      <TableHead>总分</TableHead>
                      <TableHead>🥇 金牌</TableHead>
                      <TableHead>🥈 银牌</TableHead>
                      <TableHead>🥉 铜牌</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classScores.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          暂无数据
                        </TableCell>
                      </TableRow>
                    ) : (
                      classScores.map((score, index) => (
                        <TableRow key={score.classId}>
                          <TableCell className="font-medium">
                            {index === 0 && <Medal className="inline h-5 w-5 text-yellow-500 mr-1" />}
                            {index === 1 && <Medal className="inline h-5 w-5 text-gray-400 mr-1" />}
                            {index === 2 && <Medal className="inline h-5 w-5 text-orange-600 mr-1" />}
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-semibold">{score.className}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span className="font-bold text-lg">{score.totalPoints}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-500">{score.goldMedals}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-gray-400">{score.silverMedals}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-orange-600">{score.bronzeMedals}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* 项目统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  项目统计
                </div>
                <Button variant="outline" size="sm" onClick={exportEventStats}>
                  <Download className="h-4 w-4 mr-2" />
                  导出
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">加载中...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>项目名称</TableHead>
                      <TableHead>类别</TableHead>
                      <TableHead>总报名数</TableHead>
                      <TableHead>完成数</TableHead>
                      <TableHead>完成率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventStats.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          暂无数据
                        </TableCell>
                      </TableRow>
                    ) : (
                      eventStats.map((stat) => (
                        <TableRow key={stat.eventId}>
                          <TableCell className="font-medium">{stat.eventName}</TableCell>
                          <TableCell>{stat.eventCategory}</TableCell>
                          <TableCell>{stat.totalParticipants}</TableCell>
                          <TableCell>{stat.completedCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{
                                    width: `${parseFloat(stat.participationRate)}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm">{stat.participationRate}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* 使用说明 */}
          <Card>
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>班级总分</strong>：根据所有项目的成绩自动计算，前三名分别获得 10/8/6 分，第四至八名依次获得 5/4/3/2/1 分</p>
              <p>• <strong>奖牌统计</strong>：自动统计各班级获得的第一、二、三名数量</p>
              <p>• <strong>项目完成率</strong>：显示各项目的成绩录入情况，帮助管理员掌握进度</p>
              <p>• <strong>数据导出</strong>：支持导出 CSV 格式的统计数据和 JSON 格式的完整数据备份</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
