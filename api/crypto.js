export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.alternative.me/v2/ticker/?limit=10&convert=USD');
    const data = await response.json();
    const coins = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'DOT', 'AVAX', 'MATIC'];
    const result = coins.map((symbol) => {
      const coin = data.data?.[symbol];
      if (!coin) return { symbol, name: symbol, price: 0, change24h: 0, volume24h: 0, marketCap: 0 };
      const quote = coin.quotes?.USD || {};
      return {
        symbol,
        name: coin.name,
        price: quote.price || 0,
        change24h: quote.percent_change_24h || 0,
        volume24h: quote.volume_24h || 0,
        marketCap: quote.market_cap || 0,
      };
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: '加密货币数据获取失败' });
  }
}
