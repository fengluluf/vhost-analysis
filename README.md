# vhost-analysis

Virtual Host 即 Vhost ，是linux中的虚拟主机系统。

虚拟主机 (Virtual Host) 是在同一台机器搭建属于不同域名或者基于不同 IP 的多个网站服务的技术. 可以为运行在同一物理机器上的各个网站指配不同的 IP 和端口, 也可让多个网站拥有不同的域名

## vhost(hostName,handle)
创建一个新的中间件功能，以便在请求handle的传入主机匹配时切换请求hostname。这个函数被称为 handle(req, res, next)像标准中间件一样。

hostname可以是一个字符串或RegExp对象。hostname是字符串时，*以匹配主机名的该部分中的一个或多个字符。当hostname是RegExp时，它将被强制为不区分大小写（因为主机名是），并且将被迫基于主机名的开始和结束进行匹配。

当主机匹配，请求被发送到虚拟主机处理程序，该req.vhost 属性将填充一个对象。该对象将具有与每个通配符（或者如果RegExp对象提供的捕获组）相对应的数字属性并且 hostname匹配。

## vhost的主要作用
- 支持多用户：当一台服务器需要服务多个客户，譬如CDN有cctv（央视）和wasu（华数传媒）两个客户时，如何隔离他们两个的资源？相当于不同的用户共用一台计算机，他们可以在自己的文件系统建立同样的文件目录结构，但是彼此不会冲突。
- 域名调度：CDN分发内容时，需要让用户访问离自己最近的边缘节点，边缘节点再从源站或上层节点获取数据，达到加速访问的效果。一般的做法就是Host是DNS域名，这样可以根据用户的信息解析到不同的节点。
- 支持多配置：有时候需要使用不同的配置，考虑一个支持多终端（PC/Apple/Android）的应用，PC上RTMP分发，Apple和Android是HLS分发，如何让PC延迟最低，同时HLS也能支持，而且终端播放时尽量地址一致（降低终端开发难度）？可以使用两个Vhost，PC和HLS；PC配置为最低延迟的RTMP，并且将流转发给HLS的Vhost，可以对音频转码（可能不是H264/AAC）后切片为HLS。PC和HLS这两个Vhost的配置肯定是不一样的，播放时，流名称是一样，只需要使用不同的Host就可以。

## 访问指定的vhost
- 配置hosts：因为Vhost实际上就是DNS解析，所以可以配置客户端的hosts，将域名（Vhost）解析到指定的服务器，就可以访问这台服务器上的指定的vhost。
- 使用app的参数：需要服务器支持。在app后面带参数指定要访问的Vhost。SRS支持?vhost=VHOST和...vhost...VHOST这两种方式，后面的方式是避免一些播放器不识别？和=等特殊字符。

## source
[vhost源码](https://github.com/fengluluf/vhost-analysis/blob/master/scorce%20code/index.js)
[vhost解读注释]()
