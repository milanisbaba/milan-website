const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;

// 法律名称简化映射表
const LAW_NAME_MAP = {
  '《中华人民共和国劳动法》': '劳动法',
  '《中华人民共和国劳动合同法》': '劳动合同法',
  '《中华人民共和国社会保险法》': '社会保险法',
  '《中华人民共和国民法典》': '民法典',
  '《中华人民共和国消费者权益保护法》': '消费者权益保护法',
  '《中华人民共和国产品质量法》': '产品质量法',
  '《中华人民共和国道路交通安全法》': '道路交通安全法',
  '《中华人民共和国婚姻法》': '婚姻法',
  '《中华人民共和国继承法》': '继承法',
  '《中华人民共和国公司法》': '公司法',
  '《中华人民共和国刑法》': '刑法',
  '《中华人民共和国治安管理处罚法》': '治安管理处罚法',
  '《中华人民共和国行政诉讼法》': '行政诉讼法',
  '《中华人民共和国民事诉讼法》': '民事诉讼法',
  '《中华人民共和国刑事诉讼法》': '刑事诉讼法',
  '《商品房屋租赁管理办法》': '房屋租赁管理办法',
  '《工伤保险条例》': '工伤保险条例',
  '《劳动争议调解仲裁法》': '劳动争议调解仲裁法',
};

// 简化法律名称
function simplifyLawName(fullName) {
  return LAW_NAME_MAP[fullName] || fullName.replace('《中华人民共和国', '').replace('》', '');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body || {};

  if (!question || question.trim().length < 5) {
    return res.status(400).json({ error: '请输入至少5个字的问题描述' });
  }

  if (!DASHSCOPE_API_KEY) {
    return res.status(500).json({ error: 'AI 服务未配置，请联系管理员' });
  }

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: `你是一位专业的中国法律顾问，精通中华人民共和国各项法律法规。

请用通俗易懂的语言回答用户的法律问题，并严格按以下格式输出：

【问题分析】
（简要分析问题性质）

【相关法律】
1. 《法律名称》第X条：（法律条文内容）
2. 《法律名称》第X条：（法律条文内容）
3. 《法律名称》第X条：（法律条文内容）

【维权建议】
（给出具体可行的维权步骤）

注意：
- 必须引用具体的法律名称和条款号
- 法律条文要准确
- 建议要实用、可操作`,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'API 调用失败');
    }

    const aiResponse = data.choices?.[0]?.message?.content || '';

    // 解析 AI 回复，提取法律条文
    const laws = [];
    
    // 匹配格式：《法律名称》第X条
    const lawRegex = /《([^》]+)》[^，,\n]*第([0-9a-zA-Z百千万零一二三四五六七八九十]+)[条、]/g;
    let match;
    
    while ((match = lawRegex.exec(aiResponse)) !== null) {
      const fullName = `《${match[1]}》`;
      const article = `第${match[2]}条`;
      const simpleName = simplifyLawName(fullName);
      
      // 生成抖音搜索关键词（更精准）
      const videoKeyword = `${simpleName}${article}案例`;
      
      // 去重
      const exists = laws.find((l) => l.name === fullName && l.article === article);
      if (!exists) {
        laws.push({
          name: fullName,
          article: article,
          content: '',
          videoKeyword: videoKeyword,
        });
      }
    }

    // 如果没提取到法律条文，用默认值
    if (laws.length === 0) {
      laws.push({
        name: '《中华人民共和国民法典》',
        article: '相关条款',
        content: '',
        videoKeyword: '民法典案例科普',
      });
    }

    res.status(200).json({
      analysis: aiResponse,
      category: 'AI 分析',
      laws: laws.slice(0, 5), // 最多返回5条
      advice: '以上分析仅供参考，具体案件请咨询专业律师。',
      isAI: true,
    });
  } catch (error) {
    console.error('AI 调用失败:', error);
    res.status(500).json({ error: 'AI 服务暂时不可用，请稍后重试' });
  }
}
