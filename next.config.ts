import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // 静态导出配置
  output: 'export',
  // 禁用图片优化（静态导出不支持）
  images: {
    unoptimized: true,
  },
  // 移除 Server Components 的限制
  trailingSlash: true,
};

export default nextConfig;
