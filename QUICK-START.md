# 快速开始

本次 Experimental Beta 适合阅读源码、核对设计和提交反馈。需要马上在公司电脑安装的用户请看[安装状态](INSTALLATION.md)，当前没有合格的最新 EXE。

## 获取同一份源码

从[发布候选目录](publication/experimental-beta)取得源码阅读包、SHA256 和逐文件清单。Windows 可用 `Get-FileHash -Algorithm SHA256 -LiteralPath <源码包路径>` 比对清单中的 ZIP 哈希，再解压到新目录。阅读包收录应用、Windows 组件源码和用户文档，不含运行实例或安装程序。

旧工程历史由所有者私有保留，不在本仓库重新公开。已知的 FAIL、UNKNOWN 和未验证范围见[已知问题](KNOWN-ISSUES.md)。GitHub 的 **Code → Download ZIP** 是本仓库的完整快照，范围大于 73 文件源码阅读包。

使用 Git 的读者也可以在新的空目录旁执行：

```sh
git clone --single-branch --branch main https://github.com/KG718718/k-session.git k-session-experimental
git -C k-session-experimental rev-parse HEAD
```

第二条命令给出本次取得的提交。反馈时附上它即可，不需要提供电脑名称、路径或业务实例。

## 阅读入口

- 从 [server.js](server.js) 了解业务入口，从 [public-bootstrap-http.js](public-bootstrap-http.js) 查看首次 Admin 初始化的限制。
- 从 [Windows Launcher](tools/windows-launcher)、[LAN 部署说明](LAN-DEPLOYMENT.md) 和[配置参考](CONFIGURATION.md) 了解主机与浏览器的分工。设计要求和实体验收结果分别列出。
- 对照[已知问题](KNOWN-ISSUES.md)后，使用[Bug 报告模板](BUG-REPORT.md)提交去标识化的复现步骤。

阅读源码不需要启动服务、开放端口或导入任何现有实例。
