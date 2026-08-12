const legalKnowledgeBase = [
  {
    category: '劳动纠纷',
    keywords: ['工资', '拖欠', '加班', '辞退', '裁员', '劳动合同', '社保', '工伤', '离职', '失业'],
    laws: [
      { name: '《中华人民共和国劳动法》', article: '第五十条', content: '工资应当以货币形式按月支付给劳动者本人。不得克扣或者无故拖欠劳动者的工资。', videoKeyword: '拖欠工资劳动法科普' },
      { name: '《中华人民共和国劳动合同法》', article: '第四十七条', content: '经济补偿按劳动者在本单位工作的年限，每满一年支付一个月工资的标准向劳动者支付。', videoKeyword: '裁员经济补偿金怎么算' },
      { name: '《中华人民共和国社会保险法》', article: '第三十三条', content: '职工应当参加工伤保险，由用人单位缴纳工伤保险费，职工不缴纳工伤保险费。', videoKeyword: '工伤认定流程科普' },
    ],
  },
  {
    category: '合同纠纷',
    keywords: ['合同', '违约', '欠款', '借贷', '借款', '欠条', '协议', '赔偿', '违约金'],
    laws: [
      { name: '《中华人民共和国民法典》', article: '第五百七十七条', content: '当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。', videoKeyword: '合同违约怎么起诉' },
      { name: '《中华人民共和国民法典》', article: '第六百六十七条', content: '借款合同是借款人向贷款人借款，到期返还借款并支付利息的合同。', videoKeyword: '民间借贷法律规定' },
      { name: '《中华人民共和国民法典》', article: '第一百八十八条', content: '向人民法院请求保护民事权利的诉讼时效期间为三年。', videoKeyword: '诉讼时效三年科普' },
    ],
  },
  {
    category: '消费维权',
    keywords: ['消费', '退货', '退款', '假货', '欺诈', '质量', '售后', '七天', '投诉', '押金', '押金不退'],
    laws: [
      { name: '《中华人民共和国消费者权益保护法》', article: '第二十五条', content: '经营者采用网络、电视、电话、邮购等方式销售商品，消费者有权自收到商品之日起七日内退货，且无需说明理由。', videoKeyword: '七天无理由退货法律规定' },
      { name: '《中华人民共和国消费者权益保护法》', article: '第五十五条', content: '经营者提供商品或者服务有欺诈行为的，应当按照消费者的要求增加赔偿其受到的损失，增加赔偿的金额为消费者购买商品的价款或者接受服务的费用的三倍。', videoKeyword: '退一赔三法律规定' },
      { name: '《中华人民共和国产品质量法》', article: '第四十条', content: '售出的产品不具备产品应当具备的使用性能而事先未作说明的，销售者应当负责修理、更换、退货。', videoKeyword: '产品质量问题维权' },
    ],
  },
  {
    category: '侵权责任',
    keywords: ['侵权', '赔偿', '人身损害', '交通事故', '医疗', '名誉', '隐私', '肖像', '撞人', '受伤'],
    laws: [
      { name: '《中华人民共和国民法典》', article: '第一千一百六十五条', content: '行为人因过错侵害他人民事权益造成损害的，应当承担侵权责任。', videoKeyword: '侵权责任法科普' },
      { name: '《中华人民共和国民法典》', article: '第一千一百七十九条', content: '侵害他人造成人身损害的，应当赔偿医疗费、护理费、交通费、营养费、住院伙食补助费等为治疗和康复支出的合理费用。', videoKeyword: '人身损害赔偿标准' },
      { name: '《中华人民共和国道路交通安全法》', article: '第七十六条', content: '机动车发生交通事故造成人身伤亡、财产损失的，由保险公司在机动车第三者责任强制保险责任限额范围内予以赔偿。', videoKeyword: '交通事故赔偿流程' },
    ],
  },
  {
    category: '婚姻家庭',
    keywords: ['离婚', '结婚', '财产', '抚养', '赡养', '继承', '遗产', '家暴', '彩礼', '婚前'],
    laws: [
      { name: '《中华人民共和国民法典》', article: '第一千零七十九条', content: '夫妻一方要求离婚的，可以由有关组织进行调解或者直接向人民法院提起离婚诉讼。人民法院审理离婚案件，应当进行调解；如果感情确已破裂，调解无效的，应当准予离婚。', videoKeyword: '离婚诉讼流程科普' },
      { name: '《中华人民共和国民法典》', article: '第一千零八十七条', content: '离婚时，夫妻的共同财产由双方协议处理；协议不成的，由人民法院根据财产的具体情况，按照照顾子女、女方和无过错方权益的原则判决。', videoKeyword: '离婚财产分割法律规定' },
      { name: '《中华人民共和国民法典》', article: '第一千零六十七条', content: '父母不履行抚养义务的，未成年子女或者不能独立生活的成年子女，有要求父母给付抚养费的权利。', videoKeyword: '抚养费法律规定' },
    ],
  },
  {
    category: '房产纠纷',
    keywords: ['房产', '房屋', '租房', '房东', '租客', '物业', '拆迁', '产权', '买卖', '中介', '押金不退'],
    laws: [
      { name: '《中华人民共和国民法典》', article: '第七百零三条', content: '租赁合同是出租人将租赁物交付承租人使用、收益，承租人支付租金的合同。', videoKeyword: '租房合同法律规定' },
      { name: '《中华人民共和国民法典》', article: '第七百零四条', content: '租赁合同的内容一般包括租赁物的名称、数量、用途、租赁期限、租金及其支付期限和方式、租赁物维修等条款。', videoKeyword: '租房押金不退怎么办' },
      { name: '《商品房屋租赁管理办法》', article: '第九条', content: '出租人应当按照合同约定履行房屋的维修义务并确保房屋和室内设施安全。', videoKeyword: '房东维修义务法律规定' },
    ],
  },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body || {};

  if (!question || question.trim().length < 5) {
    return res.status(400).json({ error: '请输入至少5个字的问题描述' });
  }

  try {
    const q = question.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const item of legalKnowledgeBase) {
      let score = 0;
      for (const keyword of item.keywords) {
        if (q.includes(keyword)) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    if (!bestMatch || bestScore === 0) {
      bestMatch = legalKnowledgeBase[0];
    }

    const analysis = `根据您描述的情况，这可能涉及${bestMatch.category}问题。`;
    const advice = bestMatch.category === '劳动纠纷'
      ? '建议：1. 保留相关证据（工资条、考勤记录、劳动合同等）；2. 先与用人单位协商解决；3. 协商不成可向当地劳动监察大队投诉或申请劳动仲裁。'
      : bestMatch.category === '合同纠纷'
      ? '建议：1. 收集合同原件及相关证据；2. 先尝试与对方协商；3. 协商不成可向法院起诉，注意三年诉讼时效。'
      : bestMatch.category === '消费维权'
      ? '建议：1. 保留购物凭证和商品照片；2. 先与商家协商；3. 协商不成可
