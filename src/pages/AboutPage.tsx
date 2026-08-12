import { motion } from 'framer-motion';
import { 
  Code2, 
  Briefcase, 
  Heart, 
  MapPin, 
  Calendar, 
  Moon, 
  Gamepad2, 
  BookOpen, 
  HelpCircle,
  GraduationCap,
  Rocket,
  Baby,
  Palette,
  HardHat,
  Sparkles,
  Flame,
  Zap,
  Laugh,
} from 'lucide-react';

/** 从业经历数据 */
const EXPERIENCES = [
  {
    year: '2026 - 至今',
    title: 'AI 小学生',
    company: '家里蹲大学 · 自学系',
    desc: '刚入坑 AI 编程，每天和 ChatGPT 斗智斗勇。别人写代码靠经验，我写代码靠"帮我生成一段……"。目前正在努力从"复制粘贴工程师"进化为"提示词工程师"。',
    icon: Baby,
    color: 'from-pink-400 to-rose-500',
  },
  {
    year: '2012 - 2025',
    title: '创业老板（自封的）',
    company: '个人创业工作室',
    desc: '主要负责企业标准化设计与安全生产广告制作。说白了就是——甲方说"要大气的"，我就给大红；甲方说"要简约的"，我就给留白。13年创业路，从黑发干到了白发。',
    icon: Palette,
    color: 'from-amber-400 to-orange-500',
  },
  {
    year: '2007 - 2011',
    title: '设计专业毕业生',
    company: '东华大学 Raffles 设计专修学院',
    desc: '学的是设计，修的是审美，顺便把青春留在了校园里。四年最大的收获：学会了如何优雅地熬夜赶作业——这技能后来创业时直接派上了用场。',
    icon: GraduationCap,
    color: 'from-blue-400 to-indigo-500',
  },
];

/** 兴趣爱好列表 */
const HOBBIES = [
  { 
    icon: Moon, 
    name: '睡觉', 
    desc: '能躺着绝不坐着，能睡够8小时绝不少一分钟。中年人的最高礼仪。',
    gradient: 'from-indigo-400 to-purple-500',
    emoji: '😴',
  },
  { 
    icon: Gamepad2, 
    name: '打游戏', 
    desc: '手速虽然跟不上年轻人了，但意识还在。主要是为了证明：我还没老。',
    gradient: 'from-green-400 to-emerald-500',
    emoji: '🎮',
  },
  { 
    icon: BookOpen, 
    name: '看书', 
    desc: '从成功学到科幻小说，从AI入门到减肥指南。书架上最厚的那本是"如何30天学会编程"——翻了三年还没看完。',
    gradient: 'from-amber-400 to-orange-500',
    emoji: '📚',
  },
  { 
    icon: HelpCircle, 
    name: '还在想', 
    desc: '第五个爱好还没找到，目前正在认真思考中。如果你有好的建议，欢迎推荐。',
    gradient: 'from-pink-400 to-rose-500',
    emoji: '🤔',
  },
];

/** 动画变体 */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

/**
 * 关于我页面
 * 米兰的个人介绍——一个中年AI小学生的转型之路
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">关于我</h1>
          <p className="text-gray-500 text-lg">一个中年AI小学生</p>
        </motion.div>

        {/* 个人简介卡片 */}
        <motion.div
          className="glass rounded-3xl p-8 mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/milan-about.png"
                  alt="Milan"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 装饰标签 */}
              <div className="absolute -bottom-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-medium shadow-lg">
                正在加载中...
              </div>
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Milan</h2>
              <p className="text-primary-500 text-sm font-medium mb-3">
                中年转型选手 · AI编程练习生 · 减肥进行时
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                一个正在努力转型的中年人——白天跟 AI 编程死磕，晚上跟体重秤较劲。
                曾经创业13年，做过设计、搞过广告、当过"全能老板"。
                如今重新出发，从零开始学编程，发现最难的bug不在代码里，在自己的脑子里。
                座右铭是"大器晚成"——虽然还没成，但安慰自己：迟早的事。
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-sm">
                  <MapPin size={14} /> 上海
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-sm">
                  <Calendar size={14} /> 中年
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm">
                  <Sparkles size={14} /> AI学徒
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm">
                  <Flame size={14} /> 减肥中
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 技术栈区域 */}
        <motion.div
          className="mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Zap size={24} className="text-primary-500" />
            技术栈
          </h2>
          <p className="text-gray-400 text-sm mb-6 ml-8">
            下面的我都不会，但好像学会 AI 也不用会 🤷
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { category: '前端开发', items: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Framer Motion'] },
              { category: '后端开发', items: ['Node.js', 'Express', 'NestJS', 'PostgreSQL', 'Redis', 'MongoDB'] },
              { category: '工具与部署', items: ['Git', 'Docker', 'CI/CD', 'AWS', 'Vercel', 'Linux'] },
            ].map((group) => (
              <div key={group.category} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover">
                <h3 className="font-semibold text-gray-800 mb-3">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-lg bg-gray-50 text-gray-600 text-sm border border-gray-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 从业经历时间线 */}
        <motion.div
          className="mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase size={24} className="text-primary-500" />
            从业经历
          </h2>
          <div className="space-y-6">
            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={index}
                className="relative pl-8 border-l-2 border-primary-200"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                {/* 时间线节点 */}
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br ${exp.color} border-4 border-white shadow`} />
                
                <div className="bg-white rounded-2xl p-6 border border-gray-100 card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-primary-500 font-medium">{exp.year}</span>
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${exp.color} flex items-center justify-center`}>
                      <exp.icon size={14} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{exp.company}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{exp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 兴趣爱好 */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Laugh size={24} className="text-accent-500" />
            兴趣爱好
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOBBIES.map((hobby, index) => (
              <motion.div
                key={hobby.name}
                className="bg-white rounded-2xl p-6 border border-gray-100 card-hover text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${hobby.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <hobby.icon size={24} className="text-white" />
                </div>
                <div className="text-2xl mb-2">{hobby.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-2">{hobby.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{hobby.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
