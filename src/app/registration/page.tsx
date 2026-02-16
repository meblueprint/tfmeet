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
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { Registration, Student, Event, User } from '@/types';
import { Plus, Edit, Trash2, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function RegistrationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    studentId: '',
    eventId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allRegistrations = storage.getRegistrations();
    const allStudents = storage.getStudents();
    const allEvents = storage.getEvents();
    const allClasses = storage.getClasses();

    // 根据用户角色过滤数据
    let filteredRegistrations = allRegistrations;
    if (user?.role === 'class_admin' && user.classId) {
      filteredRegistrations = allRegistrations.filter(r => r.classId === user.classId);
    }

    setRegistrations(filteredRegistrations);
    setStudents(allStudents);
    setEvents(allEvents);
    setClasses(allClasses);
  };

  const handleAdd = () => {
    setEditingRegistration(null);
    setFormData({
      studentId: '',
      eventId: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (registration: Registration) => {
    setEditingRegistration(registration);
    setFormData({
      studentId: registration.studentId,
      eventId: registration.eventId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除此报名吗？')) {
      storage.deleteRegistration(id);
      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '删除',
        target: '报名',
        details: `删除报名 ID: ${id}`,
      });
      toast.success('删除成功！');
      loadData();
    }
  };

  const handleApprove = (registration: Registration) => {
    storage.updateRegistration(registration.id, { status: 'approved' });
    storage.addLog({
      userId: user?.id || '',
      userName: user?.name || '',
      action: '审核通过',
      target: '报名',
      details: `通过报名: ${registration.studentName} - ${registration.eventName}`,
    });
    toast.success('审核通过！');
    loadData();
  };

  const handleReject = (registration: Registration) => {
    const reason = prompt('请输入驳回原因：');
    if (reason) {
      storage.updateRegistration(registration.id, {
        status: 'rejected',
        rejectedReason: reason,
      });
      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '驳回',
        target: '报名',
        details: `驳回报名: ${registration.studentName} - ${registration.eventName}，原因：${reason}`,
      });
      toast.success('已驳回！');
      loadData();
    }
  };

  const handleSave = () => {
    if (!formData.studentId || !formData.eventId) {
      toast.error('请选择学生和项目！');
      return;
    }

    const student = students.find(s => s.id === formData.studentId);
    const event = events.find(e => e.id === formData.eventId);

    if (!student || !event) {
      toast.error('学生或项目不存在！');
      return;
    }

    // 检查是否已经报名过
    const existingRegistration = registrations.find(
      r => r.studentId === formData.studentId && r.eventId === formData.eventId
    );
    if (existingRegistration && (!editingRegistration || existingRegistration.id !== editingRegistration.id)) {
      toast.error('该学生已经报名过此项目！');
      return;
    }

    if (editingRegistration) {
      storage.updateRegistration(editingRegistration.id, {
        studentId: formData.studentId,
        studentName: student.name,
        classId: student.classId,
        className: student.className,
        eventId: formData.eventId,
        eventName: event.name,
      });
      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '更新',
        target: '报名',
        details: `更新报名: ${student.name} - ${event.name}`,
      });
      toast.success('更新成功！');
    } else {
      storage.addRegistration({
        studentId: formData.studentId,
        studentName: student.name,
        classId: student.classId,
        className: student.className,
        eventId: formData.eventId,
        eventName: event.name,
        status: user?.role === 'super_admin' ? 'approved' : 'pending',
      });
      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '创建',
        target: '报名',
        details: `创建报名: ${student.name} - ${event.name}`,
      });
      toast.success('创建成功！');
    }

    setIsDialogOpen(false);
    loadData();
  };

  // 过滤数据
  const filteredRegistrations = registrations.filter(r => {
    if (selectedClass && r.classId !== selectedClass) return false;
    if (selectedEvent && r.eventId !== selectedEvent) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">已通过</Badge>;
      case 'pending':
        return <Badge variant="secondary">待审核</Badge>;
      case 'rejected':
        return <Badge variant="destructive">已驳回</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const exportToCSV = () => {
    const headers = ['学生姓名', '班级', '项目', '状态', '报名时间'];
    const rows = filteredRegistrations.map(r => [
      r.studentName,
      r.className,
      r.eventName,
      r.status,
      new Date(r.registrationTime).toLocaleString('zh-CN'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `报名数据_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    storage.addLog({
      userId: user?.id || '',
      userName: user?.name || '',
      action: '导出',
      target: '报名数据',
      details: '导出报名数据到CSV',
    });
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="border-b bg-white p-6 mb-6">
          <h1 className="text-2xl font-bold">报名管理</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'super_admin' ? '管理所有班级的报名' : '管理本班的报名'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                报名列表
              </div>
              <div className="flex gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAdd}>
                      <Plus className="h-4 w-4 mr-2" />
                      添加报名
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingRegistration ? '编辑报名' : '添加报名'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>选择学生 *</Label>
                        <Select
                          value={formData.studentId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, studentId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择学生" />
                          </SelectTrigger>
                          <SelectContent>
                            {students
                              .filter(s => !user?.classId || s.classId === user.classId)
                              .map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name} - {student.className}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

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

                      <Button onClick={handleSave} className="w-full">
                        {editingRegistration ? '更新' : '添加'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={exportToCSV}>
                  导出CSV
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 筛选 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="筛选状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="approved">已通过</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="rejected">已驳回</SelectItem>
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
                  <TableHead>状态</TableHead>
                  <TableHead>报名时间</TableHead>
                  {user?.role === 'super_admin' && (
                    <TableHead className="text-right">操作</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={user?.role === 'super_admin' ? 6 : 5} className="text-center py-8">
                      暂无报名数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">
                        {registration.studentName}
                      </TableCell>
                      <TableCell>{registration.className}</TableCell>
                      <TableCell>{registration.eventName}</TableCell>
                      <TableCell>
                        {getStatusBadge(registration.status)}
                        {registration.status === 'rejected' && registration.rejectedReason && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {registration.rejectedReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(registration.registrationTime).toLocaleString('zh-CN')}
                      </TableCell>
                      {user?.role === 'super_admin' && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {registration.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApprove(registration)}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReject(registration)}
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(registration)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(registration.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
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
