import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import type { ChatMessage, PresetQuestion } from '../types';

/** 预设问题与回复列表（以米兰第一人称口吻，风格幽默自嘲） */
const PRESET_QUESTIONS: PresetQuestion[] = [
  {
    question: '你的技术栈是什么？',
    answer: '说实话，我现在正在疯狂学习中！目前主攻 React、TypeScript 和 AI 编程，虽然还称不上精通，但每天都在进步。Tailwind CSS 已经能熟练使用了，Next.js 也在啃。我的目标是成为真正的全栈工程师——虽然现在还是个"未来的"全栈工程师，哈哈。',
  },
  {
    question: '你做过哪些项目？',
    answer: '目前最有代表性的就是这个个人品牌官网了！从零搭建，包含实时行情看板、AI对话模块、作品集展示。虽然规模不大，但每一个功能都是我边学边做的。接下来我计划做更多有意思的项目，你可以持续关注我的更新。',
  },
  {
    question: '如何联系你？',
    answer: '目前最好的方式就是通过这个网站留言啦！我虽然是个"失业家"，但回复消息还是很积极的。你也可以在 AI 对话里跟我聊天，虽然那个"AI米兰"有时候会犯傻，但大体上能代表我的想法。',
  },
  {
    question: '你对Web3怎么看？',
    answer: '我觉得 Web3 很有意思，所以专门做了个行情看板来追踪加密货币。不过说实话，我更多是出于技术好奇心，而不是投资目的。作为一个正在学习中的中年人，我觉得保持对新技术的敏感度比什么都重要。',
  },
  {
    question: '你的兴趣爱好是什么？',
    answer: '除了学 AI 编程，我现在最大的爱好就是减肥了！每天跟体重秤斗智斗勇。另外我也喜欢研究各种新技术，虽然学得不快，但胜在坚持。我觉得中年人的优势就是——有足够的耐心和阅历去理解技术的本质。',
  },
  {
    question: '你为什么失业？',
    answer: '哈哈，这个问题很直接！简单来说就是想换个赛道。与其在舒适区里混日子，不如出来闯一闯。现在我正在学习 AI 编程，准备转型。虽然过程有点辛苦，但我觉得人生嘛，总要有点折腾才有意思。',
  },
  {
    question: '你多大了？',
    answer: '到了"别人问年龄我会犹豫一下"的年纪了。不过我觉得年龄只是个数字，重要的是保持学习的热情和行动力。你看我，中年转型学编程、减肥、做网站，不也挺充实的嘛！',
  },
  {
    question: '你减肥成功了吗？',
    answer: '还在路上！体重秤上的数字起起落落，跟股市一样刺激。但我相信坚持就是胜利，就像学编程一样，每天进步一点点就好。等我成功了，一定在这里更新喜讯！',
  },
];

/** 关键词匹配规则：根据用户输入中的关键词返回对应回复 */
const KEYWORD_RESPONSES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['技术', '技术栈', '会什么', '技能', '编程', '语言'],
    answer: '我目前正在学习的技术包括 React、TypeScript、Tailwind CSS，还有 AI 编程相关的 Prompt Engineering。虽然还不敢说精通，但每天都在进步。我觉得中年人学技术的好处是——理解力更强，虽然手速可能不如年轻人了，哈哈。',
  },
  {
    keywords: ['项目', '作品', '做过', '经验', '经历'],
    answer: '目前最拿得出手的就是这个个人网站了！从设计到开发全部自己搞定，还集成了实时加密货币行情。虽然还在完善中，但每一步都是真实的学习成果。接下来我还想做更多有意思的项目。',
  },
  {
    keywords: ['联系', '邮箱', '微信', '怎么找', '沟通'],
    answer: '目前最直接的方式就是在这个网站跟我对话啦！我虽然自称"失业家"，但其实是个很乐意交流的人。有什么想聊的尽管问，我尽量秒回。',
  },
  {
    keywords: ['减肥', '瘦', '体重', '健身', '运动'],
    answer: '减肥是我目前的人生大事之一！每天都在跟美食做斗争，体重秤上的数字就像股票一样波动。不过我相信，只要坚持，总会看到变化的。就像学编程一样——急不来，但一定会进步。',
  },
  {
    keywords: ['年龄', '多大', '几岁', '中年', '老'],
    answer: '到了"开始养生了"的年纪了。不过我觉得年龄从来不是问题，问题是你还有没有勇气去折腾。我现在学编程、减肥、做网站，生活充实得很！中年人的字典里没有"来不及"。',
  },
  {
    keywords: ['失业', '工作', '离职', '辞职', '为什么'],
    answer: '失业嘛，换个角度看其实是"自由"。我选择主动跳出舒适区，给自己一个重新出发的机会。现在每天学 AI 编程、研究新技术，虽然收入暂时没了，但收获的成长是无价的。',
  },
  {
    keywords: ['AI', '人工智能', 'chatgpt', '大模型', 'prompt'],
    answer: 'AI 是我目前最热衷的学习方向！我觉得 AI 编程是未来的趋势，所以正在全力投入。这个网站的 AI 对话模块就是我用 AI 辅助搭建的——算是学以致用吧。虽然有时候 AI 也会犯傻，但总体来说是个很好的学习伙伴。',
  },
  {
    keywords: ['你好', '嗨', 'hi', 'hello', '在吗'],
    answer: '你好呀！欢迎来到米兰的小天地。有什么想了解的尽管问，不管是技术、减肥还是人生规划，我都乐意聊。虽然我不一定都懂，但至少态度是真诚的！',
  },
  {
    keywords: ['谢谢', '感谢', 'thanks', 'thx'],
    answer: '不客气！能帮到你我很开心。如果还有其他问题随时问我，虽然我是个"未来的全栈工程师"，但回答问题还是可以的，哈哈。',
  },
  {
    keywords: ['加密', '比特币', 'BTC', 'ETH', '币', '行情'],
    answer: '你对加密货币也感兴趣？我也是！所以我专门做了个行情看板来追踪主流币种的价格。不过我更多是技术层面的关注，而不是炒币。毕竟作为一个正在减肥的中年人，心脏经不起太大的波动，哈哈。',
  },
];

/** 默认回复（当无法匹配关键词时） */
const DEFAULT_RESPONSES = [
  '这个问题很有意思！不过作为一个正在学习中的中年人，我可能暂时给不了你完美的答案。但我会努力学习的，你可以先问问其他问题？',
  '嗯...这个问题超出了我目前的知识范围了。不过别担心，我正在努力提升自己，迟早能回答你的。要不先聊聊别的？',
  '好问题！但我现在还在"修炼"中，暂时答不上来。你可以试试问我关于技术学习、减肥心得、或者人生感悟方面的问题，这些我比较在行！',
  '哈哈，你这个问题把我问住了。虽然我是个"失业家"，但脑子还没失业！只是这个领域我还需要多学习。换个问题试试？',
];

/**
 * 根据用户输入智能匹配回复
 * 优先精确匹配预设问题，其次关键词匹配，最后随机默认回复
 */
function getAIResponse(userInput: string): string {
  const input = userInput.toLowerCase().trim();

  // 1. 精确匹配预设问题
  const exactMatch = PRESET_QUESTIONS.find(
    (p) => p.question === userInput.trim() || input.includes(p.question.toLowerCase())
  );
  if (exactMatch) return exactMatch.answer;

  // 2. 关键词匹配
  for (const rule of KEYWORD_RESPONSES) {
    const matched = rule.keywords.some((keyword) => input.includes(keyword.toLowerCase()));
    if (matched) return rule.answer;
  }

  // 3. 随机默认回复
  const randomIndex = Math.floor(Math.random() * DEFAULT_RESPONSES.length);
  return DEFAULT_RESPONSES[randomIndex];
}

/**
 * AI对话交互组件
 * 支持自由输入提问，AI以米兰的第一人称视角回复
 * 包含预设问题快捷按钮和文本输入框
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      content: '你好！我是 AI 米兰，一个正在努力"营业"的数字分身。你可以直接输入想问的问题，或者点击下方快捷按钮。虽然本尊还在学，但我会尽量接住你的问题！',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** 自动滚动到最新消息 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** 窗口打开时聚焦输入框 */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  /** 发送消息（支持自由输入） */
  const handleSend = (text?: string) => {
    const content = (text || inputValue).trim();
    if (!content || isTyping) return;

    // 添加用户消息
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 模拟思考延迟后回复
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const aiResponse = getAIResponse(content);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  /** 处理键盘回车发送 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /** 格式化时间显示 */
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* 悬浮触发按钮 */}
      <motion.button
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full gradient-btn shadow-lg shadow-primary-300/30 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 0 : [0, -10, 10, 0] }}
        transition={{ rotate: { duration: 0.5, repeat: isOpen ? 0 : Infinity, repeatDelay: 3 } }}
        aria-label="打开对话窗口"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      {/* 对话窗口 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-8rem)] rounded-2xl glass shadow-2xl shadow-primary-200/20 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* 对话窗口头部 */}
            <div className="px-5 py-4 border-b border-white/20 bg-gradient-to-r from-primary-500/10 to-accent-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">AI 米兰</h3>
                  <p className="text-xs text-gray-500">正在努力营业中...</p>
                </div>
              </div>
            </div>

            {/* 消息列表区域 */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* 头像 */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'ai'
                        ? 'bg-gradient-to-br from-primary-400 to-accent-400'
                        : 'bg-gray-200'
                    }`}
                  >
                    {msg.sender === 'ai' ? (
                      <Bot size={14} className="text-white" />
                    ) : (
                      <User size={14} className="text-gray-600" />
                    )}
                  </div>
                  
                  {/* 消息气泡 */}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'ai'
                        ? 'bg-white/80 text-gray-700 rounded-tl-md'
                        : 'bg-primary-500 text-white rounded-tr-md'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span
                      className={`text-[10px] mt-1 block ${
                        msg.sender === 'ai' ? 'text-gray-400' : 'text-white/70'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* AI正在输入指示器 */}
              {isTyping && (
                <motion.div
                  className="flex gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white/80 px-4 py-3 rounded-2xl rounded-tl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 底部输入区域 */}
            <div className="border-t border-white/20 bg-white/30">
              {/* 快捷问题按钮 */}
              <div className="px-4 pt-3 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_QUESTIONS.slice(0, 3).map((preset) => (
                    <motion.button
                      key={preset.question}
                      className="px-3 py-1.5 text-xs rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors border border-primary-100"
                      onClick={() => handleSend(preset.question)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isTyping}
                    >
                      {preset.question}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 文本输入框 */}
              <div className="px-4 pb-3 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你想问的问题..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/80 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                  disabled={isTyping}
                  maxLength={200}
                />
                <motion.button
                  className={`p-2.5 rounded-xl transition-colors ${
                    inputValue.trim() && !isTyping
                      ? 'gradient-btn shadow-md'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  onClick={() => handleSend()}
                  whileHover={{ scale: inputValue.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="发送消息"
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
