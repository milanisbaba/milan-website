/**
 * 币安行情数据类型定义
 * 对应币安公开API /api/v3/ticker/24hr 返回的数据结构
 */
export interface BinanceTicker {
  /** 交易对符号，如 BTCUSDT */
  symbol: string;
  /** 24小时价格变化 */
  priceChange: string;
  /** 24小时价格变化百分比 */
  priceChangePercent: string;
  /** 24小时加权平均价格 */
  weightedAvgPrice: string;
  /** 前一个收盘价 */
  prevClosePrice: string;
  /** 最新价格 */
  lastPrice: string;
  /** 最新成交量 */
  lastQty: string;
  /** 开盘价 */
  openPrice: string;
  /** 最高价 */
  highPrice: string;
  /** 最低价 */
  lowPrice: string;
  /** 24小时成交量 */
  volume: string;
  /** 24小时成交额 */
  quoteVolume: string;
  /** 统计开始时间 */
  openTime: number;
  /** 统计结束时间 */
  closeTime: number;
  /** 第一笔成交ID */
  firstId: number;
  /** 最后一笔成交ID */
  lastId: number;
  /** 成交笔数 */
  count: number;
}

/**
 * 展示用的币种信息（合并API数据与本地配置）
 */
export interface CoinDisplay {
  /** 币种符号，如 BTC */
  symbol: string;
  /** 币种全名，如 Bitcoin */
  name: string;
  /** 币种图标颜色 */
  color: string;
  /** 当前价格（USD） */
  price: string;
  /** 24小时涨跌幅（百分比） */
  changePercent: string;
  /** 是否上涨 */
  isUp: boolean;
  /** 24小时最高价 */
  highPrice: string;
  /** 24小时最低价 */
  lowPrice: string;
  /** 24小时成交额 */
  volume: string;
}

/**
 * 通用行情展示类型（适用于股票、贵金属等）
 */
export interface MarketItem {
  /** 标的符号，如 AAPL / 600519 / XAU */
  symbol: string;
  /** 标的名称 */
  name: string;
  /** 图标（emoji） */
  icon?: string;
  /** 当前价格 */
  price: number;
  /** 涨跌幅（百分比） */
  changePercent: number;
  /** 涨跌额 */
  change: number;
  /** 最高价 */
  high?: number;
  /** 最低价 */
  low?: number;
  /** 成交量 */
  volume?: number;
  /** 市值 */
  marketCap?: number;
  /** 货币单位（如 USD、CNY） */
  currency?: string;
  /** 交易所 */
  exchange?: string;
  /** 最后更新时间 */
  updatedAt?: string;
  /** 图标颜色 */
  color?: string;
  /** 是否获取失败 */
  error?: boolean;
  /** 额外信息（如市值、成交量等） */
  extra?: string;
}

/**
 * 看板分类Tab类型
 */
export type MarketCategory = 'crypto' | 'us-stock' | 'a-stock' | 'metal';

/**
 * AI对话消息类型
 */
export interface ChatMessage {
  /** 消息唯一ID */
  id: string;
  /** 发送者：user 或 ai */
  sender: 'user' | 'ai';
  /** 消息内容 */
  content: string;
  /** 消息时间戳 */
  timestamp: Date;
}

/**
 * 预设问题类型
 */
export interface PresetQuestion {
  /** 问题文本 */
  question: string;
  /** 对应的AI回复 */
  answer: string;
}

/**
 * 作品集项目类型
 */
export interface PortfolioProject {
  /** 项目唯一ID */
  id: string;
  /** 项目标题 */
  title: string;
  /** 简短描述 */
  description: string;
  /** 详细描述（弹窗中展示） */
  detail: string;
  /** 项目截图URL */
  image: string;
  /** 技术标签列表 */
  tags: string[];
  /** 项目链接（可选） */
  link?: string;
}

/**
 * 法务咨询消息类型
 */
export interface LegalMessage {
  /** 消息唯一ID */
  id: string;
  /** 发送者角色：user 或 assistant */
  role: 'user' | 'assistant';
  /** 消息内容 */
  content: string;
  /** 相关法律引用 */
  references?: LegalReference[];
  /** 消息时间戳 */
  timestamp: Date;
}

/**
 * 法律引用类型
 */
export interface LegalReference {
  /** 法律名称 */
  law: string;
  /** 条款编号 */
  article: string;
  /** 条款内容 */
  content: string;
  /** 抖音视频搜索关键词 */
  videoKeyword?: string;
}
