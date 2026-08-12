import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code2, Globe, Database, Smartphone, Sparkles, ArrowRight } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

/** 核心技能标签列表 */
const SKILLS = [
  { name: 'React', icon: Code2, color: 'from-blue-400 to-blue-600' },
  { name: 'TypeScript', icon: Code2, color: 'from-blue-500 to-indigo-600' },
  { name: 'Node.js', icon: Globe, color: 'from-green-400 to-green-600' },
  { name: 'Next.js', icon: Globe, color: 'from-gray-700 to-gray-900' },
  { name: 'PostgreSQL', icon: Database, color: 'from-blue-400 to-blue-700' },
  { name: 'Tailwind CSS', icon: Sparkles, color: 'from-cyan-400 to-cyan-600' },
  { name: 'Docker', icon: Globe, color: 'from-sky-400 to-sky-600' },
  { name: 'React Native', icon: Smartphone, color: 'from-purple-400 to-purple-600' },
];

/** 动画变体配置 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * 头像交互组件
 * 鼠标跟随3D倾斜 + 光晕 + 悬浮缩放特效
 */
function AvatarInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  /** 鼠标移动时计算3D倾斜角度和光晕位置 */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 倾斜角度（最大15度）
    const rY = ((x - centerX) / centerX) * 15;
    const rX = ((centerY - y) / centerY) * 15;
    setRotateX(rX);
    setRotateY(rY);

    // 光晕位置（百分比）
    setGlowX((x / rect.width) * 100);
    setGlowY((y / rect.height) * 100);
  };

  /** 鼠标离开时恢复 */
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlowX(50);
    setGlowY(50);
    setIsHovered(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* 外层浮动动画 */}
      <motion.div
        className="relative"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* 3D倾斜容器 */}
        <div
          className="relative w-64 h-64 lg:w-80 lg:h-80"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* 渐变边框光环 */}
          <motion.div
            className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 blur-sm"
            animate={{
              opacity: isHovered ? 0.8 : 0,
              rotate: isHovered ? [0, 360] : 0,
            }}
            transition={{
              opacity: { duration: 0.3 },
              rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
            }}
          />

          {/* 主图片卡片 */}
          <motion.div
            className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-primary-200/30 cursor-pointer"
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.05 : 1})`,
              transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
              boxShadow: isHovered
                ? '0 25px 60px -12px rgba(79, 70, 229, 0.35), 0 0 40px -8px rgba(236, 72, 153, 0.2)'
                : '0 25px 50px -12px rgba(79, 70, 229, 0.15)',
            }}
          >
            {/* 头像图片 */}
            <img
              src="/milan-avatar.jpg"
              alt="米兰"
              className="w-full h-full object-cover"
            />

            {/* 鼠标跟随光晕 */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.35) 0%, transparent 60%)`,
              }}
            />

            {/* 底部标签 */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-2 text-white">
                <Sparkles size={14} className="text-yellow-300" />
                <span className="text-sm font-medium">米兰 · 正在加载中...</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 装饰元素 */}
        <motion.div
          className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl opacity-60 blur-sm"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            rotate: isHovered ? [0, 10, 0] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl opacity-60 blur-sm"
          animate={{
            scale: isHovered ? [1, 1.3, 1] : 1,
            rotate: isHovered ? [0, -10, 0] : 0,
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}

/**
 * 首页组件
 * 包含个人简介、技能标签云和AI对话入口
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero区域 - 个人介绍 */}
      <section className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 左侧 - 个人头像与信息 */}
            <motion.div className="flex-1 text-center lg:text-left" variants={itemVariants}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-sm mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles size={14} />
                <span>未来的全栈开发工程师</span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
                variants={itemVariants}
              >
                我是米兰，一个
                <span className="gradient-text block mt-2">"失业家"</span>
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 mb-8 max-w-lg"
                variants={itemVariants}
              >
                一个正在努力转型的中年人——白天跟 AI 编程死磕，晚上跟体重秤较劲。
                左手学 Prompt Engineering，右手甩掉最后一斤倔强。
                相信"大器晚成"这四个字，迟早会轮到我。
              </motion.p>

              <motion.div className="flex flex-wrap gap-4 justify-center lg:justify-start" variants={itemVariants}>
                <a
                  href="/portfolio"
                  className="gradient-btn px-6 py-3 rounded-xl font-medium flex items-center gap-2 text-sm"
                >
                  查看作品
                  <ArrowRight size={16} />
                </a>
                <a
                  href="/about"
                  className="px-6 py-3 rounded-xl font-medium border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
                >
                  了解更多
                </a>
              </motion.div>
            </motion.div>

            {/* 右侧 - 头像区域（3D悬浮特效） */}
            <motion.div className="flex-shrink-0" variants={itemVariants}>
              <AvatarInteractive />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 技能标签云区域 */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">核心技能</h2>
            <p className="text-gray-500">以下技能现在全不会，不过我正在学</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {SKILLS.map((skill) => (
              <motion.div
                key={skill.name}
                className="group p-5 rounded-2xl bg-white border border-gray-100 card-hover cursor-default"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <skill.icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">{skill.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI对话入口提示区域 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-accent-600 p-8 sm:p-12 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">想了解更多你可以做的事？</h2>
              <p className="text-white/80 mb-6 text-lg">
                试试右下角的对话按钮——那里藏着一个正在努力"营业"的 AI 米兰。
                你可以问它技术栈（虽然还在学）、项目经历（虽然还没做）、人生规划（虽然还在减肥），
                或者纯粹聊聊天，看看它能不能接住你的梗。
              </p>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>AI 米兰已就位，随时准备被拷问</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 悬浮对话组件 */}
      <ChatWidget />
    </div>
  );
}
