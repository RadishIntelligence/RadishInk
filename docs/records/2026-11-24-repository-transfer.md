# 2026-11-24 RadishInk 组织迁移

执行范围见[迁移手册](../planning/repository-transfer.md)。

## 仓库与检查

- GitHub 将公开仓库原名迁入 [RadishIntelligence/RadishInk](https://github.com/RadishIntelligence/RadishInk)，仓库 ID 为 `1405083121`。旧地址返回 301，迁后 Git 分支和 tag 引用与迁前快照一致。 [迁移准备 PR #8](https://github.com/RadishIntelligence/RadishInk/pull/8)
- 三条 Ruleset 保持 active。按迁前配置恢复主线规则 24501729 的管理员 PR 内绕过，以及 tag 创建规则 26854833 的管理员创建权限。tag 更新与删除保护规则 26854813 保持无绕过。回读确认严格的 `Candidate Quality` 仍绑定 GitHub Actions。Secret Scanning 与 Push Protection 恢复启用，私密漏洞报告保持启用。 [主线规则](https://github.com/RadishIntelligence/RadishInk/rules/24501729) · [tag 创建规则](https://github.com/RadishIntelligence/RadishInk/rules/26854833) · [tag 保护规则](https://github.com/RadishIntelligence/RadishInk/rules/26854813)
- 组织仓库的 `dev` 手动 CI 通过。维护链接和测试版准备经 PR #9 的双架构 `Candidate Quality` 晋级 `main`，合并提交为 `e64c738dd63f0e71704bdff961f27d4363a95064`，已快进回流 `dev`。 [手动 CI](https://github.com/RadishIntelligence/RadishInk/actions/runs/45389056348) · [PR #9](https://github.com/RadishIntelligence/RadishInk/pull/9) · [PR CI](https://github.com/RadishIntelligence/RadishInk/actions/runs/45389686984)

## 公网站点

现有 `dabailuobo/radish-ink` 从 `RadishIntelligence/RadishInk` 的 `dev` 提交 `6c700ce91c0bffc32d5e62bee4af76ff385a8997` 自动部署为 Production Ready。匿名访问首页、`/pwa/icon-192.png` 和 `/images/writing.svg` 返回 200。Chrome 无痕窗口核对版本 `v26.11.3-test`、新的组织链接，并验证合成草稿保存、刷新恢复和预览。 [Production 部署](https://vercel.com/dabailuobo/radish-ink/D71WjtYW38xpMxHz5cRHRVRE4TsW)

## 历史镜像

`v26.11.2-release` 的三个公开附件从新地址下载后，与迁前副本逐字节一致。个人 GHCR 两份完整标签、四个平台 manifest 及 OCI config 的摘要与成对记录相符。个人命名空间的 `latest`、`release-latest`、`test-latest` 与迁前摘要一致。使用空凭据 Docker 配置按各平台 digest 拉取 amd64、arm64 双镜像。arm64 使用格式 `1` 原部署锁、临时共享工作区和备份卷执行预检，通过后清理临时卷。 [历史正式版](https://github.com/RadishIntelligence/RadishInk/releases/tag/v26.11.2-release)

## 首个组织测试版

`v26.11.3-test` 指向 `e64c738`。发布工作流完成双架构候选 CI、组织 GHCR 的 Web / Server 镜像构建和上传、四份平台镜像的授权拉取与分发清单复核，以及两个完整标签的摘要回读。三个公开 Pre-release 附件已下载，SHA-256 与 GitHub 发布元数据一致，两个部署锁为组织格式 `2`。 [Pre-release](https://github.com/RadishIntelligence/RadishInk/releases/tag/v26.11.3-test) · [发布工作流](https://github.com/RadishIntelligence/RadishInk/actions/runs/45390773455)

两个包初次发布时为 Private。组织的 Package creation 中 Public 开关关闭，包设置因此禁用了 Public 选项。两份镜像的匿名 token 请求均返回 401。

## 关联入口

RadishX 官网代码中的旧仓库链接经 GitHub 跳转仍能访问，新地址文档路径已实测返回 200。
