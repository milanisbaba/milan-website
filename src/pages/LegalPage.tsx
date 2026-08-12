/**
 * 公益法务查询页面
 * 提供AI法律咨询功能，基于中国法律文献进行分析
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  Send, 
  User, 
  Bot, 
  BookOpen, 
  AlertCircle,
  Loader2,
  FileText,
  Gavel,
  Play
} from 'lucide-react';
import type { LegalMessage, LegalReference } from '../types';

/** 预设常见问题 */
const PRESET_QUESTIONS = [
  '劳动合同到期公司不续签，有补偿吗？',
  '房东不退押金怎么办？',
  '网购商品如何七天无理由退货？',
  '被公司拖欠工资如何维权？',
  '交通事故赔偿标准是什么？',
];

/** 法律分类 */
const LEGAL_CATEGORIES = [
  { id: 'labor', name: '劳动纠纷', icon: '💼' },
  { id: 'contract', name: '合同纠纷', icon: '📄' },
  { id: 'consumer', name: '消费维权', icon: '🛒' },
  { id: 'tort', name: '侵权责任', icon: '⚖️' },
  { id: 'family', name: '婚姻家庭', icon: '👨‍👩‍👧' },
  { id: 'property', name: '房产纠纷', icon: '🏠' },
];

export default function LegalPage() {
  const [messages, setMessages] = useState<LegalMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是AI法务助手。请描述您遇到的法律问题，我会为您分析相关法律规定并提供参考案例。\n\n您可以：\n1. 直接输入问题描述\n2. 点击下方的常见问题快速咨询\n3. 选择法律分类获取针对性帮助',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** 自动滚动到最新消息 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** 发送消息 */
  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: LegalMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 调用后端API进行法律分析
      const response = await fetch('/api/legal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: content.trim(),
          category: selectedCategory 
        }),
      });

      if (!response.ok) {
        throw new Error('分析失败');
      }

      const data = await response.json();
      
      // 构建回复内容
      let fullContent = data.analysis;
      if (data.advice) {
        fullContent += '\n\n' + data.advice;
      }
      
      // 转换法律引用格式
      const references: LegalReference[] = (data.laws || []).map((law: { name: string; article: string; content: string; videoKeyword?: string }) => ({
        law: law.name,
        article: law.article,
        content: law.content,
        videoKeyword: law.videoKeyword,
      }));

      const assistantMessage: LegalMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullContent,
        references: references.length > 0 ? references : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: LegalMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，分析过程中出现错误。请稍后重试或换个方式描述您的问题。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /** 处理预设问题点击 */
  const handlePresetClick = (question: string) => {
    handleSend(question);
  };

  /** 处理分类选择 */
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50">
            <Scale className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              公益法务查询
            </h1>
          </div>
          <p className="mt-4 text-slate-600">
            AI智能分析 · 基于中华人民共和国法律法规 · 提供参考意见
          </p>
        </motion.div>

        {/* 法律分类选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {LEGAL_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${selectedCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200/50'
                  }
                `}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 对话区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden"
        >
          {/* 消息列表 */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            <AnimatePresence mode="wait">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* 头像 */}
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                    ${message.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    }
                  `}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* 消息内容 */}
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`
                      inline-block p-4 rounded-2xl
                      ${message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                      }
                    `}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>

                    {/* 法律引用 */}
                    {message.references && message.references.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <BookOpen className="w-4 h-4" />
                          <span>相关法律依据</span>
                        </div>
                        {message.references.map((ref, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-left"
                          >
                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-indigo-900">
                                  {ref.law}
                                </p>
                                <p className="text-xs text-indigo-700 mt-1">
                                  {ref.article}
                                </p>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                  {ref.content}
                                </p>
                                {/* 相关抖音视频 */}
                                {ref.videoKeyword && (
                                  <a
                                    href={`https://www.douyin.com/search/${encodeURIComponent(ref.videoKeyword)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm hover:shadow-md"
                                  >
                                    <Play size={12} fill="white" />
                                    <span>看视频理解此法条</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* 时间戳 */}
                    <p className={`text-xs text-slate-400 mt-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                      {message.timestamp.toLocaleTimeString('zh-CN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* 加载状态 */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-sm text-slate-600">正在分析法律问题...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 预设问题 */}
          {messages.length <= 1 && (
            <div className="px-6 pb-4">
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                常见问题（点击快速咨询）
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetClick(question)}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition-colors disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 输入区域 */}
          <div className="border-t border-slate-200/50 p-4 bg-white/50">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(inputValue);
                  }
                }}
                placeholder="请描述您遇到的法律问题..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all disabled:opacity-50 text-sm"
              />
              <button
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">发送</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              <Gavel className="w-3 h-3 inline mr-1" />
              本服务仅供参考，不构成法律意见。复杂问题建议咨询专业律师。
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
