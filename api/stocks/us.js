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
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
      const data = await response.json();
      const chart = data.chart?.result?.[0];
      if (!chart) throw new Error('No data');
      const quote = chart.indicators?.quote?.[0];
      const meta = chart.meta;
      const currentPrice = quote.close?.[quote.close.length - 1] || 0;
      const previousClose = meta.chartPreviousClose || meta.previousClose || 0;
      const change = currentPrice - previousClose;
      const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
      const info = STOCKS[symbol] || { name: symbol, sector: '其他' };
      results.push({
        symbol, name: info.name, sector: info.sector,
        price: currentPrice, change, changePercent,
        volume: quote.volume?.[quote.volume.length - 1] || 0,
        high: quote.high?.reduce((a, b) => Math.max(a, b), 0) || 0,
        low: quote.low?.reduce((a, b) => Math.min(a, b), 999999) || 0,
      });
    } catch {
      const info = STOCKS[symbol] || { name: symbol, sector: '其他' };
      results.push({ symbol, name: info.name, sector: info.sector, price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0 });
    }
  }
  res.status(200).json(results);
}
