export default async function handler(req, res) {
  try {
    // 使用 OKX（欧易）API，国内可访问
    const response = await fetch('https://www.okx.com/api/v5/market/tickers?instType=SPOT');
    const data = await response.json();
    
    if (data.code !== '0' || !data.data) {
      throw new Error('API 返回错误');
    }
    
    // 筛选主流币种
    const targetCoins = ['BTC-USDT', 'ETH-USDT', 'BNB-USDT', 'SOL-USDT', 'XRP-USDT', 'ADA-USDT', 'DOGE-USDT', 'DOT-USDT', 'AVAX-USDT', 'MATIC-USDT'];
    
    const result = targetCoins.map((instId) => {
      const ticker = data.data.find((t) => t.instId === instId);
      if (!ticker) return { 
        symbol: instId.split('-')[0], 
        name: instId.split('-')[0], 
        price: 0, 
        change24h: 0, 
        volume24h: 0, 
        high24h: 0, 
        low24h: 0 
      };
      
      const openPrice = parseFloat(ticker.open24h || '0');
      const lastPrice = parseFloat(ticker.last || '0');
      const change = lastPrice - openPrice;
      const changePercent = openPrice > 0 ? (change / openPrice) * 100 : 0;
      
      return {
        symbol: instId.split('-')[0],
        name: instId.split('-')[0],
        price: lastPrice,
        change: change,
        change24h: changePercent,
        volume24h: parseFloat(ticker.vol24h || '0'),
        high24h: parseFloat(ticker.high24h || '0'),
        low24h: parseFloat(ticker.low24h || '0'),
      };
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('加密货币数据获取失败:', error);
    res.status(500).json({ error: '加密货币数据获取失败' });
  }
}
