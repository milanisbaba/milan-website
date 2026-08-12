import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, User, BarChart3, Briefcase, Scale } from 'lucide-react';

/** 导航项配置 */
const NAV_ITEMS = [
  { path: '/', label: '首页', icon: Home },
  { path: '/about', label: '关于我', icon: User },
  { path: '/dashboard', label: '行情看板', icon: BarChart3 },
  { path: '/legal', label: '公益法务', icon: Scale },
  { path: '/portfolio', label: '作品集', icon: Briefcase },
];

/**
 * 导航栏组件
 * 支持桌面端水平导航和移动端汉堡菜单
 * 带有滚动时的背景模糊效果
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const currentPath = window.location.pathname;

  /** 监听滚动事件，控制导航栏背景透明度 */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /** 路由切换时关闭移动端菜单 */
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-primary-100/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo区域 */}
          <motion.a
            href="/"
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PB</span>
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">
              Portfolio
            </span>
          </motion.a>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <motion.a
                  key={item.path}
                  href={item.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-bg"
                      className="absolute inset-0 bg-primary-50 rounded-xl"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon size={16} />
                    {item.label}
                  </span>
                </motion.a>
              );
            })}
          </div>

          {/* 移动端汉堡菜单按钮 */}
          <motion.button
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-primary-500 hover:bg-primary-50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="切换菜单"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden glass border-t border-white/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item, index) => {
                const isActive = currentPath === item.path;
                return (
                  <motion.a
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
