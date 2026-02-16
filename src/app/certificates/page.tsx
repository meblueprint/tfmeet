'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { Certificate, Result, MeetInfo } from '@/types';
import { Award, Download, Share2, Printer, Image as ImageIcon } from 'lucide-react';

export default function CertificatesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [meetInfo, setMeetInfo] = useState<MeetInfo | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allCertificates = storage.getCertificates();
    const allResults = storage.getResults();
    const info = storage.getMeetInfo();

    let filteredCertificates = allCertificates;
    let filteredResults = allResults;

    if (user?.role === 'class_admin' && user.classId) {
      filteredCertificates = allCertificates.filter(c => c.classId === user.classId);
      filteredResults = allResults.filter(r => r.classId === user.classId);
    } else if (user?.role === 'student') {
      // 学生只能看到自己的奖状（这里需要根据用户ID匹配，暂时显示所有）
    }

    setCertificates(filteredCertificates);
    setResults(filteredResults);
    setMeetInfo(info);
  };

  // 生成奖状
  const generateCertificate = (result: Result) => {
    if (!meetInfo) {
      toast.error('请先配置运动会信息！');
      return;
    }

    // 创建简单的奖状HTML模板
    const certificateHtml = `
      <div style="
        width: 800px;
        height: 600px;
        padding: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Microsoft YaHei', sans-serif;
        color: white;
        text-align: center;
        position: relative;
      ">
        <div style="
          border: 8px solid #ffd700;
          padding: 40px;
          height: calc(100% - 80px);
          box-sizing: border-box;
        ">
          <div style="
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          ">
            🏆 荣誉证书 🏆
          </div>

          <div style="
            font-size: 20px;
            margin-bottom: 40px;
            line-height: 1.8;
          ">
            ${meetInfo.name}<br/>
            第${meetInfo.edition}届运动会
          </div>

          <div style="
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
          ">
            <span style="font-size: 48px; color: #ffd700;">${result.studentName}</span> 同学
          </div>

          <div style="
            font-size: 24px;
            margin-bottom: 40px;
          ">
            在 <strong style="color: #ffd700;">${result.eventName}</strong> 项目中<br/>
            获得 <strong style="color: #ffd700;">第 ${result.rank} 名</strong>
          </div>

          <div style="
            font-size: 20px;
            margin-bottom: 40px;
          ">
            成绩：<strong style="color: #ffd700;">${result.score}</strong><br/>
            积分：<strong style="color: #ffd700;">${result.points}</strong> 分
          </div>

          <div style="
            font-size: 18px;
            margin-top: 60px;
            color: #ffd700;
          ">
            ${meetInfo.schoolName}
          </div>

          <div style="
            font-size: 16px;
            margin-top: 10px;
          ">
            ${new Date().toLocaleDateString('zh-CN')}
          </div>
        </div>
      </div>
    `;

    // 使用 HTMLCanvas 或 html2canvas 来生成图片
    // 这里简化处理，直接使用 data URI
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
        <foreignObject width="800" height="600">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${certificateHtml}
          </div>
        </foreignObject>
      </svg>
    `;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // 保存证书
    storage.addCertificate({
      studentId: result.studentId,
      studentName: result.studentName,
      classId: result.classId,
      className: result.className,
      eventId: result.eventId,
      eventName: result.eventName,
      rank: result.rank,
      points: result.points,
      templateId: 'default',
      certificateImage: url,
    });

    storage.addLog({
      userId: user?.id || '',
      userName: user?.name || '',
      action: '生成',
      target: '奖状',
      details: `为 ${result.studentName} 生成 ${result.eventName} 奖状`,
    });

    toast.success('奖状生成成功！');
    loadData();
  };

  // 批量生成奖状
  const batchGenerateCertificates = () => {
    let eligibleResults = results.filter(r => r.rank > 0 && r.rank <= 3); // 只为前三名生成

    if (selectedClass) {
      eligibleResults = eligibleResults.filter(r => r.classId === selectedClass);
    }
    if (selectedEvent) {
      eligibleResults = eligibleResults.filter(r => r.eventId === selectedEvent);
    }
    if (selectedRank !== 'all') {
      eligibleResults = eligibleResults.filter(r => r.rank === parseInt(selectedRank));
    }

    if (eligibleResults.length === 0) {
      toast.error('没有符合条件的结果！');
      return;
    }

    if (confirm(`确定要为 ${eligibleResults.length} 个获奖学生生成奖状吗？`)) {
      eligibleResults.forEach(result => {
        generateCertificate(result);
      });
      toast.success(`成功生成 ${eligibleResults.length} 张奖状！`);
      setIsGenerateDialogOpen(false);
    }
  };

  // 下载奖状
  const downloadCertificate = (certificate: Certificate) => {
    const link = document.createElement('a');
    link.href = certificate.certificateImage;
    link.download = `奖状_${certificate.studentName}_${certificate.eventName}.svg`;
    link.click();
    URL.revokeObjectURL(link.href);

    storage.addLog({
      userId: user?.id || '',
      userName: user?.name || '',
      action: '下载',
      target: '奖状',
      details: `下载 ${certificate.studentName} 的奖状`,
    });
  };

  // 打印奖状
  const printCertificate = (certificate: Certificate) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>奖状打印</title></head>
          <body style="margin: 0; padding: 0;">
            <img src="${certificate.certificateImage}" style="width: 100%;" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();

      storage.addLog({
        userId: user?.id || '',
        userName: user?.name || '',
        action: '打印',
        target: '奖状',
        details: `打印 ${certificate.studentName} 的奖状`,
      });
    }
  };

  // 预览奖状
  const handlePreview = (certificate: Certificate) => {
    setPreviewCertificate(certificate);
  };

  // 过滤奖状
  const filteredCertificates = certificates.filter(c => {
    if (selectedClass && c.classId !== selectedClass) return false;
    if (selectedEvent && c.eventId !== selectedEvent) return false;
    if (selectedRank !== 'all' && c.rank !== parseInt(selectedRank)) return false;
    return true;
  });

  // 获取所有班级和项目
  const allClasses = Array.from(new Set(certificates.map(c => c.classId)));
  const allEvents = Array.from(new Set(certificates.map(c => c.eventId)));

  return (
    <MainLayout>
      <div className="p-6">
        <div className="border-b bg-white p-6 mb-6">
          <h1 className="text-2xl font-bold">奖状管理</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'super_admin' ? '生成和管理所有奖状' : '查看和管理奖状'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                奖状列表
              </div>
              {user?.role !== 'student' && (
                <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Award className="h-4 w-4 mr-2" />
                      批量生成奖状
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>批量生成奖状</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          💡 将为符合筛选条件的获奖学生（前三名）批量生成奖状
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">按名次筛选</label>
                        <Select value={selectedRank} onValueChange={setSelectedRank}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择名次" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">所有名次</SelectItem>
                            <SelectItem value="1">第一名</SelectItem>
                            <SelectItem value="2">第二名</SelectItem>
                            <SelectItem value="3">第三名</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={batchGenerateCertificates} className="w-full">
                        开始生成
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
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
                  {allClasses.map((classId) => {
                    const cert = certificates.find(c => c.classId === classId);
                    return (
                      <SelectItem key={classId} value={classId}>
                        {cert?.className}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="筛选项目" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有项目</SelectItem>
                  {allEvents.map((eventId) => {
                    const cert = certificates.find(c => c.eventId === eventId);
                    return (
                      <SelectItem key={eventId} value={eventId}>
                        {cert?.eventName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select value={selectedRank} onValueChange={setSelectedRank}>
                <SelectTrigger>
                  <SelectValue placeholder="筛选名次" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有名次</SelectItem>
                  <SelectItem value="1">第一名</SelectItem>
                  <SelectItem value="2">第二名</SelectItem>
                  <SelectItem value="3">第三名</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 奖状列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCertificates.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  暂无奖状数据
                </div>
              ) : (
                filteredCertificates.map((certificate) => (
                  <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span className="truncate">{certificate.studentName}</span>
                        {getRankBadge(certificate.rank)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <p className="text-muted-foreground">项目</p>
                        <p className="font-medium">{certificate.eventName}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">班级</p>
                        <p className="font-medium">{certificate.className}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handlePreview(certificate)}
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          预览
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => downloadCertificate(certificate)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          下载
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => printCertificate(certificate)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* 预览对话框 */}
        <Dialog open={!!previewCertificate} onOpenChange={() => setPreviewCertificate(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>奖状预览</DialogTitle>
            </DialogHeader>
            {previewCertificate && (
              <div className="flex justify-center">
                <img
                  src={previewCertificate.certificateImage}
                  alt="奖状预览"
                  className="max-w-full max-h-[70vh]"
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => previewCertificate && downloadCertificate(previewCertificate)}
              >
                <Download className="h-4 w-4 mr-2" />
                下载
              </Button>
              <Button
                onClick={() => previewCertificate && printCertificate(previewCertificate)}
              >
                <Printer className="h-4 w-4 mr-2" />
                打印
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

function getRankBadge(rank: number) {
  if (rank === 1) return <Badge className="bg-yellow-500">🥇 第一名</Badge>;
  if (rank === 2) return <Badge className="bg-gray-400">🥈 第二名</Badge>;
  if (rank === 3) return <Badge className="bg-orange-600">🥉 第三名</Badge>;
  return <Badge variant="outline">第{rank}名</Badge>;
}
