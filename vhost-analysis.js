/*!
 * vhost虚拟主机
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module exports.模块出口
 * @public
 */

module.exports = vhost

/**
 * Module variables.模块变量
 * @private
 */
/**
*星号-正则变量
*星号-替换
*
**/
//\出现任意次
var ASTERISK_REGEXP = /\*/g
//除了.以外的任意一个字符出现至少一次
var ASTERISK_REPLACE = '([^.]+)'
//\$:$  $:匹配字符串的结尾位置  ^:匹配字符串的开始位置 ?: ：消除缓存
var END_ANCHORED_REGEXP = /(?:^|[^\\])(?:\\\\)*\$$/
var ESCAPE_REGEXP = /([.+?^=!:${}()|[\]/\\])/g
var ESCAPE_REPLACE = '\\$1'

/**
 * Create a vhost middleware.创建一个虚拟主机中间件
 *中间件就是类似于一个过滤器的东西，在客户端和应用程序之间的一个处理请求和响应的的方法
 *参数以及返回值
 * @param {string|RegExp} hostname
 * @param {function} handle
 * @return {Function}
 * @public
 */

function vhost (hostname, handle) {
  if (!hostname) {
    throw new TypeError('argument hostname is required')
  }

  if (!handle) {
    throw new TypeError('argument handle is required')
  }

  if (typeof handle !== 'function') {
    throw new TypeError('argument handle must be a function')
  }

    // create regular expression for hostname
  //创建主机名的正则表达式,即将主机名创建为正则表达式
  var regexp = hostregexp(hostname)
//请求，响应以及下一个中间件
  return function vhost(req, res, next) {
      //返回请求的服务器域名符合regexp的对象
    var vhostdata = vhostof(req, regexp)

    if (!vhostdata) {return next()}

    // populate转移于
    req.vhost = vhostdata

    // handle
    handle(req, res, next)
  }
}
/**
 * Determine if object is RegExp.确定对象是正则表达式
 *
 * @param (object} val
 * @return {boolean}
 * @private
 */

function isregexp (val) {
  return Object.prototype.toString.call(val) === '[object RegExp]'
}

/**
 * Generate RegExp for given hostname value.将给定的主机名的值生成正则表达式
 *
 * @param (string|RegExp} val
 * @private
 */
//将给定的主机名的值生成正则表达式
function hostregexp(val) {
    //若val是正则表达式则返回val.source
  var source = !isregexp(val)
    ? String(val).replace(ESCAPE_REGEXP, ESCAPE_REPLACE).replace(ASTERISK_REGEXP, ASTERISK_REPLACE)
    : val.source

    // force leading anchor matching力主导锚匹配 
  if (source[0] !== '^') {
    source = '^' + source
  }

    // force trailing anchor matching力尾锚匹配 
  if (!END_ANCHORED_REGEXP.test(source)) {
    //var END_ANCHORED_REGEXP = /(?:^|[^\\])(?:\\\\)*\$$/
    source += '$'
  }

  return new RegExp(source, 'i')
}

/**
 * Get the vhost data of the request for RegExp
 * 得到请求的虚拟主机数据的正则表达式 
 * @param (object} req
 * @param (RegExp} regexp
 * @return {object}
 * @private
 */
//返回符合由给定域名生成的正则表达式的对象
function vhostof(req, regexp) {
  //请求头的host用来指定服务器的域名
  var host = req.headers.host
    //hostnameof(req)获取请求的主机名
  var hostname = hostnameof(req)
//若hostname为空则执行此函数
  if (!hostname) {
    return
  }
//用给定的域名生成的正则表达式匹配请求的域名
  var match = regexp.exec(hostname)

  if (!match) {
    return
  }
//创建对象obj
  var obj = Object.create(null)

  obj.host = host
  obj.hostname = hostname
  obj.length = match.length - 1

  for (var i = 1; i < match.length; i++) {
    obj[i - 1] = match[i]
  }

  return obj
}
/**
 * Get hostname of request.获取请求的主机名
 *
 * @param (object} req
 * @return {string}
 * @private
 */
//若服务器的域名中有:则截取:前的部分
function hostnameof(req) {
    //host为服务器的域名
    var host = req.headers.host
    //host为空时执行此函数
    if (!host) {
        return
    }
    //若host的第一个字符为'['则返回']'的下标+1，否则返回0
    var offset = host[0] === '['
      ? host.indexOf(']') + 1
      : 0
    //从offset开始检索，返回':'的下标
    var index = host.indexOf(':', offset)
    //若服务器的域名中有:则截取:前的部分
    return index !== -1
      ? host.substring(0, index)
      : host
}
// for match of "foo.bar.example.com:8080" against "*.*.example.com": 
//req.vhost.host === 'foo.bar.example.com:8080'
//req.vhost.hostname === 'foo.bar.example.com'
//req.vhost.length === 2
//req.vhost[0] === 'foo'
//req.vhost[1] === 'bar'
