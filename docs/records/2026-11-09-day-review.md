# 2026-11-09 分发回顾与双镜像首发

范围为北京时间 11 月 9 日 `dev` 的 13 个提交，以及 11 月 10 日凌晨完成的同一轮发布恢复和收尾。首发候选是 `v26.11.1.0902-test`，对应 `80edec70eb628fcf4d8615478742b9680d61b9ae`。

## 提交与文档核对

| 提交                            | 对照实际代码核对的内容                                                                                                                                                                                                                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `707d27c`、`5fbc8a6`            | 收集 Debian 和 Alpine 固定源码，补齐配方、补丁和许可复核。原始证据保留在 [Debian](2026-11-09-debian-source-completion.md) 与 [aports](2026-11-09-aports-source-review.md) 记录。                                                                                                                         |
| `e3a8fbf`、`64629b8`、`ea3c051` | 收集 Nginx 供应商、Node 工具链和容器启动材料，生成并本地验收全量归档。固定来源和本地复核工具仍可用于追溯。详见 [全量归档验收](2026-11-09-source-companion-review.md)。                                                                                                                                   |
| `379947d`、`a378aa3`            | 修正非 root 容器读取分发校验材料，CI 启用 containerd 平台摘要检查并等待 Server ready。核对 [分发校验](../deployment/image-distribution.md) 和 [部署验证](../development/validation.md)。                                                                                                                 |
| `13479e2`、`6a89100`、`d728c82` | 启用 Git tag 保护并接通主仓库的成对镜像发布，准备 `26.11.1/test` 轨道。核对 [版本规则](../governance/versioning.md) 和 [发布流程](../deployment/release-materials.md)。                                                                                                                                  |
| `7c9aed6`、`b2ef29b`、`80edec7` | 前两次候选的 CI 通过，发布分别在 Alpine 源站 HTTP 418 和 GNU 源站 HTTP 403 停止。独立预检随后发现 X.Org 降级到 HTTP。本地从空目录下载并核对了 3,187 个输入，期间重试了连接中断的文件。按用户决定，`80edec7` 移除全量归档的远端预检、下载和附件要求，保留镜像内许可、固定来源、双架构 CI 和标签冲突检查。 |
| `020cd73`                       | 跨午夜完成首发恢复后修复输出目录初始化。回归使用空目录和实际文件写入，核对三个 JSON 文件内容及已有目录拒绝覆盖。修复已推送到 `dev`，用于后续候选。                                                                                                                                                       |

早期候选 `v26.11.1-test` 和 `v26.11.1.0901-test` 保留各自原 tag，均未创建对应的镜像版本标签或 Pre-release。[第一次发布尝试](https://github.com/laugh0608/RadishInk/actions/runs/42633181743) · [第二次发布尝试](https://github.com/laugh0608/RadishInk/actions/runs/42639458751) · [源码预检](https://github.com/laugh0608/RadishInk/actions/runs/42641708160)

## 首发结果

`v26.11.1.0902-test` 的仓库治理、Web 与 amd64 / arm64 原生 CI 均通过。首次发布任务按 digest 上传两镜像并完成四个平台的分发清单核对和标签冲突检查，随后在全新的 runner 上写入 `output/distribution/release` 时因父目录不存在而失败。本地模拟提前建了目录，未覆盖真实写入条件。

从 GHCR 重新读取两份 index、四个平台 manifest 和 config，与首次发布任务已验证的摘要逐一核对。使用修复后的文件写入逻辑生成 `release-pair.json` 和两个架构的 lock，并补建同一 tag 的 Pre-release。原运行的第二次尝试下载该记录，复用同一对镜像完成两个完整标签的写入、回读和 `test-latest` 更新。[Actions 运行](https://github.com/laugh0608/RadishInk/actions/runs/42647722683)

| GHCR 完整标签                                           | Index digest                                                              |
| ------------------------------------------------------- | ------------------------------------------------------------------------- |
| `ghcr.io/laugh0608/radishink-web:v26.11.1.0902-test`    | `sha256:4ee850a82f17438e856fd058beb6d2896826cd29f260ecdcd2409a47735ba50f` |
| `ghcr.io/laugh0608/radishink-server:v26.11.1.0902-test` | `sha256:ee4c1ee021283ed85d10d6e39d851292ee77f5e1f759d2f20e302087559ff71c` |

Pre-release 于北京时间 11 月 10 日 00:09 发布。两个完整标签的 index 和 amd64 / arm64 平台摘要均通过匿名读取核对。三个上传附件均可匿名下载，字节与生成记录一致。GitHub 自动提供仓库源码 ZIP 和 tar.gz。[Pre-release](https://github.com/laugh0608/RadishInk/releases/tag/v26.11.1.0902-test)

## 验证与接续

简化发布前，本地 `pnpm check:repo` 和 139 项治理测试通过。发布脚本模拟验证首次创建 Pre-release、标签复用及冲突停止。目录修复后再次通过治理测试，并以干净的输出目录真实生成三个附件。首次运行、同 tag 恢复和本地复核分别保留证据，下一版的全自动首次创建仍待该版候选验证。

当前状态和 [本地 Compose 说明](../deployment/compose.md) 已区分本地构建、真实 GHCR 发布与部署验收。建议下一轮在获准的测试环境使用已发布的 tag 和对应 lock 验证拉取、初始化、ready、备份和独立恢复。真实 Radish OIDC、手机、公众号及正式部署的验收边界见[接下来的事项](../status/current.md#接下来的事项)。本轮只读确认远端仍允许 Squash，设置修正另行处理。
