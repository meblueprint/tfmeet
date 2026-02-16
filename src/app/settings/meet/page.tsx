'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SettingsLayout from '@/components/layout/SettingsLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { MeetInfo } from '@/types';

export default function MeetSettingsPage() {
  const router = useRouter();
  const [meetInfo, setMeetInfo] = useState<MeetInfo | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const info = storage.getMeetInfo();
    if (info) {
      setMeetInfo(info);
    } else {
      // 创建默认运动会信息
      const defaultInfo: MeetInfo = {
        id: 'meet-1',
        name: '2024年春季田径运动会',
        edition: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        schoolName: '示例学校',
        description: '',
      };
      setMeetInfo(defaultInfo);
    }
  }, []);

  const handleSave = () => {
    if (!meetInfo) return;

    setIsSaving(true);

    setTimeout(() => {
      storage.saveMeetInfo(meetInfo);
      storage.addLog({
        userId: storage.getCurrentUser()?.id || '',
        userName: storage.getCurrentUser()?.name || '',
        action: '更新',
        target: '运动会信息',
        details: '更新运动会基本配置',
      });
      toast.success('保存成功！');
      setIsSaving(false);
    }, 500);
  };

  if (!meetInfo) {
    return (
      <SettingsLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout>
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>运动会基本信息</CardTitle>
            <CardDescription>
              配置运动会的基本信息，包括名称、时间、学校等
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">运动会名称 *</Label>
              <Input
                id="name"
                value={meetInfo.name}
                onChange={(e) =>
                  setMeetInfo({ ...meetInfo, name: e.target.value })
                }
                placeholder="请输入运动会名称"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edition">届数 *</Label>
              <Input
                id="edition"
                type="number"
                min="1"
                value={meetInfo.edition}
                onChange={(e) =>
                  setMeetInfo({
                    ...meetInfo,
                    edition: parseInt(e.target.value) || 1,
                  })
                }
                placeholder="请输入届数"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolName">学校名称 *</Label>
              <Input
                id="schoolName"
                value={meetInfo.schoolName}
                onChange={(e) =>
                  setMeetInfo({ ...meetInfo, schoolName: e.target.value })
                }
                placeholder="请输入学校名称"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">开始日期 *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={meetInfo.startDate}
                  onChange={(e) =>
                    setMeetInfo({ ...meetInfo, startDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">结束日期 *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={meetInfo.endDate}
                  onChange={(e) =>
                    setMeetInfo({ ...meetInfo, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">运动会描述</Label>
              <Textarea
                id="description"
                value={meetInfo.description || ''}
                onChange={(e) =>
                  setMeetInfo({ ...meetInfo, description: e.target.value })
                }
                placeholder="请输入运动会描述（可选）"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? '保存中...' : '保存'}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                返回
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
