'use client';

import { useEffect, useState } from 'react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { Event, EventType, ScoringType } from '@/types';
import { Plus, Edit, Trash2, Trophy } from 'lucide-react';

export default function EventsSettingsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'track' as EventType,
    scoringType: 'time_asc' as ScoringType,
    category: '',
    description: '',
    maxParticipants: 0,
    gender: 'mixed' as 'male' | 'female' | 'mixed',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEvents(storage.getEvents());
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      type: EventType.TRACK,
      scoringType: ScoringType.TIME_ASC,
      category: '',
      description: '',
      maxParticipants: 0,
      gender: 'mixed',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      type: event.type,
      scoringType: event.scoringType,
      category: event.category,
      description: event.description || '',
      maxParticipants: event.maxParticipants || 0,
      gender: event.gender,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除此项目吗？')) {
      storage.deleteEvent(id);
      storage.addLog({
        userId: storage.getCurrentUser()?.id || '',
        userName: storage.getCurrentUser()?.name || '',
        action: '删除',
        target: '比赛项目',
        details: `删除项目 ID: ${id}`,
      });
      toast.success('删除成功！');
      loadData();
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) {
      toast.error('请填写必填项！');
      return;
    }

    if (editingEvent) {
      storage.updateEvent(editingEvent.id, formData);
      storage.addLog({
        userId: storage.getCurrentUser()?.id || '',
        userName: storage.getCurrentUser()?.name || '',
        action: '更新',
        target: '比赛项目',
        details: `更新项目: ${formData.name}`,
      });
      toast.success('更新成功！');
    } else {
      storage.addEvent(formData);
      storage.addLog({
        userId: storage.getCurrentUser()?.id || '',
        userName: storage.getCurrentUser()?.name || '',
        action: '创建',
        target: '比赛项目',
        details: `创建项目: ${formData.name}`,
      });
      toast.success('创建成功！');
    }

    setIsDialogOpen(false);
    loadData();
  };

  const getEventTypeName = (type: EventType) => {
    switch (type) {
      case 'track':
        return '径赛';
      case 'field':
        return '田赛';
      case 'relay':
        return '接力';
    }
  };

  const getScoringTypeName = (type: ScoringType) => {
    switch (type) {
      case 'time_asc':
        return '时间越小越好';
      case 'time_desc':
        return '时间越大越好';
      case 'distance':
        return '距离越大越好';
      case 'height':
        return '高度越大越好';
      case 'points':
        return '积分越大越好';
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

  return (
    <SettingsLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">项目管理</h2>
            <p className="text-muted-foreground">管理比赛项目</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                添加项目
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? '编辑项目' : '添加项目'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>项目名称 *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="如：100米短跑"
                  />
                </div>

                <div className="space-y-2">
                  <Label>项目类别 *</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="如：短跑、长跑、跳远等"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>项目类型 *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: EventType) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="track">径赛</SelectItem>
                        <SelectItem value="field">田赛</SelectItem>
                        <SelectItem value="relay">接力</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>性别 *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value: 'male' | 'female' | 'mixed') =>
                        setFormData({ ...formData, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男子</SelectItem>
                        <SelectItem value="female">女子</SelectItem>
                        <SelectItem value="mixed">混合</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>计分规则 *</Label>
                  <Select
                    value={formData.scoringType}
                    onValueChange={(value: ScoringType) =>
                      setFormData({ ...formData, scoringType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time_asc">时间越小越好</SelectItem>
                      <SelectItem value="time_desc">时间越大越好</SelectItem>
                      <SelectItem value="distance">距离越大越好</SelectItem>
                      <SelectItem value="height">高度越大越好</SelectItem>
                      <SelectItem value="points">积分越大越好</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>最大参与人数</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxParticipants: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="不限制则留空"
                  />
                </div>

                <div className="space-y-2">
                  <Label>项目描述</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="请输入项目描述（可选）"
                    rows={3}
                  />
                </div>

                <Button onClick={handleSave} className="w-full">
                  {editingEvent ? '更新' : '添加'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              项目列表
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目名称</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>性别</TableHead>
                  <TableHead>计分规则</TableHead>
                  <TableHead>最大人数</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.category}</TableCell>
                    <TableCell>{getEventTypeName(event.type)}</TableCell>
                    <TableCell>{getGenderName(event.gender)}</TableCell>
                    <TableCell>{getScoringTypeName(event.scoringType)}</TableCell>
                    <TableCell>
                      {event.maxParticipants
                        ? event.maxParticipants
                        : '不限制'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
