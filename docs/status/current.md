# 当前状态

2026-11-16 更新。`v26.11.1.1601-test` 指向 `46e3581`，GitHub Actions 在首次运行自动创建 Pre-release。两个架构的原生 CI 均通过，三个附件均可匿名下载且 SHA-256 一致，两个完整镜像标签与 `test-latest` 已回读核对。 [发布记录](../records/2026-11-16-p4-release-acceptance.md#候选自动发布) · [Pre-release](https://github.com/laugh0608/RadishInk/releases/tag/v26.11.1.1601-test)

`v26.11.1.0902-test` 已通过本机隔离 arm64 Compose 验收。`v26.11.1.1601-test` 又通过本机 arm64 的生产配置 HTTPS 入口验收，覆盖安全会话、写作与 ZIP、私有 API 缓存及独立空卷恢复。 [部署验收记录](../records/2026-11-16-p4-release-acceptance.md#本机-https-配置验收)

本批以本机 Docker 为部署环境。`v26.11.1.1601-test` 在原生 arm64 上通过首页、服务端 readiness 和浏览器账号登录验收。验收后按用户要求停止并删除 `radishink-local` 的 Web 与 Server 容器，回环端口 `8080` 已释放，工作区卷与备份卷仍在。 [本机部署记录](../records/2026-11-16-p4-release-acceptance.md#本机-docker-部署)

首个双镜像测试版于 11 月 10 日发布，tag 指向 `80edec7`。amd64 和 arm64 原生 CI 均通过，两份镜像的完整标签、平台摘要和三个 Release 附件均已匿名核对。[Pre-release](https://github.com/laugh0608/RadishInk/releases/tag/v26.11.1.0902-test) · [Actions](https://github.com/laugh0608/RadishInk/actions/runs/42647722683) · [首发记录](../records/2026-11-09-day-review.md#首发结果)

P1 / P2 与 PWA 已进入开发预发布。P3 / P4 源码已通过 PR #5 集成并回流。外部部署、真实 OIDC、手机和公众号按对应环境安排补验。

P4 的镜像分发、发布工作流和固定版本部署后续批次通过 PR #6 合入 `main`。远程 `Candidate Quality` 首次通过，合并提交 `6c41508` 已快进回流并推送到 `dev`。 [阶段集成记录](../records/2026-11-16-p4-release-acceptance.md#阶段主线集成)

从[能力专题地图](../planning/topics.md#当前接续工作的追踪方式)定位以下工作的主要归属、任务和验收来源；本页维护实际阶段与接续状态，地图不另建进度表。

## 实际基线

- Git 集成与发布的历史提交、tag 和远程观察见[原记录快照](../records/planning-sources-before-alignment-2026-11-01.md#实际基线)；本页不将历史分支位置作为实时工作区状态。
- 浏览器文章使用现有 `wemd-history` v3；v2 仍先下载备份并确认升级。超过 30 篇的旧文保留，上限仅拒绝新增，失败不清库、不伪造已保存。
- 目录新建 / 导入形成 `index.md` + `asset/`，旧文本保留原位；显式复制、整包移动 / 删除、冲突副本、日志恢复与缺失 ID 的旧 JSON 恢复延续前轮实现。
- 系统目录启动只查询权限，缺权保留模式并提供重新授权 / 重选入口；维护界面可重新授权原目录。专用浏览器完整进程重启后恢复、真实目录移动和冲突副本已有补测。无热更新的系统文件权限拒写 → 保留输入 → 恢复权限 → 保存通过；Chrome 网站开关与已有句柄授权的差异单独记录。
- 图片粘贴 / 选择已接入浏览器和目录文章包；保存原始字节，正文使用相对路径，预览派生并释放 Blob URL。旧单文件需显式复制为文章目录，外链不自动下载。
- 图片资源提交后才插入编辑锚点；失败不插入引用，切换 / 取消 / 撤销阻止迟到插入，删除引用不自动删资源。格式和限额见存储契约。
- 文件菜单默认导出文章 ZIP，支持导入为新文章及两种存储往返；缺图、非法包和资源读取错误明确失败。纯 Markdown 仍为仅文本抢救入口。
- 含本地图片时，HTML / 公众号复制仍明确停止，提供 ZIP 解压后手工插图的路径；拖图与孤立资源清理未开放。
- PWA 新版安装后只提示；用户确认后先保存，再检查同作用域其他页面并激活、重载。忙碌、保存失败、权限不足和超时会停止流程并保留输入。历史版首次迁入需保存、关闭全部页面后重开；不清库、不注销 Worker。
- Safari 27.0.1 / Firefox 158.0.1 的浏览器存储、图片预览、ZIP 下载与回导、刷新恢复及安全更新通过桌面实测。Mermaid 预览使用与现有公众号 PNG 一致的白色画布，标签继承图表配色，修复暗色模式文字与箭头低对比问题；不改变用户显式图表配置。
- 历史源码预发布 `v26.10.1-dev` 与 `v26.10.2-dev` 保留，分别见[10 月 6 日记录](../records/2026-10-06-v26.10.1-dev.md)和[10 月 25 日记录](../records/2026-10-25-v26.10.2-dev.md)。桌面发布工作流仍停用。

## 分期与下一步

| 顺序 | 目标                                                                                  | 当前状态                                           |
| ---- | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| P1   | [界面与工具栏](../planning/editor-interface.md)                                       | 已合入开发预发布；真实使用环境验收延后             |
| P2a  | [文章目录与资源](../planning/article-assets.md)                                       | 存储、恢复、图片、预览与系统补测修正已合入         |
| P2b  | [可移植文件闭环](../planning/markdown-file-import-export.md#下一阶段文章包与文件菜单) | ZIP 与跨存储往返已合入并验证；公众号与手机实测延后 |
| P3   | [服务器工作区契约](../planning/server-workspace-contract.md)                          | P3-4 OIDC 本地合成验证通过；真实发行方待联调       |
| P4   | [自托管与账号](../planning/self-hosted-storage.md)                                    | 双镜像测试版已通过本机 arm64 部署与恢复验收        |

完整依赖见 [工作区演进计划](../planning/writing-workspace-roadmap.md)。P2a / P2b 共同满足后才宣称“图片随文且可移植”，本地图片转存到公众号另需实际证据。

## 接下来的事项

P4 交付范围与证据见[专题地图](../planning/topics.md#子专题归属与验收入口)和 [P4 开发顺序](../planning/self-hosted-storage.md#下一轮开发顺序)。下一轮建议优先验证实际写作和排版流程。

1. **优先准备手机与公众号实测。** 恢复延期验收时，先用同一份[合成稿件](../deployment/wechat-acceptance-sample.md)在手机上检查保存、图片、ZIP 下载及回导，再在公众号编辑器验证粘贴、保存重开、手机明暗主题、行高、公式和解包后的手工插图。按实际复现结果确定修复优先级。 [公众号验收](../deployment/wechat-acceptance.md)
2. **外部部署按需补验。** 本机 Docker 部署、两版已发布镜像之间的原卷升级及升级前备份独立恢复已验收。后续如需覆盖原生 amd64 主机或公开信任证书的外部 HTTPS 入口，按目标架构 lock 在对应获准环境补验。 [本机部署记录](../records/2026-11-16-p4-release-acceptance.md#本机-docker-部署) · [版本升级](../records/2026-11-16-p4-release-acceptance.md#已发布版本原卷升级) · [amd64 预演](../records/2026-11-16-p4-release-acceptance.md#本机-amd64-镜像预演)
3. **真实 Radish 联调按用户要求延期。** 实际 issuer、独立客户端、HTTPS 回调和测试身份具备对应授权后，与部署环境一起验证准入、绑定、禁用、本站退出和密钥轮换。 [OIDC 操作说明](../development/server-oidc.md)

## 当前产品与停止线

- P3 / P4 已通过 PR #5 合入 `main` 并回流 `dev`。首发修复 `020cd73` 已由 `v26.11.1.1601-test` 的首次自动发布验证。首发 `v26.11.1.0902-test` 对应 `80edec7`，历史候选 tag 保留各自的源提交。 [首发记录](../records/2026-11-09-day-review.md#首发结果)
- 2026-11-16 经授权通过 GitHub API 将仓库级 `allow_squash_merge` 从 `true` 改为 `false`。写入后单独回读，六项仓库设置均与模板相符。`main` Ruleset 24501729 保持 `active`，允许 merge 和 rebase，并要求 `Candidate Quality`。 [仓库设置模板](../../.github/repository-settings.json) · [main Ruleset](https://github.com/laugh0608/RadishInk/rules/24501729)
- Vercel 的 `dev` 提交 `47a9d5a` 对应的 Production 部署已通过公网静态验收，覆盖匿名访问、浏览器保存、文章 ZIP 回导和 PWA 离线重开。镜像发布、服务端部署和跨仓库 OIDC 配置需要对应授权。 [Vercel 公网验收](../records/2026-11-16-vercel-static-acceptance.md)
- 不迁移真实用户数据；旧文、配置、未知 frontmatter 和目录原件保留，不为升级清库、降级或静默覆盖。
- 升级前 JSON 不含后续资源，纯 Markdown 也不含图片；浏览器逻辑包不自动写回源文件旁边，目录应备份完整文章包。
- Docker 为自托管服务器工作区，不自动同步；通用插件、桌面启用、公共图床、官方云、计费和实时协作不在当前范围。

## 验证状态

历史命令、计数、环境与已执行范围见[整理前验证摘要](../records/planning-sources-before-alignment-2026-11-01.md#验证状态)及其链接的原记录。11 月 3 日的 Web / server 基线、镜像分发与部署编排检查见[全日回顾](../records/2026-11-03-day-review.md)。11 月 9 日验证了 Debian、aports、Nginx 供应商和运行时工具的真实输入及仓库门禁。[Debian 验证](../records/2026-11-09-debian-source-completion.md#验证) · [aports 验证](../records/2026-11-09-aports-source-review.md#验证与接续) · [Nginx 供应商验证](../records/2026-11-09-nginx-vendor-source-review.md#验证与接续) · [运行时验证](../records/2026-11-09-runtime-source-review.md#验证与接续)

| 范围                        | 证据与未覆盖面                                                                                                                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1 / P2、桌面与 PWA         | [验证基线](../development/validation.md#工作区演进的验证入口)、[桌面证据](../records/2026-10-25-desktop-browser-acceptance.md)、[PWA 记录](../records/2026-10-25-pwa-safe-update.md)；手机真机、公众号仍延期                          |
| P3 持久化、API、Web 与 OIDC | [P3 切片入口](../planning/topics.md#子专题归属与验收入口)及对应原记录；合成发行方不是实际 Radish 联通，故障测试不替代物理断电                                                                                                         |
| P4 部署与双镜像发布         | [P4-4 记录](../records/2026-10-29-deployment-p4-4.md)、[部署验收](../deployment/acceptance.md)、[双镜像首发](../records/2026-11-09-day-review.md#首发结果)、[已发布镜像 arm64 实测](../records/2026-11-16-p4-release-acceptance.md)。 |

本地实现、已合入源码、源码预发布、静态站点部署、镜像发布和服务端部署分别记录。接续事项与停止线按上文执行。

## 既有记录入口

- [2026-11-16 P4 发布、验收与主线集成回顾](../records/2026-11-16-day-review.md)

- [2026-11-09 分发回顾与双镜像首发](../records/2026-11-09-day-review.md)

- [2026-11-09 基础源码伴随包本地验收](../records/2026-11-09-source-companion-review.md)

- [2026-11-09 Alpine 两项 MIT 通知复核](../records/2026-11-09-alpine-mit-review.md)

- [2026-11-09 Node 工具链与容器启动配方复核](../records/2026-11-09-runtime-source-review.md)

- [2026-11-09 Nginx 供应商源码复核](../records/2026-11-09-nginx-vendor-source-review.md)

- [2026-11-09 aports 源码收集与复核](../records/2026-11-09-aports-source-review.md)

- [2026-11-09 Debian 基础源码剩余项复核](../records/2026-11-09-debian-source-completion.md)

- [2026-11-09 Debian 基础源码首批复核](../records/2026-11-09-debian-source-review.md)

- [2026-11-03 全日回顾与收尾](../records/2026-11-03-day-review.md)：三批 P4 实现、验证边界、文档核对与接续依据。

- [2026-10-29 全日提交与文档回顾](../records/2026-10-29-day-review.md)：P4 实施、验收、主线集成及 Radish 部署参考。

- [目录文章接入](../records/2026-10-14-directory-article-storage.md)、[浏览器文章接入](../records/2026-10-14-browser-article-storage.md)、[P2a 存储原型](../records/2026-10-14-article-storage-prototype.md)、[P1 实现](../records/2026-10-14-editor-interface-p1.md)、[前轮收尾](../records/2026-10-14-day-review.md)。
- [Markdown 单文件](../records/2026-10-06-markdown-file-import-export.md)、[关于与帮助](../records/2026-10-06-information-dialogs.md)、[许可切换](../records/2026-10-06-license-transition.md)、[依赖分发复核](../records/2026-10-05-web-license-review.md)。
- [公众号行高修复](../records/2026-10-06-wechat-line-height.md)、[官方检测器对照](../records/2026-10-06-wechat-official-check.md)、[公众号验收步骤](../deployment/wechat-acceptance.md)。
- [远程 PR 初始化](../records/2026-10-05-remote-pr-initialization.md)、[PR CI 验证](../records/2026-10-05-pr-ci-validation.md)、[Vercel 部署证据](../records/2026-10-05-vercel-dev-deployment.md)、[推送前审阅](../records/2026-10-05-pre-push-review.md)。

历史记录保留当时事实，其旧停止线不覆盖本页与后续用户明确要求。
