'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { Result, Event, Registration, ScoringType } from '@/types';
import { Plus, Edit, Trash2, Trophy, TrendingUp, Medal } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [formData, setFormData] = useState({
    registrationId: '',
    score: '',
    points: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allResults = storage.getResults();
    const allEvents = storage.getEvents();
    const allRegistrations = storage.getRegistrations();
    const allClasses = storage.getClasses();

    let filteredResults = allResults;
    let filteredRegistrations = allRegistrations;

    if (user?.role === 'class_admin' && user.classId) {
      filteredResults = allResults.filter(r => r.classId === user.classId);
      filteredRegistrations = allRegistrations.filter(r => r.classId === user.classId);
    }

    setResults(filteredResults);
    setEvents(allEvents);
    setRegistrations(filteredRegistrations.filter(r => r.status === 'approved'));
    setClasses(allClasses);
  };

  // 自动计算排名和积分
  const calculateRankings = (eventId: string) => {
    const eventResults = results.filter(r => r.eventId === eventId);
    const event = events.find(e => e.id === eventId);

    if (!event || eventResults.length === 0) return;

    const sortedResults = [...eventResults].sort((a, b) => {
      const scoreA = parseFloat(a.score) || 0;
      const scoreB = parseFloat(b.score) || 0;

      switch (event.scoringType) {
        case 'time_asc':
          return scoreA - scoreB;
        case 'time_desc':
          return scoreB - scoreA;
        case 'distance':
        case 'height':
        case 'points':
          return scoreB - scoreA;
        default:
          return 0;
      }
    });

    sortedResults.forEach((result, index) => {
      const rank = index + 1;
      let points = 0;

      // 计分规则：第一名10分，第二名8分，第三名6分，第四名5分，第五名4分，第六名3分，第七名2分，第八名1分
      if (rank === 1) points = 10;
      else if (rank === 2) points = 8;
      else if (rank === 3) points = 6;
      else if (rank === 4) points = 5;
      else if (rank === 5) points = 4;
      else if (rank === 6) points = 3;
      else if (rank === 7) points = 2;
      else if (rank === 8) points = 1;

      storage.updateResult(result.id, { rank, points });
    });

    loadData();
    toast.success('排名已更新！');
  };

  const handleAdd = () => {
    setEditingResult(null);
    setFormData({
      registrationId: '',
      score: '',
      points: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setFormData({
      registrationId: result.registrationId,
      score: result.score,
      points: result.points,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除此成绩吗？')) {
      storage.deleteResult(id);
      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '删除',
        target: '成绩',
        details: `删除成绩 ID: ${id}`,
      });
      toast.success('删除成功！');
      loadData();
    }
  };

  const handleSave = () => {
    if (!formData.registrationId || !formData.score) {
      toast.error('请填写必填项！');
      return;
    }

    const registration = registrations.find(r => r.id === formData.registrationId);
    const event = events.find(e => e.id === registration?.eventId);

    if (!registration || !event) {
      toast.error('报名或项目不存在！');
      return;
    }

    if (editingResult) {
      storage.updateResult(editingResult.id, {
        score: formData.score,
        points: formData.points,
        updatedBy: user?.name,
        updatedTime: new Date().toISOString(),
      });
      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '更新',
        target: '成绩',
        details: `更新成绩: ${registration.studentName} - ${event.name}`,
      });
      toast.success('更新成功！');
    } else {
      storage.addResult({
        registrationId: formData.registrationId,
        studentId: registration.studentId,
        studentName: registration.studentName,
        classId: registration.classId,
        className: registration.className,
        eventId: registration.eventId,
        eventName: event.name,
        score: formData.score,
        rank: 0,
        points: formData.points,
        recordedBy: user?.name || '',
      });
      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '创建',
        target: '成绩',
        details: `录入成绩: ${registration.studentName} - ${event.name}`,
      });
      toast.success('录入成功！');
    }

    setIsDialogOpen(false);
    loadData();

    // 自动计算排名
    calculateRankings(event.id);
  };

  // 过滤数据
  const filteredResults = results.filter(r => {
    if (selectedEvent && r.eventId !== selectedEvent) return false;
    if (selectedClass && r.classId !== selectedClass) return false;
    return true;
  });

  // 按项目和排名排序
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (a.eventId !== b.eventId) {
      return a.eventId.localeCompare(b.eventId);
    }
    return a.rank - b.rank;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">🥇 第1名</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">🥈 第2名</Badge>;
    if (rank === 3) return <Badge className="bg-orange-600">🥉 第3名</Badge>;
    return <Badge variant="outline">第{rank}名</Badge>;
  };

  const exportToCSV = () => {
    const headers = ['学生姓名', '班级', '项目', '成绩', '排名', '积分', '录入人', '录入时间'];
    const rows = sortedResults.map(r => [
      r.studentName,
      r.className,
      r.eventName,
      r.score,
      r.rank,
      r.points,
      r.recordedBy,
      new Date(r.recordedTime).toLocaleString('zh-CN'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `成绩数据_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    storage.addLog({
      userId: user?.id || '',
      userName: user?.name || '',
      action: '导出',
      target: '成绩数据',
      details: '导出成绩数据到CSV',
    });
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="border-b bg-white p-6 mb-6">
          <h1 className="text-2xl font-bold">成绩管理</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'super_admin' ? '管理所有比赛成绩' : '管理本班学生成绩'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                成绩列表
              </div>
              <div className="flex gap-2">
                {user?.role !== 'student' && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleAdd}>
                        <Plus className="h-4 w-4 mr-2" />
                        录入成绩
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingResult ? '编辑成绩' : '录入成绩'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>选择报名记录 *</Label>
                          <Select
                            value={formData.registrationId}
                            onValueChange={(value) =>
                              setFormData({ ...formData, registrationId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择学生报名" />
                            </SelectTrigger>
                            <SelectContent>
                              {registrations.map((reg) => (
                                <SelectItem key={reg.id} value={reg.id}>
                                  {reg.studentName} - {reg.className} - {reg.eventName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>成绩 *</Label>
                          <Input
                            value={formData.score}
                            onChange={(e) =>
                              setFormData({ ...formData, score: e.target.value })
                            }
                            placeholder="如：12.5秒 或 5.2米"
                          />
                        </div>

                        <Button onClick={handleSave} className="w-full">
                          {editingResult ? '更新' : '录入'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                <Button variant="outline" onClick={exportToCSV}>
                  导出CSV
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 筛选 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="筛选项目" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有项目</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="筛选班级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有班级</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 表格 */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>学生姓名</TableHead>
                  <TableHead>班级</TableHead>
                  <TableHead>项目</TableHead>
                  <TableHead>成绩</TableHead>
                  <TableHead>排名</TableHead>
                  <TableHead>积分</TableHead>
                  <TableHead>录入人</TableHead>
                  <TableHead>录入时间</TableHead>
                  {user?.role !== 'student' && (
                    <TableHead className="text-right">操作</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={user?.role !== 'student' ? 9 : 8} className="text-center py-8">
                      暂无成绩数据
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {result.studentName}
                      </TableCell>
                      <TableCell>{result.className}</TableCell>
                      <TableCell>{result.eventName}</TableCell>
                      <TableCell className="font-semibold">{result.score}</TableCell>
                      <TableCell>{getRankBadge(result.rank)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          {result.points}分
                        </div>
                      </TableCell>
                      <TableCell>{result.recordedBy}</TableCell>
                      <TableCell>
                        {new Date(result.recordedTime).toLocaleString('zh-CN')}
                      </TableCell>
                      {user?.role !== 'student' && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(result)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user?.role === 'super_admin' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(result.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
