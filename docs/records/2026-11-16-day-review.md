# 2026-11-16 P4 发布、验收与主线集成回顾

按北京时间回顾 `dev` 截至 `944896d` 的 10 个当日提交。发布、部署、升级和 PR 的详细证据见 [P4 阶段记录](2026-11-16-p4-release-acceptance.md)，公网浏览器结果见 [Vercel 验收记录](2026-11-16-vercel-static-acceptance.md)。

## 提交回顾

| 时间  | 提交      | 结果                                                                                                          |
| ----- | --------- | ------------------------------------------------------------------------------------------------------------- |
| 20:15 | `668ed3c` | 记录 `v26.11.1.0902-test` 的本机 arm64 部署、写作、ZIP 与独立恢复验收。                                       |
| 20:23 | `46e3581` | 用干净检出重新生成首发的成对记录与两个 lock，逐字节比对附件。该提交随后成为 `v26.11.1.1601-test` 的源码来源。 |
| 20:45 | `9fe60f8` | 记录新候选在 Actions 首次运行自动发布，三个附件的匿名下载及摘要、GHCR 固定标签和 `test-latest` 回读通过。     |
| 20:59 | `89b1d34` | 记录本机生产配置下的 HTTPS、会话 Cookie、私有 API 缓存和恢复实测。                                            |
| 21:15 | `6083e13` | 记录仓库级关闭 Squash merging 及 GitHub 回读结果。                                                            |
| 21:36 | `47a9d5a` | 记录本机 Docker 实例交付与 amd64 发布镜像的仿真预演。                                                         |
| 21:50 | `80cb923` | 记录 Vercel 公网静态写作、ZIP、PWA 离线重开与本机应用容器停机。工作区卷和备份卷保留。                         |
| 22:01 | `6c41508` | PR #6 的远程 Candidate Quality 首次通过后，以 merge commit 合入 `main`，随后快进回流 `dev`。                  |
| 22:05 | `7e86fa6` | 记录 PR #6 的远程检查、合并与分支回读。                                                                       |
| 22:14 | `944896d` | 记录两个已发布版本的原卷升级，以及升级前备份在独立空卷的恢复和会话验证。                                      |

## 代码与文档复核

本日提交由九笔文档和一笔合并组成。代码审阅依据 PR #6 进入 `main` 的 `ddd838a..6c41508`，重点是发布、分发、固定版本编排和仓库门禁。

- 对照 [PR Checks](../../.github/workflows/ci.yml)、[发布工作流](../../.github/workflows/publish.yml)和 [仓库检查器](../../scripts/check-repo.mjs)，同步 `workflow_call`、两个原生架构上的镜像分发与部署 smoke 及最新阶段验证来源。 [仓库治理](../governance/repository-governance.md) · [验证基线](../development/validation.md)
- 对照 [发布元数据](../../scripts/release-metadata.mjs)、[成对记录](../../scripts/distribution/release-pair.mjs)与 [固定版本编排](../../scripts/deployment/release-deploy.mjs)，更新测试轨道发布状态、Release 附件入口和同一架构 lock 的操作路径。 [版本规则](../governance/versioning.md) · [部署验收](../deployment/acceptance.md)
- 对照 [Dockerfile](../../Dockerfile)、[Server Dockerfile](../../apps/server/Dockerfile)和 [镜像检查](../../scripts/distribution/verify-images.mjs)，分发材料仍由实际平台镜像和锁定来源生成，操作契约见分发说明。 [镜像分发](../deployment/image-distribution.md)
- 对照 [Vercel 配置](../../vercel.json)、[内容去重脚本](../../scripts/vercel-ignore-build.mjs)及公网回读，更新 `dev` 的 Production 部署与匿名入口证据。同步产品范围中的 P4 分发状态及 Web 的静态形态和服务器形态说明。 [Vercel 部署](../deployment/vercel.md) · [产品范围](../product-scope.md) · [Web 请求边界](../development/web-brand-and-services.md)

## 收尾与接续

收尾前回读远端 `main` 为 `6c41508`、`dev` 为 `7e86fa6`。`944896d` 为本地升级验证记录，本文随下一笔文档收尾提交保存。P4 的部署、原卷升级与独立恢复均有本机发布镜像证据，PR #6 的原生双架构证据依附该次 CI。

下一轮建议在恢复延期验收时，先用同一合成稿件完成手机真机和公众号闭环，按发现的具体问题安排修复。外部部署按需补验，真实 Radish 联调依现有授权和环境安排。 [接下来的事项](../status/current.md#接下来的事项)
