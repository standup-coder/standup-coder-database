// 数据格式化工具

import { SCALE_MAP } from './constants';

/**
 * 格式化企业规模
 */
export function formatScale(scale: string): string {
  if (!scale) return '未知';
  const mapped = SCALE_MAP[scale];
  return mapped ? `${mapped.label} (${scale})` : scale;
}

/**
 * 格式化数字（千分位）
 */
export function formatNumber(num: number): string {
  if (num === undefined || num === null) return '-';
  return num.toLocaleString('zh-CN');
}

/**
 * 格式化金额
 */
export function formatMoney(amount: number, unit = '元'): string {
  if (amount === undefined || amount === null) return '-';
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(2)}亿${unit}`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(2)}万${unit}`;
  }
  return `${amount}${unit}`;
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 高亮匹配文本
 */
export function highlightText(text: string, keyword: string): string {
  if (!keyword || !text) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * 解析成立年份
 */
export function parseFoundedYear(yearStr: string): number {
  if (!yearStr) return 0;
  const match = yearStr.match(/(\d{4})/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * 计算企业年龄
 */
export function calculateCompanyAge(foundedYear: string): number {
  const year = parseFoundedYear(foundedYear);
  if (!year) return 0;
  const currentYear = new Date().getFullYear();
  return currentYear - year;
}

/**
 * 解析URL，提取域名
 */
export function extractDomain(url: string): string {
  if (!url) return '';
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
