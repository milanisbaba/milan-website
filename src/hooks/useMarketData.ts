/**
 * 多市场行情数据 Hook
 * 通过后端代理服务器获取美股、A股、贵金属实时行情
 * 每个市场独立刷新，互不影响
 */
import { useState, useEffect, useCallback } from 'react';
import type { MarketItem } from '../types';

// 代理服务器基础 URL（开发环境使用相对路径，通过 Vite proxy 转发）
const API_BASE = '/api';

/**
 * 美股配置 - 通过 Alpha Vantage API 获取
 * 注意：demo key 仅支持 MSFT，其他股票需要用户自行申请免费 key
 * 免费申请: https://www.alphavantage.co/support/#api-key
 */
const US_STOCKS = [
  { symbol: 'MSFT', name: '微软', icon: '🪟' },
  { symbol: 'AAPL', name: '苹果', icon: '🍎' },
  { symbol: 'GOOGL', name: '谷歌', icon: '🔍' },
  { symbol: 'AMZN', name: '亚马逊', icon: '📦' },
  { symbol: 'NVDA', name: '英伟达', icon: '🎮' },
  { symbol: 'TSLA', name: '特斯拉', icon: '🚗' },
  { symbol: 'META', name: 'Meta', icon: '👤' },
  { symbol: 'NFLX', name: '奈飞', icon: '🎬' },
];

/**
 * A股配置 - 通过腾讯财经 API 获取
 * 代码格式：sh=上交所，sz=深交所
 */
const CN_STOCKS = [
  { symbol: 'sh600519', name: '贵州茅台', icon: '🍶' },
  { symbol: 'sz000858', name: '五粮液', icon: '🥃' },
  { symbol: 'sh601318', name: '中国平安', icon: '🛡️' },
  { symbol: 'sz300750', name: '宁德时代', icon: '🔋' },
  { symbol: 'sz002594', name: '比亚迪', icon: '🚙' },
  { symbol: 'sh600036', name: '招商银行', icon: '🏦' },
  { symbol: 'sh688981', name: '中芯国际', icon: '💾' },
  { symbol: 'sz000333', name: '美的集团', icon: '🏭' },
];

/**
 * 贵金属配置 - 通过 gold-api.com 获取
 */
const PRECIOUS_METALS = [
  { symbol: 'XAU', name: '黄金', icon: '🥇' },
  { symbol: 'XAG', name: '白银', icon: '🥈' },
  { symbol: 'XPT', name: '铂金', icon: '💎' },
  { symbol: 'XPD', name: '钯金', icon: '⚪' },
];

/** 市场数据类型 */
interface MarketDataState {
  data: MarketItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/** Hook 返回值类型 */
interface UseMarketDataReturn {
  usStocks: MarketDataState;
  cnStocks: MarketDataState;
  preciousMetals: MarketDataState;
  refreshAll: () => void;
}

/**
 * 获取美股行情
 * 通过代理服务器批量调用 Alpha Vantage API
 */
const fetchUSStocks = async (): Promise<MarketItem[]> => {
  const symbols = US_STOCKS.map(s => s.symbol).join(',');
  
  try {
    const response = await fetch(`${API_BASE}/stocks/us?symbols=${symbols}`);
    if (!response.ok) {
      throw new Error('请求失败');
    }
    
    const dataArray = await response.json();
    
    return US_STOCKS.map((stock, index) => {
      const data = dataArray[index];
      if (!data || data.error) {
        return {
          symbol: stock.symbol,
          name: stock.name,
          icon: stock.icon,
          price: 0,
          change: 0,
          changePercent: 0,
          high: 0,
          low: 0,
          volume: 0,
          marketCap: 0,
          currency: 'USD',
          error: true,
        };
      }
      
      return {
        symbol: data.symbol,
        name: stock.name,
        icon: stock.icon,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        high: data.high,
        low: data.low,
        volume: data.volume,
        marketCap: 0,
        currency: 'USD',
        updatedAt: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Failed to fetch US stocks:', error);
    return US_STOCKS.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      icon: stock.icon,
      price: 0,
      change: 0,
      changePercent: 0,
      high: 0,
      low: 0,
      volume: 0,
      marketCap: 0,
      currency: 'USD',
      error: true,
    }));
  }
};

/**
 * 获取A股行情
 * 通过代理服务器批量调用腾讯财经 API
 */
const fetchCNStocks = async (): Promise<MarketItem[]> => {
  const symbols = CN_STOCKS.map(s => s.symbol).join(',');
  
  try {
    const response = await fetch(`${API_BASE}/stocks/cn?symbols=${symbols}`);
    if (!response.ok) {
      throw new Error('请求失败');
    }
    
    const dataArray = await response.json();
    
    return CN_STOCKS.map((stock, index) => {
      const data = dataArray[index];
      if (!data || data.error) {
        return {
          symbol: stock.symbol,
          name: stock.name,
          icon: stock.icon,
          price: 0,
          change: 0,
          changePercent: 0,
          high: 0,
          low: 0,
          volume: 0,
          marketCap: 0,
          currency: 'CNY',
          error: true,
        };
      }
      
      return {
        symbol: data.symbol,
        name: data.name || stock.name,
        icon: stock.icon,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        high: data.high,
        low: data.low,
        volume: data.volume,
        marketCap: 0,
        currency: 'CNY',
        updatedAt: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Failed to fetch CN stocks:', error);
    return CN_STOCKS.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      icon: stock.icon,
      price: 0,
      change: 0,
      changePercent: 0,
      high: 0,
      low: 0,
      volume: 0,
      marketCap: 0,
      currency: 'CNY',
      error: true,
    }));
  }
};

/**
 * 获取贵金属行情
 * 通过代理服务器调用 gold-api.com
 */
const fetchPreciousMetals = async (): Promise<MarketItem[]> => {
  const results = await Promise.all(
    PRECIOUS_METALS.map(async (metal) => {
      try {
        const response = await fetch(`${API_BASE}/metals?symbol=${metal.symbol}`);
        if (!response.ok) {
          throw new Error('请求失败');
        }
        
        const data = await response.json();
        
        if (data.error) {
          return {
            symbol: metal.symbol,
            name: metal.name,
            icon: metal.icon,
            price: 0,
            change: 0,
            changePercent: 0,
            high: 0,
            low: 0,
            volume: 0,
            marketCap: 0,
            currency: 'USD',
            error: true,
          };
        }
        
        return {
          symbol: data.symbol,
          name: metal.name,
          icon: metal.icon,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          high: data.high,
          low: data.low,
          volume: 0,
          marketCap: 0,
          currency: 'USD',
          unit: '美元/盎司',
          updatedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error(`Failed to fetch ${metal.symbol}:`, error);
        return {
          symbol: metal.symbol,
          name: metal.name,
          icon: metal.icon,
          price: 0,
          change: 0,
          changePercent: 0,
          high: 0,
          low: 0,
          volume: 0,
          marketCap: 0,
          currency: 'USD',
          error: true,
        };
      }
    })
  );
  
  return results;
};

/**
 * 多市场行情数据 Hook
 * 管理美股、A股、贵金属三个市场的行情数据
 */
export function useMarketData(): UseMarketDataReturn {
  const [usStocks, setUsStocks] = useState<MarketDataState>({
    data: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });
  
  const [cnStocks, setCnStocks] = useState<MarketDataState>({
    data: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });
  
  const [preciousMetals, setPreciousMetals] = useState<MarketDataState>({
    data: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  // 刷新美股数据
  const refreshUSStocks = useCallback(async () => {
    setUsStocks(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchUSStocks();
      setUsStocks({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      setUsStocks(prev => ({
        ...prev,
        loading: false,
        error: '获取美股数据失败',
      }));
    }
  }, []);

  // 刷新A股数据
  const refreshCNStocks = useCallback(async () => {
    setCnStocks(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchCNStocks();
      setCnStocks({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      setCnStocks(prev => ({
        ...prev,
        loading: false,
        error: '获取A股数据失败',
      }));
    }
  }, []);

  // 刷新贵金属数据
  const refreshPreciousMetals = useCallback(async () => {
    setPreciousMetals(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchPreciousMetals();
      setPreciousMetals({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      setPreciousMetals(prev => ({
        ...prev,
        loading: false,
        error: '获取贵金属数据失败',
      }));
    }
  }, []);

  // 刷新所有市场
  const refreshAll = useCallback(() => {
    refreshUSStocks();
    refreshCNStocks();
    refreshPreciousMetals();
  }, [refreshUSStocks, refreshCNStocks, refreshPreciousMetals]);

  // 初始加载
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // 定时刷新（60秒）
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAll();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [refreshAll]);

  return {
    usStocks,
    cnStocks,
    preciousMetals,
    refreshAll,
  };
}
