/**
 * API 代理服务器
 * 解决浏览器 CORS 跨域限制，代理请求各类金融数据 API
 */
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import iconv from 'iconv-lite';

const app = express();
app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

const PORT = process.env.API_PROXY_PORT || 5001;

// Alpha Vantage API Key (demo key 仅支持 MSFT，其他股票需要用户自行申请免费 key)
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';

/**
 * 美股行情 - Alpha Vantage API
 * 文档: https://www.alphavantage.co/documentation/
 * 免费 key 申请: https://www.alphavantage.co/support/#api-key (每分钟5次，每日500次)
 */
app.get('/api/stocks/us', async (req, res) => {
  const symbols = (req.query.symbols as string || 'MSFT').split(',');
  
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query`,
            {
              params: {
                function: 'GLOBAL_QUOTE',
                symbol: symbol.trim(),
                apikey: ALPHA_VANTAGE_KEY
              },
              timeout: 10000
            }
          );
          
          const data = response.data['Global Quote'];
          if (!data || !data['05. price']) {
            return { symbol: symbol.trim(), error: '数据不可用' };
          }
          
          return {
            symbol: symbol.trim(),
            price: parseFloat(data['05. price']),
            change: parseFloat(data['09. change']),
            changePercent: parseFloat(data['10. change percent'].replace('%', '')),
            open: parseFloat(data['02. open']),
            high: parseFloat(data['03. high']),
            low: parseFloat(data['04. low']),
            volume: parseInt(data['06. volume']),
            previousClose: parseFloat(data['08. previous close'])
          };
        } catch (error) {
          console.error(`Alpha Vantage error for ${symbol}:`, error.message);
          return { symbol: symbol.trim(), error: '获取失败' };
        }
      })
    );
    
    res.json(results);
  } catch (error: any) {
    console.error('US stocks API error:', error.message);
    res.status(500).json({ error: '美股数据获取失败' });
  }
});

/**
 * A股行情 - 腾讯财经 API
 * 免费公开接口，无需 API Key
 */
app.get('/api/stocks/cn', async (req, res) => {
  const symbols = (req.query.symbols as string || 'sh600519').split(',');
  
  try {
    const querySymbols = symbols.map(s => s.trim()).join(',');
    const response = await axios.get(
      `http://qt.gtimg.cn/q=${querySymbols}`,
      {
        timeout: 10000,
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'http://finance.qq.com/'
        }
      }
    );
    
    // 腾讯财经API返回GBK编码，需要转换为UTF-8
    const text = iconv.decode(Buffer.from(response.data), 'gbk');
    const lines = text.split(';').filter(line => line.trim());
    
    const results = lines.map(line => {
      const match = line.match(/v_(\w+)="(.+)"/);
      if (!match) return null;
      
      const [, symbol, data] = match;
      const fields = data.split('~');
      
      if (fields.length < 50) return { symbol, error: '数据格式异常' };
      
      return {
        symbol,
        name: fields[1],
        price: parseFloat(fields[3]),
        change: parseFloat(fields[31]),
        changePercent: parseFloat(fields[32]),
        open: parseFloat(fields[5]),
        high: parseFloat(fields[33]),
        low: parseFloat(fields[34]),
        volume: parseFloat(fields[36]) * 10000, // 万手 -> 手
        previousClose: parseFloat(fields[4])
      };
    }).filter(Boolean);
    
    res.json(results);
  } catch (error: any) {
    console.error('CN stocks API error:', error.message);
    res.status(500).json({ error: 'A股数据获取失败' });
  }
});

/**
 * 贵金属行情 - Gold-API.com
 * 免费公开接口，无需 API Key
 * 支持: XAU(黄金), XAG(白银), XPT(铂金), XPD(钯金)
 */
app.get('/api/metals', async (req, res) => {
  const symbol = (req.query.symbol as string || 'XAU').toUpperCase();
  
  try {
    const response = await axios.get(
      `https://api.gold-api.com/price/${symbol}`,
      { timeout: 10000 }
    );
    
    const data = response.data;
    
    res.json({
      symbol,
      price: data.price,
      high: data.high_price,
      low: data.low_price,
      change: data.price - data.prev_close_price,
      changePercent: ((data.price - data.prev_close_price) / data.prev_close_price) * 100,
      previousClose: data.prev_close_price
    });
  } catch (error: any) {
    console.error(`Metals API error for ${symbol}:`, error.message);
    res.status(500).json({ error: '贵金属数据获取失败' });
  }
});

/**
 * 加密货币行情 - Alternative.me API
 * 文档: https://alternative.me/crypto/api/
 * 免费，无需 API Key
 */
app.get('/api/crypto', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.alternative.me/v2/ticker/',
      {
        params: { limit: 10, convert: 'USD' },
        timeout: 10000
      }
    );
    
    const data = response.data.data;
    const coins = Object.values(data).map((coin: any) => ({
      symbol: coin.symbol,
      name: coin.name,
      price: coin.quotes.USD.price,
      change: coin.quotes.USD.percent_change_24h,
      changePercent: coin.quotes.USD.percent_change_24h,
      volume: coin.quotes.USD.volume_24h,
      marketCap: coin.quotes.USD.market_cap,
      high: coin.quotes.USD.price * (1 + Math.abs(coin.quotes.USD.percent_change_24h) / 100),
      low: coin.quotes.USD.price * (1 - Math.abs(coin.quotes.USD.percent_change_24h) / 100)
    }));
    
    res.json(coins);
  } catch (error: any) {
    console.error('Crypto API error:', error.message);
    res.status(500).json({ error: '加密货币数据获取失败' });
  }
});

/**
 * 公益法务查询 - 基于关键词匹配的法律分析
 * 使用中国法律法规知识库进行智能匹配
 */
app.post('/api/legal/analyze', async (req, res) => {
  const { question } = req.body;
  
  if (!question || question.trim().length < 5) {
    return res.status(400).json({ error: '请输入至少5个字的问题描述' });
  }

  // 法律知识库 - 常见法律场景（每条法条附带抖音视频搜索关键词）
  const legalKnowledgeBase = [
    {
      keywords: ['劳动', '工资', '加班', '辞退', '解雇', '裁员', '社保', '公积金', '工伤', '休假'],
      category: '劳动争议',
      analysis: '根据您描述的情况，这可能涉及劳动争议问题。',
      laws: [
        { name: '《中华人民共和国劳动法》', article: '第五十条', content: '工资应当以货币形式按月支付给劳动者本人。不得克扣或者无故拖欠劳动者的工资。', videoKeyword: '拖欠工资劳动法科普' },
        { name: '《中华人民共和国劳动合同法》', article: '第四十七条', content: '经济补偿按劳动者在本单位工作的年限，每满一年支付一个月工资的标准向劳动者支付。', videoKeyword: '裁员经济补偿金怎么算' },
        { name: '《中华人民共和国社会保险法》', article: '第三十三条', content: '职工应当参加工伤保险，由用人单位缴纳工伤保险费，职工不缴纳工伤保险费。', videoKeyword: '工伤认定流程科普' }
      ],
      advice: '建议：1. 保留相关证据（工资条、考勤记录、劳动合同等）；2. 先与用人单位协商解决；3. 协商不成可向当地劳动监察大队投诉或申请劳动仲裁。'
    },
    {
      keywords: ['租房', '房东', '租客', '押金', '合同', '退租', '违约', '中介'],
      category: '房屋租赁',
      analysis: '根据您描述的情况，这可能涉及房屋租赁合同纠纷。',
      laws: [
        { name: '《中华人民共和国民法典》', article: '第七百零三条', content: '租赁合同是出租人将租赁物交付承租人使用、收益，承租人支付租金的合同。', videoKeyword: '租房合同纠纷民法典' },
        { name: '《中华人民共和国民法典》', article: '第七百一十四条', content: '承租人应当妥善保管租赁物，因保管不善造成租赁物毁损、灭失的，应当承担赔偿责任。', videoKeyword: '租房押金不退怎么办' },
        { name: '《商品房屋租赁管理办法》', article: '第九条', content: '出租人应当按照合同约定履行房屋的维修义务。', videoKeyword: '房东维修义务法律规定' }
      ],
      advice: '建议：1. 仔细查看租赁合同条款；2. 保留沟通记录和付款凭证；3. 协商不成可向当地住建部门投诉或向法院起诉。'
    },
    {
      keywords: ['离婚', '结婚', '财产', '抚养', '孩子', '家暴', '出轨', '分居'],
      category: '婚姻家庭',
      analysis: '根据您描述的情况，这可能涉及婚姻家庭法律问题。',
      laws: [
        { name: '《中华人民共和国民法典》', article: '第一千零七十九条', content: '夫妻一方要求离婚的，可以由有关组织进行调解或者直接向人民法院提起离婚诉讼。', videoKeyword: '离婚诉讼流程科普' },
        { name: '《中华人民共和国民法典》', article: '第一千零八十七条', content: '离婚时，夫妻的共同财产由双方协议处理；协议不成的，由人民法院根据财产的具体情况，按照照顾子女、女方和无过错方权益的原则判决。', videoKeyword: '离婚财产分割怎么判' },
        { name: '《中华人民共和国民法典》', article: '第一千零八十四条', content: '离婚后，不满两周岁的子女，以由母亲直接抚养为原则。', videoKeyword: '离婚后孩子抚养权归属' }
      ],
      advice: '建议：1. 收集相关证据（财产证明、家暴证据等）；2. 可先尝试调解；3. 必要时咨询专业律师，通过诉讼解决。'
    },
    {
      keywords: ['欠款', '借钱', '债务', '追债', '借条', '欠条', '不还'],
      category: '债权债务',
      analysis: '根据您描述的情况，这可能涉及债权债务纠纷。',
      laws: [
        { name: '《中华人民共和国民法典》', article: '第六百六十七条', content: '借款合同是借款人向贷款人借款，到期返还借款并支付利息的合同。', videoKeyword: '借钱不还有什么法律后果' },
        { name: '《中华人民共和国民法典》', article: '第六百七十五条', content: '借款人应当按照约定的期限返还借款。', videoKeyword: '借条怎么写才有法律效力' },
        { name: '《中华人民共和国民法典》', article: '第一百八十八条', content: '向人民法院请求保护民事权利的诉讼时效期间为三年。', videoKeyword: '诉讼时效三年怎么算' }
      ],
      advice: '建议：1. 保留借条、转账记录等证据；2. 先与对方协商还款；3. 协商不成可向法院起诉，注意诉讼时效为3年。'
    },
    {
      keywords: ['消费者', '退货', '退款', '假货', '欺诈', '维权', '投诉', '商家'],
      category: '消费者权益',
      analysis: '根据您描述的情况，这可能涉及消费者权益保护问题。',
      laws: [
        { name: '《中华人民共和国消费者权益保护法》', article: '第二十四条', content: '经营者提供的商品或者服务不符合质量要求的，消费者可以依照国家规定、当事人约定退货，或者要求经营者履行更换、修理等义务。', videoKeyword: '七天无理由退货法律规定' },
        { name: '《中华人民共和国消费者权益保护法》', article: '第五十五条', content: '经营者提供商品或者服务有欺诈行为的，应当按照消费者的要求增加赔偿其受到的损失，增加赔偿的金额为消费者购买商品的价款或者接受服务的费用的三倍。', videoKeyword: '买到假货怎么维权退一赔三' },
        { name: '《中华人民共和国产品质量法》', article: '第四十条', content: '售出的产品有下列情形之一的，销售者应当负责修理、更换、退货。', videoKeyword: '产品质量问题维权科普' }
      ],
      advice: '建议：1. 保留购物凭证、聊天记录等证据；2. 向商家协商退换货；3. 可拨打12315投诉或向市场监管部门举报。'
    },
    {
      keywords: ['侵权', '抄袭', '版权', '商标', '专利', '知识产权'],
      category: '知识产权',
      analysis: '根据您描述的情况，这可能涉及知识产权侵权问题。',
      laws: [
        { name: '《中华人民共和国著作权法》', article: '第五十二条', content: '有下列侵权行为的，应当根据情况，承担停止侵害、消除影响、赔礼道歉、赔偿损失等民事责任。', videoKeyword: '著作权侵权怎么认定' },
        { name: '《中华人民共和国商标法》', article: '第五十七条', content: '有下列行为之一的，均属侵犯注册商标专用权。', videoKeyword: '商标侵权判断标准' },
        { name: '《中华人民共和国专利法》', article: '第六十五条', content: '未经专利权人许可，实施其专利，即侵犯其专利权。', videoKeyword: '专利侵权如何维权' }
      ],
      advice: '建议：1. 收集侵权证据（截图、公证等）；2. 向侵权方发送律师函；3. 必要时向法院起诉，要求停止侵权并赔偿损失。'
    }
  ];

  // 关键词匹配
  let matchedCategory = null;
  let maxMatches = 0;

  for (const category of legalKnowledgeBase) {
    const matches = category.keywords.filter(keyword => question.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      matchedCategory = category;
    }
  }

  // 如果没有匹配到任何类别，返回通用回复
  if (!matchedCategory || maxMatches === 0) {
    return res.json({
      analysis: '根据您描述的情况，建议您咨询专业律师以获得更准确的法律意见。',
      category: '其他法律问题',
      laws: [
        { name: '《中华人民共和国民法典》', article: '第十条', content: '处理民事纠纷，应当依照法律；法律没有规定的，可以适用习惯，但是不得违背公序良俗。', videoKeyword: '民法典科普' }
      ],
      advice: '建议：1. 详细描述您的问题；2. 收集相关证据材料；3. 咨询当地法律援助中心或专业律师。'
    });
  }

  // 返回匹配的法律分析
  res.json({
    analysis: matchedCategory.analysis,
    category: matchedCategory.category,
    laws: matchedCategory.laws,
    advice: matchedCategory.advice
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API Proxy server running on port ${PORT}`);
});
