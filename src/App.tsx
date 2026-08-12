import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import LegalPage from './pages/LegalPage';

/**
 * 应用根组件
 * 配置路由和全局布局
 */
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 首页 */}
          <Route path="/" element={<HomePage />} />
          {/* 关于我 */}
          <Route path="/about" element={<AboutPage />} />
          {/* 行情看板 */}
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* 公益法务查询 */}
          <Route path="/legal" element={<LegalPage />} />
          {/* 作品集 */}
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
