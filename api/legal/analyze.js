const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;

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
            content: '你是一位专业的中国法律顾问，精通中华人民共和国各项法律法规。请用通俗易懂的语言回答用户的法律问题，并引用具体的法律条文。回答格式：先分析问题性质，然后列出相关法律条文（包括法律名称、条款号、具体内容），最后给出维权建议。',
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

    const laws = [];
    const lawRegex = /《([^》]+)》[^，,]*第([0-9a-zA-Z百千万零一二三四五六七八九十]+)[条、]/g;
    let match;
    while ((match = lawRegex.exec(aiResponse)) !== null) {
      laws.push({
        name: `《${match[1]}》`,
        article: `第${match[2]}条`,
        content: '',
        videoKeyword: `${match[1]}${match[2]}条科普`,
      });
    }

    const uniqueLaws = laws.filter((law, index, self) => 
      index === self.findIndex((l) => l.name === law.name && l.article === law.article)
    );

    res.status(200).json({
      analysis: aiResponse,
      category: 'AI 分析',
      laws: uniqueLaws.slice(0, 5),
      advice: '以上分析仅供参考，具体案件请咨询专业律师。',
      isAI: true,
    });
  } catch (error) {
    console.error('AI 调用失败:', error);
    res.status(500).json({ error: 'AI 服务暂时不可用，请稍后重试' });
  }
}
