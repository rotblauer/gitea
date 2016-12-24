[简体中文](https://github.com/go-gitea/gitea/blob/master/README_ZH.md)

# Gitea - Git with a cup of tea

[![Build Status](http://drone.gitea.io/api/badges/go-gitea/gitea/status.svg)](http://drone.gitea.io/go-gitea/gitea)
[![Join the chat at https://gitter.im/go-gitea/gitea](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/go-gitea/gitea?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![](https://images.microbadger.com/badges/image/gitea/gitea.svg)](http://microbadger.com/images/gitea/gitea "Get your own image badge on microbadger.com")
[![Coverage Status](https://coverage.gitea.io/badges/go-gitea/gitea/coverage.svg)](https://coverage.gitea.io/go-gitea/gitea)
[![Go Report Card](https://goreportcard.com/badge/code.gitea.io/gitea)](https://goreportcard.com/report/code.gitea.io/gitea)
[![GoDoc](https://godoc.org/code.gitea.io/gitea?status.svg)](https://godoc.org/code.gitea.io/gitea)

[![](public/img/gitea-large-resize.png)](https://github.com/go-gitea/gitea)

##### Status

**Current version**: (see [Releases](https://github.com/go-gitea/gitea/releases))

| Web | UI  | Preview  |
|:-------------:|:-------:|:-------:|
|![Dashboard](https://gogs.io/img/screenshots/1.png)|![Repository](https://gogs.io/img/screenshots/2.png)|![Commits History](https://gogs.io/img/screenshots/3.png)|
|![Profile](https://gogs.io/img/screenshots/4.png)|![Admin Dashboard](https://gogs.io/img/screenshots/5.png)|![Diff](https://gogs.io/img/screenshots/6.png)|
|![Issues](https://gogs.io/img/screenshots/7.png)|![Releases](https://gogs.io/img/screenshots/8.png)|![Organization](https://gogs.io/img/screenshots/9.png)|

### Important Notes

1. **YOU MUST READ THE [Contributors Guide](CONTRIBUTING.md) BEFORE STARTING TO WORK ON A PULL REQUEST**.
2. If you think there are vulnerabilities in the project, please talk privately to **security@gitea.io**. Thanks!
3. If you're interested in using APIs, we have experimental support with [documentation](https://godoc.org/github.com/go-gitea/go-sdk).

## Purpose

The goal of this project is to make the easiest, fastest, and most painless way of setting up a self-hosted Git service. With Go, this can be done with an independent binary distribution across **ALL platforms** that Go supports, including Linux, Mac OS X, Windows and ARM.

Want to try it before doing anything else?
Do it [online](https://try.gitea.io/)!

## Features

- Activity timeline
- SSH and HTTP/HTTPS protocols
- SMTP/LDAP/Reverse proxy authentication
- Reverse proxy with sub-path
- Account/Organization/Repository management
- Add/Remove repository collaborators
- Repository/Organization webhooks (including Slack)
- Repository Git hooks/deploy keys
- Repository issues, pull requests and wiki
- Migrate and mirror repository and its wiki
- Web editor for repository files and wiki
- Gravatar and Federated avatar with custom source
- Mail service
- Administration panel
- Supports MySQL, PostgreSQL, SQLite3 and [TiDB](https://github.com/pingcap/tidb) (experimental)
- Multi-language support ([20 languages](https://crowdin.com/project/gogs))

## System Requirements

- A cheap Raspberry Pi is powerful enough for basic functionality.
- 2 CPU cores and 1GB RAM would be the baseline for teamwork.

## Browser Support

- Please see [Semantic UI](https://github.com/Semantic-Org/Semantic-UI#browser-support) for specific versions of supported browsers.
- The official support minimal size  is **1024*768**, UI may still looks right in smaller size but no promises and fixes.

## Installation

**Note: As Gitea is a [Gogs](https://github.com/gogits/gogs) fork, tutorials and documentation related to gogs applies to Gitea too**

How to install Gitea:

- go get code.gitea.io/gitea
- [Ship with Docker](https://github.com/go-gitea/gitea/tree/master/docker)
- [Install with Vagrant](https://github.com/go-gitea/examples/tree/master/vagrant)

**Note: binary release will be available soon**

### Tutorials

- [How To Set Up Gogs on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-gogs-on-ubuntu-14-04)
- [Run your own GitHub-like service with the help of Docker](http://blog.hypriot.com/post/run-your-own-github-like-service-with-docker/)
- [Dockerized Gogs git server and alpine postgres in 20 minutes or less](http://garthwaite.org/docker-gogs.html)
- [Host Your Own Private GitHub with Gogs.io](https://eladnava.com/host-your-own-private-github-with-gogs-io/)
- [使用 Gogs 搭建自己的 Git 服务器](https://mynook.info/blog/post/host-your-own-git-server-using-gogs) (Chinese)
- [阿里云上 Ubuntu 14.04 64 位安装 Gogs](http://my.oschina.net/luyao/blog/375654) (Chinese)
- [Installing Gogs on FreeBSD](https://www.codejam.info/2015/03/installing-gogs-on-freebsd.html)
- [Gogs on Raspberry Pi](http://blog.meinside.pe.kr/Gogs-on-Raspberry-Pi/)
- [Cloudflare Full SSL with GOGS (Go Git Service) using NGINX](http://www.listekconsulting.com/articles/cloudflare-full-ssl-with-gogs-go-git-service-using-nginx/)

### Screencasts

- [How to install Gogs on a Linux Server (DigitalOcean)](https://www.youtube.com/watch?v=deSfX0gqefE)
- [Instalando Gogs no Ubuntu](https://www.youtube.com/watch?v=4UkHAR1F7ZA) (Português)

### Deploy to Cloud

- [OpenShift](https://github.com/tkisme/gogs-openshift)
- [Cloudron](https://cloudron.io/appstore.html#io.gogs.cloudronapp)
- [Scaleway](https://www.scaleway.com/imagehub/gogs/)
- [Portal](https://portaldemo.xyz/cloud/)
- [Sandstorm](https://github.com/cem/gogs-sandstorm)
- [sloppy.io](https://github.com/sloppyio/quickstarters/tree/master/gogs)
- [YunoHost](https://github.com/mbugeia/gogs_ynh)
- [DPlatform](https://github.com/j8r/DPlatform)

## Software and Service Support

- [Drone](https://github.com/drone/drone) (CI)
- [Fabric8](http://fabric8.io/) (DevOps)
- [Taiga](https://taiga.io/) (Project Management)
- [Puppet](https://forge.puppetlabs.com/Siteminds/gogs) (IT)
- [Kanboard](http://kanboard.net/plugin/gogs-webhook) (Project Management)
- [BearyChat](https://bearychat.com/) (Team Communication)
- [HiWork](http://www.hiwork.cc/) (Team Communication)

### Product Support

- [Synology](https://www.synology.com) (Docker)
- [One Space](http://www.onespace.cc) (App Store)

## Acknowledgments

- Router and middleware mechanism of [Macaron](https://github.com/go-macaron/macaron).
- System Monitor Status is inspired by [GoBlog](https://github.com/fuxiaohei/goblog).
- Thanks [Rocker](http://weibo.com/rocker1989) for designing Logo.
- Thanks [Crowdin](https://crowdin.com/project/gogs) for providing open source translation plan.
- Thanks [DigitalOcean](https://www.digitalocean.com) for hosting home and demo sites.
- Thanks [KeyCDN](https://www.keycdn.com/) and [QiNiu](http://www.qiniu.com/) for providing CDN service.


## Contributing

Fork -> Patch -> Push -> Pull Request

## Authors

* [Maintainers](https://github.com/orgs/go-gitea/people)
* [Contributors](https://github.com/go-gitea/gitea/graphs/contributors)
* [Translators](conf/locale/TRANSLATORS)

## License

This project is under the MIT License. See the [LICENSE](https://github.com/go-gitea/gitea/blob/master/LICENSE) file for the full license text.
