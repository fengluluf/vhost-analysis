# vhost

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Gratipay][gratipay-image]][gratipay-url]

## Install安装

```sh
$ npm install vhost
```

## API

<!-- eslint-disable no-unused-vars -->

```js
var vhost = require('vhost')
```

### vhost(hostname, handle)

Create a new middleware function to hand off request to `handle` when the incoming
host for the request matches `hostname`. The function is called as
`handle(req, res, next)`, like a standard middleware.

当请求匹配到‘hostname’时，则创建一个中间件函数以将请求发送到'handle'。这个函数像标准中间件一样其被称为 handle(req, res, next)。


`hostname` can be a string or a RegExp object. When `hostname` is a string it can
contain `*` to match 1 or more characters in that section of the hostname. When
`hostname` is a RegExp, it will be forced to case-insensitive (since hostnames are)
and will be forced to match based on the start and end of the hostname.

hostname可以是一个字符串或RegExp对象。当hostname是字符串时，*以匹配主机名的该部分中的一个或多个字符。当hostname是RegExp时，它将被强制为不区分大小写（因为是主机名），并且将被迫基于主机名的开始和结束进行匹配。

When host is matched and the request is sent down to a vhost handler, the `req.vhost`
property will be populated with an object. This object will have numeric properties
corresponding to each wildcard (or capture group if RegExp object provided) and the
`hostname` that was matched.

当主机匹配，请求被发送到虚拟主机处理程序，该req.vhost 属性将填充一个对象。该对象将具有与每个通配符（或者如果RegExp对象提供的捕获组）相对应的数字属性并且 hostname匹配。

```js
var connect = require('connect')
var vhost = require('vhost')
var app = connect()

app.use(vhost('*.*.example.com', function handle (req, res, next) {
  // for match of "foo.bar.example.com:8080" against "*.*.example.com":
  req.vhost.host === 'foo.bar.example.com:8080'
  req.vhost.hostname === 'foo.bar.example.com'
  req.vhost.length === 2
  req.vhost[0] === 'foo'
  req.vhost[1] === 'bar'
}))
```



## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/vhost.svg
[npm-url]: https://npmjs.org/package/vhost
[travis-image]: https://img.shields.io/travis/expressjs/vhost/master.svg
[travis-url]: https://travis-ci.org/expressjs/vhost
[coveralls-image]: https://img.shields.io/coveralls/expressjs/vhost/master.svg
[coveralls-url]: https://coveralls.io/r/expressjs/vhost
[downloads-image]: https://img.shields.io/npm/dm/vhost.svg
[downloads-url]: https://npmjs.org/package/vhost
[gratipay-image]: https://img.shields.io/gratipay/dougwilson.svg
[gratipay-url]: https://gratipay.com/dougwilson/
