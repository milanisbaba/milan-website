import type { ReactNode } from 'react';
import Navbar from './Navbar';

/**
 * 页面布局组件
 * 包含固定导航栏和主内容区域
 * 所有页面共用此布局
 */
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      {/* 固定导航栏 */}
      <Navbar />
      
      {/* 主内容区域，顶部留出导航栏高度 */}
      <main className="pt-16">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Personal Brand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
