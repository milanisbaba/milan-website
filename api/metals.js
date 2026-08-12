const METALS = {
  XAU: { name: '黄金', unit: '美元/盎司' },
  XAG: { name: '白银', unit: '美元/盎司' },
  XPT: { name: '铂金', unit: '美元/盎司' },
  XPD: { name: '钯金', unit: '美元/盎司' },
};

export default async function handler(req, res) {
  const symbol = req.query.symbol || 'XAU';
  const info = METALS[symbol] || { name: symbol, unit: '美元/盎司' };
  try {
    const response = await fetch(`https://api.gold-api.com/price/${symbol}`);
    const data = await response.json();
    res.status(200).json({
      symbol,
      name: info.name,
      unit: info.unit,
      price: data.price || 0,
      change: data.change || 0,
      changePercent: data.changePercent || 0,
      high: data.high || 0,
      low: data.low || 0,
      timestamp: data.timestamp || Date.now(),
    });
  } catch {
    res.status(200).json({ symbol, name: info.name, unit: info.unit, price: 0, change: 0, changePercent: 0, high: 0, low: 0, timestamp: Date.now() });
  }
}
