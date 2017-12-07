# vhost-analysis

# 1.vhost是什么？
Virtual Host 即 Vhost ，是linux中的虚拟主机系统。

虚拟主机 (Virtual Host) 是在同一台机器搭建属于不同域名或者基于不同 IP 的多个网站服务的技术. 可以为运行在同一物理机器上的各个网站指配不同的 IP 和端口, 也可让多个网站拥有不同的域名

## 2.source
[vhost源码](https://github.com/fengluluf/vhost-analysis/blob/master/scorce%20code/index.js)

[vhost解读注释](https://github.com/fengluluf/vhost-analysis/blob/master/vhost-analysis.js)

## 3.仓库根目录下的文件及作用
- package.json：展示项目所依赖的npm包、允许你指定一个包的版本[范围]。通过npm init安装
- LICENSE：项目许可证
- HISTORY.md：历史版本
- .travis.yml：持续集成工具travis的配置文件，来告诉Travis一些项目信息
- .gitignore：git 的忽略文件
- .eslintrc：环境定义了预定义的全局变量。
- test：测试脚本

## 4.vhost的主要作用
- 支持多用户：当一台服务器需要服务多个客户，譬如CDN有cctv（央视）和wasu（华数传媒）两个客户时，如何隔离他们两个的资源？相当于不同的用户共用一台计算机，他们可以在自己的文件系统建立同样的文件目录结构，但是彼此不会冲突。
- 域名调度：CDN分发内容时，需要让用户访问离自己最近的边缘节点，边缘节点再从源站或上层节点获取数据，达到加速访问的效果。一般的做法就是Host是DNS域名，这样可以根据用户的信息解析到不同的节点。
- 支持多配置：有时候需要使用不同的配置，考虑一个支持多终端（PC/Apple/Android）的应用，PC上RTMP分发，Apple和Android是HLS分发，如何让PC延迟最低，同时HLS也能支持，而且终端播放时尽量地址一致（降低终端开发难度）？可以使用两个Vhost，PC和HLS；PC配置为最低延迟的RTMP，并且将流转发给HLS的Vhost，可以对音频转码（可能不是H264/AAC）后切片为HLS。PC和HLS这两个Vhost的配置肯定是不一样的，播放时，流名称是一样，只需要使用不同的Host就可以。

## 5.vhost(hostName,handle)
创建一个新的中间件(通常，在生成HTTP响应之前，会向Connect服务器发送一个请求，并通过许多函数。这些功能在连接条款中通常被称为“中间件”)功能，以便在请求handle的传入主机匹配时切换请求hostname。这个函数被称为 handle(req, res, next)像标准中间件一样。

hostname可以是一个字符串或RegExp对象。hostname是字符串时，*以匹配主机名的该部分中的一个或多个字符。当hostname是RegExp时，它将被强制为不区分大小写（因为主机名是），并且将被迫基于主机名的开始和结束进行匹配。

当主机匹配，请求被发送到虚拟主机处理程序，该req.vhost 属性将填充一个对象。该对象将具有与每个通配符（或者如果RegExp对象提供的捕获组）相对应的数字属性并且 hostname匹配。

## 6.index.js的解读
index.js主要由vhost(hostname,handle)、isregexp (val)、hostregexp(val)、vhostof(req, regexp)和hostnameof(req)5个函数组成，结构比较清晰，且每个函数前都有此函数功能的说明以及参数和参数类型，可读性较高。






