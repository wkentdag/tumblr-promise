const joi = require('joi')
const rest = require('rest')
const mime = require('rest/interceptor/mime')
const errorCode = require('rest/interceptor/errorCode')
const pathPrefix = require('rest/interceptor/pathPrefix')
const location = require('rest/interceptor/location')

/**
 * @class Tumblr
 * @classdesc This is kind of a fake class because of our proxy hackery, but it
 * behaves like one pretty much
 */
const Client = {
  /**
   * Creates a new instance of the API client
   * @constructor
   * @param {Object} opts - options object
   * @param {String} name - name of your tumblr site
   * @param {String} apiKey - api key for your tumblr site
   * @returns {Object} instance of tumblr client
   */
  new: function (_opts = {}) {
    const opts = validate(_opts)
    Object.assign(this, opts)

    const client = rest
    .wrap(mime)
    .wrap(errorCode)
    .wrap(location)
    .wrap(pathPrefix, {
      prefix: `https://api.tumblr.com/v2/blog/${opts.name}.tumblr.com/posts`
    })

    return new Proxy({
      name: opts.name,
      api_key: opts.api_key,
      content: (name) => {
        return {
          get: (opts = {api_key: this.api_key}) => {
            return client(Object.assign({ path: name }, { params: opts }))
              .then((r) => r.entity)
          }
        }
      }
    }, proxyHandler)
  }
}

/**
 * Proxies `instance.foo` to `instance.content('foo')`
 * @constant
 */
const proxyHandler = {
  get: (target, name) => { return target.content(name) }
}

/**
 * Validates the constructor's options
 * @param {Object} opts - options object
 * @param {String} opts.name - name of your tumblr site
 * @param {String} opts.api_key - API key for your tumblr site
 * @param {String} opts[.apiToken] - API token for your tumblr site
 * @returns {Object} validated options object
 */
const validate = (opts = {}) => {
  const schema = joi.object().keys({
    name: joi.string().required(),
    api_key: joi.string().regex(/^[a-zA-Z0-9]{50}$/).required(),
    apiToken: joi.string().regex(/^[a-zA-Z0-9]{50}$/)
  })

  const res = joi.validate(opts, schema)
  if (res.error) { throw new Error(res.error) }
  return res.value
}

module.exports = Client
