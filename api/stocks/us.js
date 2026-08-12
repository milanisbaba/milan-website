const STOCKS = {
  AAPL: { name: '苹果', sector: '科技' },
  MSFT: { name: '微软', sector: '科技' },
  GOOGL: { name: '谷歌', sector: '科技' },
  AMZN: { name: '亚马逊', sector: '电商' },
  NVDA: { name: '英伟达', sector: '芯片' },
  TSLA: { name: '特斯拉', sector: '汽车' },
  META: { name: 'Meta', sector: '社交' },
  NFLX: { name: '奈飞', sector: '娱乐' },
};

export default async function handler(req, res) {
  const symbols = (req.query.symbols || 'AAPL,MSFT,GOOGL,AMZN,NVDA,TSLA,META,NFLX').split(',');
  const results = [];
  for (const symbol of symbols) {
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`);
      const data = await response.json();
      const quote = data['Global Quote'] || {};
      const info = STOCKS[symbol] || { name: symbol, sector: '其他' };
      results.push({
        symbol,
        name: info.name,
        sector: info.sector,
        price: parseFloat(quote['05. price'] || '0'),
        change: parseFloat(quote['09. change'] || '0'),
        changePercent: parseFloat((quote['10. change percent'] || '0').replace('%', '')),
        volume: parseInt(quote['06. volume'] || '0'),
        high: parseFloat(quote['03. high'] || '0'),
        low: parseFloat(quote['04. low'] || '0'),
      });
    } catch {
      results.push({ symbol, name: STOCKS[symbol]?.name || symbol, sector: STOCKS[symbol]?.sector || '其他', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0 });
    }
  }
  res.status(200).json(results);
}
