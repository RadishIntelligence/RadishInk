# RadishInk 组织迁移

将公开仓库 `laugh0608/RadishInk` 原名转移至 `RadishIntelligence`，仓库 ID 应保持为 `1405083121`。工作窗口包含 GitHub 归属切换、既有 Vercel 项目的 Git 接续和组织 GHCR 首次测试发布。保留 `main` / `dev`、历史 tag 与 Release、`ink.radishx.com`、现有 Vercel 项目及历史自托管镜像。

RadishLink 迁入后沿用原主分支 Ruleset，同日恢复管理员 PR 内绕过、Secret Scanning 和 Push Protection，并在组织仓库手动运行了 PR Checks。RadishUI 的公开组织仓库已通过同一 Vercel Hobby 空间的自动部署。 [Link 迁移记录](https://github.com/RadishIntelligence/RadishLink/commit/1b9b4596c001a9839153517d8c981c64d018617e) · [UI 部署](https://vercel.com/dabailuobo/radish-ui/AAeHEDNvaYHbzxnSdB6EvpLqJXdi)

## 迁移前

1. 先将发布来源兼容改动按 `dev → main` 合入并回流。确认新旧 GitHub 地址推导出各自的双镜像和 OCI 来源，格式 `1` 的真实历史附件可由更新后的维护工具解析。 [来源映射](../governance/versioning.md#docker-镜像标识)
2. 迁移窗口暂停创建发布 tag，等待已开始的发布完成。重新读取仓库 ID、公开可见性、默认分支、合并选项、Actions 权限、安全功能、所有 tag / 分支引用，以及三条 Ruleset 的有效规则和 bypass。核对目标组织仍可接收同名仓库，目标 GHCR 包可供本项目发布。现有快照是对照起点，以切换前最后一次回读为准。 [Ruleset 说明](../../.github/rulesets/README.md) · [GitHub 转移条件](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)
3. 留存最后一个个人命名空间正式版的三个 Release 附件、两个 index 及四个平台摘要，核对固定标签与别名。记录 Vercel 当前 Production Ready 的部署地址、提交、`dev` 跟踪与域名归属，并独立访问首页及站点图片。 [Vercel 当前配置](../deployment/vercel.md)

2026-11-24 的只读基线保存在本地忽略目录 `output/distribution/repository-transfer/2026-11-24/before/`，含源仓库配置、Git 引用及 `v26.11.2-release` 的三个原始附件。

同日通过 `check:repo`、`test:governance`、`validate:web` 和 `validate:server`。本机 arm64 用合成组织镜像和格式 `2` lock 通过 `test:deployment`。匿名回读 `v26.11.2-release` 在个人 GHCR 的两份完整标签、四个平台 manifest 及 OCI config，摘要与附件相符，两个格式 `1` lock 也可由新工具解析。组织发布权限与原生 amd64 的远端验证留在后续窗口。

## 切换与验收

1. 在 GitHub 对现有公开仓库执行 Transfer。核对新地址仍指向相同仓库 ID，旧地址可跳转，PR、tag、Release 和三个附件可用。更新本地 `origin`，保持 WeMD 的 `upstream`。确认仓库设置、安全功能及三个 Ruleset 的规则和 bypass，核对组织继承规则，按核对结果恢复与已批准基线有差异的设置。手动运行 `dev` PR Checks，并在下一次真实 PR 上核对必需的 `Candidate Quality`。
2. 在组织中确认 Vercel GitHub App 可以读取迁入的仓库。在原 `dabailuobo/radish-ink` 项目回读 Git 链接，需要时接回新仓库。保持 `dev` Production Branch、已绑定域名及部署保护设置。可用 Ink 更新仓库链接的 `dev` 提交触发实际部署，核对 Git 归属、完整提交、Ready 状态及公开域名。验证匿名首页、两类站点图片以及合成草稿保存和刷新。
3. 复验个人 GHCR 双镜像的匿名读取和固定摘要，保留历史包与其可见性。使用新的 `-test` tag 验证组织 GHCR 的双镜像写入、两架构、三个 Release 附件与完整标签回读。首次创建的包默认私有，按授权将两个包设为 Public，再验证无凭据读取。用新工具分别对历史正式版和组织测试版执行固定版本部署预检。组织正式版的 `release-latest` 和 `latest` 随该命名空间的首次成功正式发布建立，个人别名保留最后一次个人发布。 [GitHub Packages 转移与权限](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages#about-repository-transfers)
4. 新地址可达后核对项目维护链接、Issue 入口和 RadishX 项目卡片，保留历史记录原有的日期和链接。RadishX 修改及上线按对应仓库授权执行。同步记录实际分支、Ruleset、Release、包和部署证据。

## 停止与恢复

Ruleset、GitHub App 或 GHCR 权限出现差异时暂停新发布，先恢复差异项并回读。站点使用原项目上已经验收的 Ready 部署作为恢复目标。自托管回退使用相应的历史 lock、工作区备份及[恢复流程](../deployment/backup-restore.md)。转回个人账户会再次改变 App、权限和包关联，单独评估与授权。
