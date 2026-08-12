import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, Clock, Bitcoin, Building2, Landmark, Gem, AlertCircle } from 'lucide-react';
import { useBinanceData } from '../hooks/useBinanceData';
import { useMarketData } from '../hooks/useMarketData';
import type { MarketCategory, MarketItem } from '../types';

/** Tab配置 */
const TAB_CONFIG: { key: MarketCategory; label: string; icon: typeof Bitcoin; desc: string; source: string }[] = [
  { key: 'crypto', label: '加密货币', icon: Bitcoin, desc: '实时币安数据', source: '币安API' },
  { key: 'us-stock', label: '美股', icon: Building2, desc: 'Twelve Data API', source: 'Twelve Data' },
  { key: 'a-stock', label: 'A股', icon: Landmark, desc: '腾讯财经API', source: '腾讯财经' },
  { key: 'metal', label: '贵金属', icon: Gem, desc: 'Gold-API.com', source: 'Gold-API' },
];

/**
 * 格式化价格显示
 */
function formatPrice(price: number | undefined | null, category: MarketCategory): string {
  if (price === undefined || price === null || isNaN(Number(price))) {
    return '--';
  }
  const numPrice = Number(price);
  
  if (category === 'crypto') {
    if (numPrice >= 1000) return numPrice.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return numPrice.toFixed(4);
  }
  
  if (category === 'a-stock') {
    return `¥${numPrice.toFixed(2)}`;
  }
  
  if (category === 'metal') {
    return `$${numPrice.toFixed(2)}`;
  }
  
  // 美股
  return `$${numPrice.toFixed(2)}`;
}

/**
 * 格式化涨跌幅
 */
function formatChange(changePercent: number | undefined | null): string {
  if (changePercent === undefined || changePercent === null || isNaN(Number(changePercent))) {
    return '--';
  }
  const num = Number(changePercent);
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

/**
 * 格式化成交量
 */
function formatVolume(volume: number | undefined | null): string {
  if (volume === undefined || volume === null || isNaN(Number(volume)) || Number(volume) === 0) return '--';
  const vol = Number(volume);
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
  return volume.toString();
}

/**
 * 行情卡片组件
 */
function MarketCard({ item, category, index }: { item: MarketItem; category: MarketCategory; index: number }) {
  const isUp = item.changePercent >= 0;
  
  return (
    <motion.div
      className={`bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-primary-200/20 transition-all duration-300 hover:-translate-y-1 ${item.error ? 'opacity-60' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* 头部：图标 + 名称 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{item.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-xs text-gray-400">{item.symbol}</p>
          </div>
        </div>
        {item.error && (
          <span className="text-xs text-red-400 bg-red-50 px-2 py-0.5 rounded-full">获取失败</span>
        )}
      </div>

      {/* 价格 */}
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">
          {formatPrice(item.price, category)}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{formatChange(item.changePercent)}</span>
          <span className="text-gray-400 ml-1">
            ({isUp ? '+' : ''}{(item.change ?? 0).toFixed(2)})
          </span>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50">
        <div>
          <p className="text-xs text-gray-400">最高</p>
          <p className="text-sm text-gray-600">{formatPrice(item.high ?? item.price, category)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">最低</p>
          <p className="text-sm text-gray-600">{formatPrice(item.low ?? item.price, category)}</p>
        </div>
        {category === 'crypto' && (item.volume ?? 0) > 0 && (
          <div className="col-span-2">
            <p className="text-xs text-gray-400">24h成交量</p>
            <p className="text-sm text-gray-600">{formatVolume(item.volume ?? 0)}</p>
          </div>
        )}
        {category === 'us-stock' && (item.volume ?? 0) > 0 && (
          <div className="col-span-2">
            <p className="text-xs text-gray-400">成交量</p>
            <p className="text-sm text-gray-600">{formatVolume(item.volume ?? 0)}</p>
          </div>
        )}
        {category === 'a-stock' && (item.marketCap ?? 0) > 0 && (
          <div className="col-span-2">
            <p className="text-xs text-gray-400">成交额</p>
            <p className="text-sm text-gray-600">
              {(item.marketCap ?? 0) > 1e8 
                ? `${((item.marketCap ?? 0) / 1e8).toFixed(2)}亿`
                : `${((item.marketCap ?? 0) / 1e4).toFixed(2)}万`}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * 骨架屏加载组件
 */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div>
          <div className="w-20 h-4 bg-gray-200 rounded" />
          <div className="w-12 h-3 bg-gray-100 rounded mt-1" />
        </div>
      </div>
      <div className="w-24 h-7 bg-gray-200 rounded mb-2" />
      <div className="w-16 h-4 bg-gray-100 rounded" />
      <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-gray-50">
        <div className="w-12 h-3 bg-gray-100 rounded" />
        <div className="w-12 h-3 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

/**
 * 全球行情看板页面
 * 展示加密货币、美股、A股、贵金属四大类实时行情数据
 * 加密货币使用币安公开API，其他市场通过后端代理获取
 */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<MarketCategory>('crypto');

  // 加密货币数据（币安真实API）
  const { coins, loading: cryptoLoading, error: cryptoError, lastUpdated: cryptoUpdated, refetch: cryptoRefresh } = useBinanceData(60000);

  // 美股/A股/贵金属数据（通过后端代理获取真实API数据）
  const { usStocks, cnStocks, preciousMetals, refreshAll: marketRefresh } = useMarketData();

  /** 当前Tab对应的数据 */
  const getCurrentData = (): MarketItem[] => {
    switch (activeTab) {
      case 'crypto': return coins as unknown as MarketItem[];
      case 'us-stock': return usStocks.data;
      case 'a-stock': return cnStocks.data;
      case 'metal': return preciousMetals.data;
      default: return [];
    }
  };

  const currentData = getCurrentData();
  const currentLoading = activeTab === 'crypto' ? cryptoLoading : 
    activeTab === 'us-stock' ? usStocks.loading :
    activeTab === 'a-stock' ? cnStocks.loading :
    preciousMetals.loading;
  
  const currentUpdated = activeTab === 'crypto' ? cryptoUpdated :
    activeTab === 'us-stock' ? usStocks.lastUpdated :
    activeTab === 'a-stock' ? cnStocks.lastUpdated :
    preciousMetals.lastUpdated;
  
  const currentError = activeTab === 'crypto' ? cryptoError :
    activeTab === 'us-stock' ? usStocks.error :
    activeTab === 'a-stock' ? cnStocks.error :
    preciousMetals.error;

  /** 刷新当前Tab数据 */
  const handleRefresh = () => {
    if (activeTab === 'crypto') {
      cryptoRefresh();
    } else {
      marketRefresh();
    }
  };

  /** 获取当前Tab的数据源说明 */
  const currentSource = TAB_CONFIG.find(t => t.key === activeTab)?.source || '';

  return (
    <div className="min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">全球行情看板</h1>
            <p className="text-gray-500">
              一站式查看加密货币、美股、A股及贵金属实时行情
            </p>
          </div>

          {/* 刷新按钮 + 更新时间 */}
          <div className="flex items-center gap-3">
            {currentUpdated && (
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock size={14} />
                <span>更新于 {currentUpdated.toLocaleTimeString('zh-CN')}</span>
              </div>
            )}
            <motion.button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw size={14} className={currentLoading ? 'animate-spin' : ''} />
              刷新
            </motion.button>
          </div>
        </motion.div>

        {/* Tab 切换 */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {TAB_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-200 hover:text-primary-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={16} />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* 数据源说明 */}
        <motion.div
          className="flex items-center gap-2 mb-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span>数据来源：{currentSource}</span>
          {activeTab === 'us-stock' && (
            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
              demo key 仅支持 AAPL，其他股票需配置 API Key
            </span>
          )}
        </motion.div>

        {/* 错误提示 */}
        {currentError && (
          <motion.div
            className="flex items-center gap-2 p-4 mb-6 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={16} />
            <span>{currentError}</span>
          </motion.div>
        )}

        {/* 数据网格 */}
        {currentLoading && currentData.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {currentData.map((item, index) => (
                <MarketCard
                  key={item.symbol}
                  item={item}
                  category={activeTab}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 底部说明 */}
        <motion.div
          className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl border border-primary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">数据说明</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 加密货币数据来自币安公开API，每60秒自动刷新</li>
            <li>• 美股数据来自 Twelve Data API（免费demo key仅支持AAPL，其他股票需注册免费API Key）</li>
            <li>• A股数据来自腾讯财经API，交易时段实时更新，非交易时段显示收盘价</li>
            <li>• 贵金属数据来自 Gold-API.com，每日更新</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
