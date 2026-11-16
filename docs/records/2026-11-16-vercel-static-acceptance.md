# Vercel 公网静态验收

2026-11-16 推送 `dev` 提交 `47a9d5a470af68aa773aba2ce407dad58785f09f` 后，GitHub 的 Vercel 状态由 pending 转为 success。Vercel API 回读项目 `dabailuobo/radish-ink` 的 Production 部署为 `READY`，Git 来源为 `dev` 的同一提交，公开域名 `ink.radishx.com` 指向该部署。 [部署详情](https://vercel.com/dabailuobo/radish-ink/BHRE3H1dhEb67qVQRKyzKZn86ndu) · [公开站点](https://ink.radishx.com/)

匿名请求首页、PWA 图标、示例图、第三方许可原文、Service Worker、Workbox、更新守卫和 manifest 均返回 HTTP 200，首页运行时配置为 `static`。Chromium 153.0.8010.12 显示产品版本 `v26.11.1-test`。独立浏览器会话中用合成稿件验证编辑、插图、保存和刷新恢复，再把导出的 ZIP 回导到另一份空浏览器存储，正文与图片预览刷新后仍可用。实际检查了 ZIP 内的 `index.md`、相对图片引用和原图 SHA-256。验收中未观察到站内 `/api/` 请求或页面脚本异常，观察到 Cloudflare 的 `static.cloudflareinsights.com` 请求。

首次 20 秒的检查未等到 Service Worker 就绪。独立冷启动复测中，约 59 秒时仍在预缓存，未观察到同源资源失败。继续保持另一份独立会话，约 186 秒时回读到 `/sw.js` 已激活，预缓存有 246 项。刷新后由该 Worker 控制页面，再切换浏览器为离线并重开，编辑器正常加载。
