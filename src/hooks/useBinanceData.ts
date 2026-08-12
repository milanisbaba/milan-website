import { useState, useEffect, useCallback } from 'react';
import type { CoinDisplay } from '../types';

/** 需要监控的币种列表及其配置信息 */
const COIN_CONFIG: Record<string, { name: string; color: string }> = {
  BTC: { name: 'Bitcoin', color: '#F7931A' },
  ETH: { name: 'Ethereum', color: '#627EEA' },
  BNB: { name: 'BNB', color: '#F3BA2F' },
  SOL: { name: 'Solana', color: '#9945FF' },
  XRP: { name: 'XRP', color: '#23292F' },
  ADA: { name: 'Cardano', color: '#0033AD' },
  DOGE: { name: 'Dogecoin', color: '#C2A633' },
  AVAX: { name: 'Avalanche', color: '#E84142' },
};

/** 代理服务器基础URL */
const PROXY_API_URL = '/api/crypto';

/**
 * 自定义Hook：获取加密货币实时行情数据
 * 通过代理服务器获取数据，解决CORS跨域问题
 * 支持自动刷新（默认60秒间隔）
 * @param refreshInterval 刷新间隔（毫秒），默认60000
 */
export function useBinanceData(refreshInterval: number = 60000) {
  const [coins, setCoins] = useState<CoinDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /** 格式化数字显示（添加千分位逗号） */
  const formatNumber = (value: number, decimals: number = 2): string => {
    if (isNaN(value) || value === 0) return '0.00';
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  /** 获取并处理加密货币数据 */
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      const response = await fetch(PROXY_API_URL);
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 将API数据转换为展示数据
      const displayData: CoinDisplay[] = data
        .map((coin: any) => {
          const config = COIN_CONFIG[coin.symbol];
          if (!config) return null;

          const price = coin.price || 0;
          const changePercent = coin.changePercent || coin.change || 0;

          return {
            symbol: coin.symbol,
            name: config.name,
            color: config.color,
            price: formatNumber(price, price < 1 ? 4 : 2),
            changePercent: changePercent.toFixed(2),
            isUp: changePercent >= 0,
            highPrice: formatNumber(coin.high || price, 2),
            lowPrice: formatNumber(coin.low || price, 2),
            volume: formatNumber((coin.volume || 0) / 1e6, 2) + 'M',
          };
        })
        .filter((item: CoinDisplay | null): item is CoinDisplay => item !== null);

      setCoins(displayData);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { coins, loading, error, lastUpdated, refetch: fetchData };
}
