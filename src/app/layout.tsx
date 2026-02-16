import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '田径运动会管理系统',
    template: '%s | 田径运动会管理系统',
  },
  description: '轻量级田径运动会管理系统，支持报名管理、赛程编排、成绩录入、奖状生成等功能',
  keywords: [
    '田径运动会',
    '运动会管理',
    '报名系统',
    '成绩管理',
    '奖状生成',
  ],
  authors: [{ name: '田径运动会管理系统' }],
  generator: '田径运动会管理系统',
  openGraph: {
    title: '田径运动会管理系统',
    description: '轻量级田径运动会管理系统，支持报名管理、赛程编排、成绩录入、奖状生成等功能',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
