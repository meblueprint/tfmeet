'use client';

import { useEffect, useState } from 'react';
import SettingsLayout from '@/components/layout/SettingsLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { User, UserRole } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'student' as UserRole,
    classId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(storage.getUsers());
    setClasses(storage.getClasses());
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      role: 'student',
      classId: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      name: user.name,
      role: user.role,
      classId: user.classId || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除此用户吗？')) {
      storage.deleteUser(id);
      storage.addLog({
        userId: storage.getCurrentUser()?.id || '',
        userName: storage.getCurrentUser()?.name || '',
        action: '删除',
        target: '用户',
        details: `删除用户 ID: ${id}`,
      });
      toast.success('删除成功！');
      loadData();
    }
  };

  const handleSave = () => {
    if (!formData.username || !formData.name || !formData.password) {
      toast.error('请填写必填项！');
      return;
    }

    if (editingUser) {
      // 更新用户
      const className = classes.find((c) => c.id === formData.classId)?.name;
      storage.updateUser(editingUser.id, {
        ...formData,
        className,
      });
      storage.addLog({
        userId: storage.getCurrentUser()?.id || '',
        userName: storage.getCurrentUser()?.name || '',
        action: '更新',
        target: '用户',
        details: `更新用户: ${formData.name}`,
      });
      toast.success('更新成功！');
    } else {
      // 新增用户
      const className = classes.find((c) => c.id === formData.classId)?.name;
      storage.addUser({
        ...formData,
        className,
      });
      storage.addLog({
        userId: storage.getCurrentUser()?.id || '',
        userName: storage.getCurrentUser()?.name || '',
        action: '创建',
        target: '用户',
        details: `创建用户: ${formData.name}`,
      });
      toast.success('创建成功！');
    }

    setIsDialogOpen(false);
    loadData();
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return '超级管理员';
      case 'class_admin':
        return '班级管理员';
      case 'student':
        return '学生';
    }
  };

  return (
    <SettingsLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">用户管理</h2>
            <p className="text-muted-foreground">管理系统用户</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                添加用户
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? '编辑用户' : '添加用户'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>用户名 *</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="请输入用户名"
                  />
                </div>

                <div className="space-y-2">
                  <Label>姓名 *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="请输入姓名"
                  />
                </div>

                <div className="space-y-2">
                  <Label>密码 *</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="请输入密码"
                  />
                </div>

                <div className="space-y-2">
                  <Label>角色 *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: UserRole) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">超级管理员</SelectItem>
                      <SelectItem value="class_admin">班级管理员</SelectItem>
                      <SelectItem value="student">学生</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.role === 'class_admin' ||
                  formData.role === 'student') && (
                  <div className="space-y-2">
                    <Label>班级</Label>
                    <Select
                      value={formData.classId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, classId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择班级" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button onClick={handleSave} className="w-full">
                  {editingUser ? '更新' : '添加'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>班级</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{getRoleName(user.role)}</TableCell>
                    <TableCell>{user.className || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
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
