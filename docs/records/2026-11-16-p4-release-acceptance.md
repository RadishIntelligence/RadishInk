# P4 双镜像测试版部署验收

2026-11-16 在 macOS arm64 的 OrbStack 中，用 `v26.11.1.0902-test` 验证本机隔离自托管部署。Docker Engine 29.8.2 使用原生 `linux/arm64`，Compose v5.5.0，Playwright CLI 0.1.22 驱动独立 Chromium 153.0.8010.12。入口为 `http://127.0.0.1:4297/nested/`，采用 `development` 配置和本地账号模式。工作区、备份与恢复分别使用本轮独立命名卷，账号、正文和图片均为合成数据。

## 发行输入

从 [GitHub Pre-release](https://github.com/laugh0608/RadishInk/releases/tag/v26.11.1.0902-test) 下载 `release-lock-arm64.json` 和 `release-pair.json`，按 Release API 核对附件 SHA-256，并交叉核对 tag、源码 revision `80edec70eb628fcf4d8615478742b9680d61b9ae` 和两个 arm64 manifest。镜像固定引用均以 `ghcr.io/laugh0608/radishink-<组件>:v26.11.1.0902-test@<平台摘要>` 派生。

| 组件   | `linux/arm64` manifest digest                                             |
| ------ | ------------------------------------------------------------------------- |
| Web    | `sha256:acc19a0fcbcb7c9fafed3b0fb74f1257264d59932705a654fb6990b46a3ebcaa` |
| Server | `sha256:c4bf865d864a0cbc6d2307612e603987cf9a6c737620120e0e7c6318c17f0065` |

首次 `docker pull --platform linux/arm64` 获取两份镜像层时，GHCR 返回 HTTP 502。Web 重试后按固定引用成功拉取。Server 重试时约 207 MiB 的层长时间无进展，从同一 GHCR 来源以 HTTP Range 获取并逐项核对 manifest、config 和各层的大小与 SHA-256，打包为 OCI 归档后通过 `docker image load` 载入。随后 Docker 以原固定引用解析到该 manifest，`deploy:release preflight` 校验两份镜像的 OCI 来源、revision、平台、版本和运行用户均通过。后续 `apply` 使用 `--no-pull` 复用已核验的本地内容。Server 的常规拉取重试在载入成功后中止。

## 实测结果

| 步骤               | 观察                                                                                                                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 首次初始化与运行   | 在空卷通过交互式 `account-cli init-admin` / `create-user` 新建两个合成账号。`deploy:release preflight` 与 `apply --no-pull` 成功，Web 和 Server 均为 `healthy`，同源 `/nested/api/v1/health/ready` 返回 `ready`，Server 无宿主机映射端口。                                                             |
| 浏览器写作与 ZIP   | 登录、新建稿件、编辑保存、选择 PNG，刷新后正文及图片预览恢复。下载的 ZIP 包含正文与相对资源引用，包内 PNG 的 SHA-256 与服务端原图一致。                                                                                                                                                                |
| 备份与独立恢复     | 再次 `apply --no-pull` 对已含稿件的工作区停写并生成 schema 3 备份，记录 14 个文件、130047 字节，内置备份恢复复核通过。停机后使用 `storage-cli restore` 将该备份恢复到独立空卷，再运行 `storage-cli check`，确认一篇文章且无未知路径。切换为恢复卷后，预检、`apply --no-pull` 和同源 `ready` 再次通过。 |
| 恢复后的登录与隔离 | 部署 ID 和属主内部 ID 保留，工作区 epoch 轮换。原浏览器会话查询和写入返回 401，旧 CSRF 搭配新 Cookie 写入返回 403，另一账号读取该稿件返回 404。原作者重新登录后，稿件快照、原图字节和图片预览一致，合法写入将 revision 从 3 推进到 4。                                                                 |

本次证据覆盖本机原生 arm64、已发布镜像、本地账号与独立卷恢复。amd64 的实际部署、生产 HTTPS 入口、真实 Radish OIDC、手机真机和公众号继续待对应环境验收。部署方法见[固定版本 Compose](../deployment/release-compose.md)，下一项工作见[当前状态](../status/current.md#接下来的事项)。

## 发布记录生成复验

在临时目录分别干净检出 `dev` 的 `668ed3c` 与首发 tag 所指的 `80edec7`。用 `dev` 上的发布脚本复验首发 tag、源码 revision 和 `version.json`，并确认在 `dev` 检出中以同一旧 tag 生成记录会因 revision 不符被拒绝。通过 GHCR 重新核对两个 index、四份平台 manifest 与 config，按固定摘要运行只读基础清单采集，四份结果与首发源码的锁定计划一致。amd64 清单在本机仿真运行。Server amd64 的常规拉取停滞后，从同一 GHCR 来源分段下载，核对 manifest、config 和各层的大小及 SHA-256 后载入。两个已发布的完整镜像 tag 均返回 `reuse`。

首发检出原先没有 `output/`。修复后的 `writeReleaseRecords` 自动创建父目录，生成 `release-pair.json` 和两个架构的 lock，三个文件与 Pre-release 附件逐字节一致。尝试写入已存在的输出目录时被拒绝，两份 Git 检出保持干净。`dev` 干净检出中使用项目锁定工具链执行 `pnpm test:governance`，139 项通过。 [发布流程](../deployment/release-materials.md#主仓库发布流程)

## 候选自动发布

2026-11-16 将 `dev` 快进推送至 `46e3581bf246b71469704c60f0d502acd15bfbaf`，新建并推送指向该提交的注解 tag `v26.11.1.1601-test`。推送前确认远端无对应 tag 和 Release，GitHub 按现有管理员例外允许创建。`check:release-tag`、`validate:web` 和 `validate:server` 均通过，合计治理 139、core 64、Web 802、Server 116 项测试。Web Lint 报告 12 项警告，Vite 报告 chunk 大小和 Baseline 数据时效警告。

[Actions 43866818614](https://github.com/laugh0608/RadishInk/actions/runs/43866818614) 首次运行通过 `Repo Hygiene`、`Web Quality`、两个 Linux 架构的 `Server Quality`、`Candidate Quality` 和 `publish`。创建 Release 的步骤成功，恢复既有记录的重试步骤跳过。`github-actions[bot]` 于北京时间 20:40:39 创建 [Pre-release](https://github.com/laugh0608/RadishInk/releases/tag/v26.11.1.1601-test)，发布 job 于 20:41:15 成功结束。 [发布 job](https://github.com/laugh0608/RadishInk/actions/runs/43866818614/job/133300003938)

通过公开链接匿名下载三个附件。下载字节数与 Release API 一致，独立计算的 SHA-256 如下。

| 附件                      | 字节 | SHA-256                                                            |
| ------------------------- | ---: | ------------------------------------------------------------------ |
| `release-pair.json`       | 1476 | `22c9f799e0a660b7b50e23ec797e2f1d18044c58d40634700b6818098854c451` |
| `release-lock-amd64.json` |  384 | `482c4794924d626ed2a03194028e4fc4ed8985637096c2b4fd307d37bf706b38` |
| `release-lock-arm64.json` |  384 | `f1a53fbb8c36f7ac639a8738b4c9fcc6e37d4d824a04f6e850f193c64150df73` |

两个 lock 与成对记录派生值相同。匿名读取 GHCR 确认 Web 完整 tag 与 `test-latest` 均指向 `sha256:44d3f3b219397fa6f1b22525eb821dffcc8f9c40d2afb58d0a1af0dbd446190d`，Server 两个标签均指向 `sha256:73a90b2767010f39f8d8c38dbfb8c99875b411e6055fb5d3e2b1458f516a886f`。两份 index、四份平台 manifest 和 config 的内容摘要、平台、OCI 版本与源码 revision 均与记录一致。

## 本机 HTTPS 配置验收

用 `v26.11.1.1601-test` 的 arm64 lock 在本机 OrbStack 上运行 `RADISHINK_ENV=production`。临时反代在 `https://127.0.0.1:4298/nested/` 终止 TLS，Web 只绑定本机端口，Server 未映射宿主端口。`openssl s_client` 以临时证书校验 IP 并确认 TLS 1.3，维护命令及 Playwright API 请求通过各自进程的 `NODE_EXTRA_CA_CERTS` 验证该证书，独立 Chromium 153.0.8010.12 临时固定证书公钥。空卷初始化、`deploy:release preflight` 和 `apply --no-pull` 通过，两服务均 `healthy`，同源 HTTPS 返回 `ready`。

Web 通过 `docker pull` 获取 `sha256:0121c85da0404ca1ec36106e2694aec49cbb67f5318383b96157021fd9c9291c`。Server 的常规拉取在约 207 MiB 层停滞，随后从同一 GHCR 来源分段获取，按 manifest 逐项校验大小及 SHA-256 后从 OCI 归档载入 `sha256:bf19869b77b910205a3e795b7a88bbc78ea0a248d6a83be8dedde95f1bb371a4`。预检按原始 lock 核对两份镜像。

- Chromium 确认为安全上下文，会话 Cookie 使用 `__Host-` 前缀并带 `Secure`、`HttpOnly` 和 `SameSite=Lax`。新建、插图、保存和刷新重开通过，ZIP 的正文、相对图片引用和原图字节均正确。
- `/nested/` 的 Service Worker 已注册，未观察到私有 API 进入 Cache Storage。浏览器观察到的 22 次 API 响应均为 `no-store`。异源 Origin 返回 403，未知 API 返回不缓存的 404 JSON。
- 停写备份包含 14 个文件、130017 字节。`storage-cli restore` 把一篇稿件恢复到独立空卷，`check` 无未知路径，切换到恢复卷后再次通过预检与 HTTPS `ready`。部署 ID、账号归属、正文和原图保留，epoch 轮换。旧会话写入返回 401，旧 CSRF 搭配新会话返回 403，重新登录后合法写入使 revision 从 3 推进到 4。

本轮覆盖已发布镜像的本机原生 arm64 和生产配置下的 HTTPS 链路。外部域名、公开信任证书和实际 amd64 测试主机仍待对应环境验收。 [当前状态](../status/current.md#接下来的事项)

## 本机 amd64 镜像预演

下载 `v26.11.1.1601-test` 的 `release-lock-amd64.json` 和 `release-pair.json`，核对附件 SHA-256、源提交和平台摘要。Web 按固定摘要拉取。Server 常规拉取停滞后，从同一 GHCR 来源分段取得各层，核对 manifest、config 和全部层的摘要及大小，再载入本机缓存。用固定部署工具的 `releaseLock` 和 `verifyImage` 校验两份镜像，Web manifest 为 `sha256:d9b570c8f03de6f6445e1baf1c1c132946601f12ee27c2963111a6a00e2c8481`，Server manifest 为 `sha256:a48efbdf57c45881ac81ff709be735e7d9b506a05542ee33e52d3800fc8f45f6`。

在 ARM64 OrbStack 上设置 `DOCKER_DEFAULT_PLATFORM=linux/amd64`，将两份固定镜像传给 `scripts/deployment/compose-smoke.mjs --recovery`。两个非 root 服务通过健康检查，后端无宿主端口。生产会话 Cookie、账号隔离、正文与原图字节、停机重建均通过。独立空卷恢复保留部署 ID、归属、正文和原图并轮换 epoch，旧 Cookie 与旧 CSRF 拒绝写入。测试使用本机回环端口和合成数据，临时容器、卷和端口已清理。原生 amd64 部署与外部 HTTPS 验收待对应环境。 [当前状态](../status/current.md#接下来的事项)

## 本机 Docker 部署

本批使用本机 Docker 作为部署环境。OrbStack 的原生 `linux/arm64` 使用 `v26.11.1.1601-test` 的 arm64 lock，两份镜像按完整 tag 和平台摘要获得。Compose 项目名 `radishink-local`，入口为 `http://127.0.0.1:8080/`，使用回环 HTTP、`RADISHINK_ENV=development` 与本地账号模式。工作区、备份分别存放在独立的 `radishink-local-workspace` 和 `radishink-local-backups` 命名卷。维护用 lock、公开配置和部署记录在仓库忽略目录 `.tmp/radishink-local/`，该目录由本机账号独占。

用交互式 `account-cli init-admin` 创建本地管理员。`deploy:release preflight` 和 `apply --no-pull` 均通过，初始化备份的独立恢复复核通过，Web 和 Server 均为 `healthy`。Web 首页为 HTTP 200，同源服务端返回 `ready`。Chromium 实测管理员登录、进入服务器工作区和退出。部署实例保留运行。停机时先执行 `docker stop radishink-local-web-1`，再执行 `docker stop radishink-local-server-1`，保留两个命名卷。 [固定版本维护](../deployment/release-compose.md)
