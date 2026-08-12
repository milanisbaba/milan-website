import { motion } from 'framer-motion';
import { 
  Play, 
  Heart, 
  MessageCircle, 
  Share2, 
  ExternalLink, 
  Music,
  Video,
  Users,
  Sparkles,
} from 'lucide-react';

/** 
 * 抖音主页链接
 * TODO: 将此处替换为你的真实抖音主页地址
 */
const DOUYIN_PROFILE_URL = 'https://www.douyin.com/user/v6925308x';

/** 代表作品展示 */
const SHOWCASE_VIDEOS = [
  {
    title: '中年失业后，我决定学AI编程',
    views: '12.8万',
    likes: '1.2万',
    cover: 'https://picsum.photos/seed/dy1/400/560',
  },
  {
    title: '用AI 10分钟写了一个网页',
    views: '8.9万',
    likes: '8900',
    cover: 'https://picsum.photos/seed/dy2/400/560',
  },
  {
    title: '减肥第30天，掉了8斤！',
    views: '15.6万',
    likes: '1.5万',
    cover: 'https://picsum.photos/seed/dy3/400/560',
  },
  {
    title: 'React入门：5分钟搞懂组件',
    views: '6.7万',
    likes: '6700',
    cover: 'https://picsum.photos/seed/dy4/400/560',
  },
  {
    title: 'Prompt Engineering到底是个啥？',
    views: '9.2万',
    likes: '9200',
    cover: 'https://picsum.photos/seed/dy5/400/560',
  },
  {
    title: '中年人的早晨5点',
    views: '11.3万',
    likes: '1.1万',
    cover: 'https://picsum.photos/seed/dy6/400/560',
  },
];

/** 动画变体 */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * 作品集页面
 * 连接到个人抖音主页，展示代表作品预览
 */
export default function PortfolioPage() {
  return (
    <div className="min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 + 抖音主页入口 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">作品集</h1>
          <p className="text-gray-500 text-lg mb-6">
            所有作品和日常记录都发布在我的抖音，欢迎来串门
          </p>

          {/* 抖音主页大按钮 */}
          <motion.a
            href={DOUYIN_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-900 via-pink-600 to-cyan-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* 抖音风格音符图标 */}
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34.1 10.5A8.7 8.7 0 0 1 31 4h-6.3v27.3a5.3 5.3 0 0 1-5.3 5 5.3 5.3 0 0 1-5.3-5.3 5.3 5.3 0 0 1 5.3-5.3c.5 0 1.1.1 1.6.3v-6.4a11.6 11.6 0 0 0-1.6-.1A11.5 11.5 0 0 0 7.9 31a11.5 11.5 0 0 0 11.5 11.5A11.5 11.5 0 0 0 31 31V18.3a14.9 14.9 0 0 0 8.7 2.8v-6.3a8.8 8.8 0 0 1-5.6-4.3" fill="white"/>
            </svg>
            关注我的抖音
            <ExternalLink size={20} />
          </motion.a>
        </motion.div>

        {/* 抖音风格个人卡片 */}
        <motion.div
          className="glass rounded-3xl p-6 sm:p-8 mb-12 max-w-2xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* 头像 */}
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-pink-100 shadow-lg">
                <img
                  src="https://picsum.photos/seed/milan-dy/200/200"
                  alt="Milan"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 抖音风格音符标记 */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 flex items-center justify-center shadow">
                <Music size={14} className="text-white" />
              </div>
            </motion.div>

            {/* 个人信息 */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h2 className="text-xl font-bold text-gray-900">米兰 Milan</h2>
                <Sparkles size={16} className="text-pink-500" />
              </div>
              <p className="text-gray-500 text-sm mb-3">
                @v6925308x
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                中年转型选手 | AI编程练习生 | 减肥进行时
                {'\n'}
                记录从零开始学编程的每一天
                {'\n'}
                曾经创业13年，现在重新出发 🚀
              </p>

              {/* 数据统计 */}
              <div className="flex items-center gap-6 mt-4 justify-center sm:justify-start">
                <div className="text-center">
                  <div className="font-bold text-gray-900">86</div>
                  <div className="text-xs text-gray-500 flex items-center gap-0.5">
                    <Video size={10} /> 作品
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">3.2万</div>
                  <div className="text-xs text-gray-500 flex items-center gap-0.5">
                    <Heart size={10} /> 获赞
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">1,280</div>
                  <div className="text-xs text-gray-500 flex items-center gap-0.5">
                    <Users size={10} /> 粉丝
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">368</div>
                  <div className="text-xs text-gray-500 flex items-center gap-0.5">
                    <Share2 size={10} /> 关注
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 代表作品网格 */}
        <motion.div
          className="mb-12"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Play size={20} className="text-pink-500" fill="currentColor" />
              代表作品
            </h2>
            <a
              href={DOUYIN_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1"
            >
              查看全部 <ExternalLink size={14} />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {SHOWCASE_VIDEOS.map((video, index) => (
              <motion.a
                key={index}
                href={DOUYIN_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-xl overflow-hidden aspect-[9/14] bg-gray-100"
                variants={cardAnim}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                {/* 封面 */}
                <img
                  src={video.cover}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* 播放图标 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <Play size={18} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>

                {/* 底部信息 */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-white text-xs font-medium leading-snug line-clamp-2 mb-1.5">
                    {video.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-white/70">
                    <span className="flex items-center gap-0.5">
                      <Play size={8} fill="currentColor" />
                      {video.views}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Heart size={8} fill="currentColor" />
                      {video.likes}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* 底部引导 */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex flex-col items-center gap-4">
            <p className="text-gray-400 text-sm">
              更多作品持续更新中，关注抖音第一时间观看
            </p>
            <motion.a
              href={DOUYIN_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-pink-200 text-pink-500 font-medium hover:bg-pink-50 hover:border-pink-300 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M34.1 10.5A8.7 8.7 0 0 1 31 4h-6.3v27.3a5.3 5.3 0 0 1-5.3 5 5.3 5.3 0 0 1-5.3-5.3 5.3 5.3 0 0 1 5.3-5.3c.5 0 1.1.1 1.6.3v-6.4a11.6 11.6 0 0 0-1.6-.1A11.5 11.5 0 0 0 7.9 31a11.5 11.5 0 0 0 11.5 11.5A11.5 11.5 0 0 0 31 31V18.3a14.9 14.9 0 0 0 8.7 2.8v-6.3a8.8 8.8 0 0 1-5.6-4.3" fill="currentColor"/>
              </svg>
              前往抖音主页关注
              <ExternalLink size={16} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
