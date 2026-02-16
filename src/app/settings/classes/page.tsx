'use client';

import { useEffect, useState } from 'react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { Class } from '@/types';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

export default function ClassesSettingsPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    teacher: '',
    studentCount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setClasses(storage.getClasses());
  };

  const handleAdd = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      grade: '',
      teacher: '',
      studentCount: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      grade: cls.grade,
      teacher: cls.teacher || '',
      studentCount: cls.studentCount || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除此班级吗？')) {
      storage.deleteClass(id);
      storage.addLog({
        userId: storage.getCurrentUser()?.id || '',
        userName: storage.getCurrentUser()?.name || '',
        action: '删除',
        target: '班级',
        details: `删除班级 ID: ${id}`,
      });
      toast.success('删除成功！');
      loadData();
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.grade) {
      toast.error('请填写必填项！');
      return;
    }

    if (editingClass) {
      storage.updateClass(editingClass.id, formData);
      storage.addLog({
        userId: storage.getCurrentUser()?.id || '',
        userName: storage.getCurrentUser()?.name || '',
        action: '更新',
        target: '班级',
        details: `更新班级: ${formData.name}`,
      });
      toast.success('更新成功！');
    } else {
      storage.addClass(formData);
      storage.addLog({
        userId: storage.getCurrentUser()?.id || '',
        userName: storage.getCurrentUser()?.name || '',
        action: '创建',
        target: '班级',
        details: `创建班级: ${formData.name}`,
      });
      toast.success('创建成功！');
    }

    setIsDialogOpen(false);
    loadData();
  };

  return (
    <SettingsLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">班级管理</h2>
            <p className="text-muted-foreground">管理参赛班级</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                添加班级
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingClass ? '编辑班级' : '添加班级'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>班级名称 *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="如：一年级1班"
                  />
                </div>

                <div className="space-y-2">
                  <Label>年级 *</Label>
                  <Input
                    value={formData.grade}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                    placeholder="如：一年级"
                  />
                </div>

                <div className="space-y-2">
                  <Label>班主任</Label>
                  <Input
                    value={formData.teacher}
                    onChange={(e) =>
                      setFormData({ ...formData, teacher: e.target.value })
                    }
                    placeholder="请输入班主任姓名"
                  />
                </div>

                <div className="space-y-2">
                  <Label>学生人数</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.studentCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        studentCount: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="请输入学生人数"
                  />
                </div>

                <Button onClick={handleSave} className="w-full">
                  {editingClass ? '更新' : '添加'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              班级列表
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>班级名称</TableHead>
                  <TableHead>年级</TableHead>
                  <TableHead>班主任</TableHead>
                  <TableHead>学生人数</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{cls.grade}</TableCell>
                    <TableCell>{cls.teacher || '-'}</TableCell>
                    <TableCell>{cls.studentCount || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(cls)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cls.id)}
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
