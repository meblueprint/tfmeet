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
import { Schedule, Event } from '@/types';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, Clock, MapPin, PlayCircle, CheckCircle } from 'lucide-react';

export default function SchedulePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    eventId: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    sequence: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allSchedules = storage.getSchedules();
    const allEvents = storage.getEvents();

    setSchedules(allSchedules.sort((a, b) => {
      const dateCompare = a.eventDate.localeCompare(b.eventDate);
      if (dateCompare !== 0) return dateCompare;
      return a.sequence - b.sequence;
    }));
    setEvents(allEvents);
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    setFormData({
      eventId: '',
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: '09:00',
      venue: '',
      sequence: schedules.length + 1,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      eventId: schedule.eventId,
      eventDate: schedule.eventDate,
      eventTime: schedule.eventTime,
      venue: schedule.venue,
      sequence: schedule.sequence,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除此赛程吗？')) {
      storage.deleteSchedule(id);
      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '删除',
        target: '赛程',
        details: `删除赛程 ID: ${id}`,
      });
      toast.success('删除成功！');
      loadData();
    }
  };

  const handleUpdateStatus = (schedule: Schedule, status: 'scheduled' | 'ongoing' | 'completed') => {
    storage.updateSchedule(schedule.id, { status });
    storage.addLog({
      userId: user?.id || '',
      userName: user?.name || '',
      action: '更新状态',
      target: '赛程',
      details: `更新赛程状态: ${schedule.eventName} -> ${status}`,
    });
    toast.success('状态更新成功！');
    loadData();
  };

  const handleSave = () => {
    if (!formData.eventId || !formData.eventDate || !formData.eventTime) {
      toast.error('请填写必填项！');
      return;
    }

    const event = events.find(e => e.id === formData.eventId);
    if (!event) {
      toast.error('项目不存在！');
      return;
    }

    if (editingSchedule) {
      storage.updateSchedule(editingSchedule.id, {
        ...formData,
        eventName: event.name,
        gender: event.gender,
        category: event.category,
      });
      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '更新',
        target: '赛程',
        details: `更新赛程: ${event.name}`,
      });
      toast.success('更新成功！');
    } else {
      storage.addSchedule({
        ...formData,
        eventName: event.name,
        gender: event.gender,
        category: event.category,
        status: 'scheduled',
      });
      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '创建',
        target: '赛程',
        details: `创建赛程: ${event.name}`,
      });
      toast.success('创建成功！');
    }

    setIsDialogOpen(false);
    loadData();
  };

  // 过滤数据
  const filteredSchedules = schedules.filter(s => {
    if (selectedDate && s.eventDate !== selectedDate) return false;
    if (selectedStatus !== 'all' && s.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">已安排</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-500">进行中</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">已完成</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getGenderName = (gender: string) => {
    switch (gender) {
      case 'male':
        return '男子';
      case 'female':
        return '女子';
      case 'mixed':
        return '混合';
    }
  };

  // 获取所有使用的日期
  const usedDates = Array.from(new Set(schedules.map(s => s.eventDate))).sort();

  return (
    <MainLayout>
      <div className="p-6">
        <div className="border-b bg-white p-6 mb-6">
          <h1 className="text-2xl font-bold">赛程管理</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'super_admin' ? '管理比赛赛程安排' : '查看比赛赛程'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                赛程列表
              </div>
              {user?.role === 'super_admin' && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAdd}>
                      <Plus className="h-4 w-4 mr-2" />
                      添加赛程
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSchedule ? '编辑赛程' : '添加赛程'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>选择项目 *</Label>
                        <Select
                          value={formData.eventId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, eventId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择项目" />
                          </SelectTrigger>
                          <SelectContent>
                            {events.map((event) => (
                              <SelectItem key={event.id} value={event.id}>
                                {event.name} ({event.category})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>日期 *</Label>
                          <Input
                            type="date"
                            value={formData.eventDate}
                            onChange={(e) =>
                              setFormData({ ...formData, eventDate: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>时间 *</Label>
                          <Input
                            type="time"
                            value={formData.eventTime}
                            onChange={(e) =>
                              setFormData({ ...formData, eventTime: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>场地 *</Label>
                        <Input
                          value={formData.venue}
                          onChange={(e) =>
                            setFormData({ ...formData, venue: e.target.value })
                          }
                          placeholder="如：田径场A区"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>序号</Label>
                        <Input
                          type="number"
                          min="1"
                          value={formData.sequence}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sequence: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>

                      <Button onClick={handleSave} className="w-full">
                        {editingSchedule ? '更新' : '添加'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 筛选 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="筛选日期" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有日期</SelectItem>
                  {usedDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="筛选状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="scheduled">已安排</SelectItem>
                  <SelectItem value="ongoing">进行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 赛程列表 */}
            <div className="space-y-4">
              {filteredSchedules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无赛程数据
                </div>
              ) : (
                filteredSchedules.map((schedule) => (
                  <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">第 {schedule.sequence} 场</Badge>
                            {getStatusBadge(schedule.status)}
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            {schedule.eventName}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {schedule.eventDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {schedule.eventTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {schedule.venue}
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{getGenderName(schedule.gender)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{schedule.category}</span>
                            </div>
                          </div>
                        </div>

                        {user?.role === 'super_admin' && (
                          <div className="flex flex-col gap-2 ml-4">
                            {schedule.status === 'scheduled' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(schedule, 'ongoing')}
                              >
                                <PlayCircle className="h-4 w-4 mr-1" />
                                开始
                              </Button>
                            )}
                            {schedule.status === 'ongoing' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(schedule, 'completed')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                完成
                              </Button>
                            )}
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(schedule)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(schedule.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
