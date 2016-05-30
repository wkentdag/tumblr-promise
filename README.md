# tumblr-promise
[![version](https://img.shields.io/npm/v/tumblr-promise.svg?style=flat)](https://www.npmjs.com/package/tumblr-promise)
[![Build Status](https://travis-ci.org/wkentdag/tumblr-promise.svg?branch=master)](https://travis-ci.org/wkentdag/tumblr-promise) [![Coverage Status](https://coveralls.io/repos/github/wkentdag/tumblr-promise/badge.svg?branch=master)](https://coveralls.io/github/wkentdag/tumblr-promise?branch=master) [![dependencies](http://img.shields.io/david/wkentdag/tumblr-promise.svg?style=flat)](https://david-dm.org/wkentdag/tumblr-promise)

minimal, promise-based [tumblr api](https://www.tumblr.com/docs/en/api/v2) client for node.js

> :exclamation: This project is in early development. Don't assume all features described here are functional. See this [note](http://markup.im/#q4_cRZ1Q) re: versioning

### Why?
It's true that there are [plenty](https://www.npmjs.com/package/tumblr) [of](https://www.npmjs.com/package/ntumblr) [other](https://www.npmjs.com/browse/keyword/tumblr) tumblr clients out there for node, including an [official driver](https://www.npmjs.com/package/tumblr.js). However, I wanted one that:
* doesn't require OAuth tokens to instantiate the client by default
* extends functionality of most-used apis
* isn't bloated with rarely-used apis
* exposes chainable promises rather than callbacks
* is maintained :grin:

This package is designed to be able to fetch posts using several query parameters at once while sorting and transforming the data on the fly. It is very flexible but its overall api coverage is opinionated and selective; ideally it *would* cover the entire api, so pull requests are welcome, but I don't expect it to ever have 100% coverage. If you're looking for a more generic wrapper I would recommend the official client.

### Installation
with [npm](https://www.npmjs.com/package/tumblr-promise) and node `^6.0.0`:

`npm install tumblr-promise --save`

### Authentication
Depending on the request, tumblr api endpoints require different forms of authentication. Some are unauthenticated, the bulk need an api key, and the most complex require an OAuth token. Check out the [docs](https://www.tumblr.com/docs/en/api/v2) for details and instructions for generating a token.

### Usage
The constructor requires an `api_key` since you need one to make any of the requests this library supports. `oauth_token` is an optional parameter.

```js
const Tumblr = require('tumblr-promise')

const api = Tumblr.new({
  name: 'yoursubdomain',  //  yoursubdomain.tumblr.com
  api_key: 'YOUR_CONSUMER_SECRET'
})

//  simplest invocation
let last20Posts = api.get()

//  the fun part...
api
.get(5)
.skip(10)
.filter('portfolio, case studies')  // filter by #tag
.filter(['array', 'works', 'too'])
.media('photo')
.media('video') //  multiple content types in one request!
.transform(p => { //  map function to apply to every post
  delete p.foo
  p.bar = p.baz * 2
  return p
})
.then(console.log)
.catch(console.error)
```

### Testing

To run the tests locally, you'll need to add a `test/.env` with your blog name and api key values: `cp test/.env.sample test/.env`

### License
[MIT](LICENSE.md)
