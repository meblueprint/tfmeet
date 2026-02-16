'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { storage } from '@/lib/storage';
import { User } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 检查是否已登录
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      router.push('/');
    }

    // 初始化默认管理员账户
    initializeDefaultAdmin();
  }, [router]);

  const initializeDefaultAdmin = () => {
    const users = storage.getUsers();
    if (users.length === 0) {
      // 创建默认超级管理员
      storage.addUser({
        username: 'admin',
        password: 'admin123', // 实际应用中应该加密
        name: '系统管理员',
        role: 'super_admin',
      });
      console.log('默认管理员账户已创建: admin / admin123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 模拟网络延迟
    setTimeout(() => {
      const users = storage.getUsers();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        storage.setCurrentUser(user);
        storage.addLog({
          userId: user.id,
          userName: user.name,
          action: '登录',
          target: '系统',
          details: '用户登录成功',
        });
        router.push('/');
      } else {
        setError('用户名或密码错误');
      }

      setIsLoading(false);
    }, 500);
  };

  const handleDemoLogin = (role: 'super_admin' | 'class_admin' | 'student') => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const users = storage.getUsers();
      let demoUser: User | undefined;

      // 查找对应角色的演示用户
      demoUser = users.find(u => u.role === role);

      // 如果没有找到，创建一个
      if (!demoUser) {
        switch (role) {
          case 'super_admin':
            demoUser = storage.addUser({
              username: 'admin',
              password: 'admin123',
              name: '系统管理员',
              role: 'super_admin',
            });
            break;
          case 'class_admin':
            // 先创建班级
            const classes = storage.getClasses();
            if (classes.length === 0) {
              storage.addClass({
                name: '一年级1班',
                grade: '一年级',
                teacher: '张老师',
                studentCount: 30,
              });
            }
            const cls = storage.getClasses()[0];
            demoUser = storage.addUser({
              username: 'teacher',
              password: 'teacher123',
              name: '张老师',
              role: 'class_admin',
              classId: cls.id,
              className: cls.name,
            });
            break;
          case 'student':
            const studentClasses = storage.getClasses();
            if (studentClasses.length === 0) {
              storage.addClass({
                name: '一年级1班',
                grade: '一年级',
                teacher: '张老师',
                studentCount: 30,
              });
            }
            const studentClass = storage.getClasses()[0];
            demoUser = storage.addUser({
              username: 'student',
              password: 'student123',
              name: '张小明',
              role: 'student',
              classId: studentClass.id,
              className: studentClass.name,
            });
            break;
        }
      }

      if (demoUser) {
        storage.setCurrentUser(demoUser);
        storage.addLog({
          userId: demoUser.id,
          userName: demoUser.name,
          action: '登录',
          target: '系统',
          details: '演示账户登录成功',
        });
        router.push('/');
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            田径运动会管理系统
          </CardTitle>
          <CardDescription className="text-center">
            请登录您的账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  演示账户
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('super_admin')}
                disabled={isLoading}
              >
                管理员
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('class_admin')}
                disabled={isLoading}
              >
                老师
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('student')}
                disabled={isLoading}
              >
                学生
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• 管理员：admin / admin123</p>
              <p>• 老师：teacher / teacher123</p>
              <p>• 学生：student / student123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
