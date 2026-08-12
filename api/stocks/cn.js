const CN_STOCKS = {
  sh600519: { name: '贵州茅台', market: 'SH' },
  sz000858: { name: '五粮液', market: 'SZ' },
  sh601318: { name: '中国平安', market: 'SH' },
  sz300750: { name: '宁德时代', market: 'SZ' },
  sh600036: { name: '招商银行', market: 'SH' },
  sz000333: { name: '美的集团', market: 'SZ' },
  sh601012: { name: '隆基绿能', market: 'SH' },
  sz002594: { name: '比亚迪', market: 'SZ' },
};

export default async function handler(req, res) {
  const results = [];
  const symbols = Object.keys(CN_STOCKS);
  try {
    const response = await fetch(`https://qt.gtimg.cn/q=${symbols.join(',')}`);
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('gbk');
    const decoded = decoder.decode(new Uint8Array(buffer));
    const lines = decoded.split(';').filter((l) => l.trim());
    for (const line of lines) {
      const match = line.match(/v_(\w+)="([^"]*)"/);
      if (!match) continue;
      const fields = match[2].split('~');
      if (fields.length < 10) continue;
      results.push({
        symbol: match[1],
        name: fields[1] || CN_STOCKS[match[1]]?.name || '未知',
        market: CN_STOCKS[match[1]]?.market || 'SH',
        price: parseFloat(fields[3] || '0'),
        change: parseFloat(fields[31] || '0'),
        changePercent: parseFloat(fields[32] || '0'),
        volume: parseInt(fields[36] || '0'),
        high: parseFloat(fields[33] || '0'),
        low: parseFloat(fields[34] || '0'),
      });
    }
  } catch {
    for (const [symbol, info] of Object.entries(CN_STOCKS)) {
      results.push({ symbol, name: info.name, market: info.market, price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0 });
    }
  }
  res.status(200).json(results);
}
