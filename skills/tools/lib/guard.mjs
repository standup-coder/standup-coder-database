import path from 'node:path';

// 路径边界守卫:动态片段(resolve 后)必须留在 root 内,防目录穿越。
// 约定:凡以目录枚举值、MD 正文链接、或内容派生值拼接目标路径,必须经此函数并处理 null 返回。
export function resolveWithin(root, ...segs) {
  const target = path.resolve(root, ...segs);
  return target === root || target.startsWith(root + path.sep) ? target : null;
}
