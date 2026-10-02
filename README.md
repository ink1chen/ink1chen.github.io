# ink1chen.github.io

个人博客 —— 记录漏洞研究、安全分析与技术笔记。

## 技术栈

- [Astro](https://astro.build/) 6
- 主题基于 [Devosfera](https://github.com/0xdres/astro-devosfera)（MIT），后者派生自 [AstroPaper](https://github.com/satnaing/astro-paper)（MIT）

## 本地开发

需要 Node.js 20+ 与 pnpm。

```bash
pnpm install
pnpm run dev        # http://localhost:4321
pnpm run build      # 生产构建（含 astro check 与 Pagefind 索引）
```

> `pnpm run build` 内部使用 Unix 的 `cp -r` 与 `pagefind`，**在 Windows 上会失败**。
> 本地开发用 `pnpm run dev` 即可；完整构建交给 GitHub Actions（Linux 环境）。

## 写文章

文章放在 `src/data/blog/`，支持 `.md` 与 `.mdx`。

```yaml
---
title: "文章标题"
pubDatetime: 2026-01-15T10:00:00Z   # 必填，ISO 8601 带时区
description: "用于 SEO 与卡片的摘要"
tags: ["security", "cve"]
featured: false                      # 首页精选
draft: false                         # 草稿不发布
---
```

正文中写 `## Table of contents` 会自动生成目录。

### 代码块标注

由 Shiki transformers 提供：

    // [!code highlight]      行高亮
    // [!code ++]             新增行（绿色 diff）
    // [!code --]             删除行（红色 diff）
    // fileName: poc.py       代码块顶部显示文件名

## 站点配置

集中在 `src/config.ts`（站点标题、描述、时区、功能开关等）。

社交链接与「编辑此文章」链接通过环境变量注入，见 `.env.example`。
这些变量是 `PUBLIC_` 前缀（会进入客户端产物），**不含任何机密**。

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并发布到 GitHub Pages。

## 许可

主题部分基于 MIT 协议，版权声明见 [LICENSE](LICENSE)。
