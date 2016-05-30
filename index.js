const joi = require('joi')
const rest = require('rest')
const mime = require('rest/interceptor/mime')
const errorCode = require('rest/interceptor/errorCode')
const defaultRequest = require('rest/interceptor/defaultRequest')
const pathPrefix = require('rest/interceptor/pathPrefix')
const location = require('rest/interceptor/location')

/**
 * @class Tumblr
 */
module.exports = class Tumblr {
  /**
   * Creates a new instance of the API client
   * @constructor
   * @param {Object} opts - options object
   * @param {String} opts.name - name of your tumblr site
   * @param {String} opts.api_key - api key
   * @param {String} opts[.api_token] - oauth token
   * @returns {Object} instance of tumblr client
   */
  constructor (_opts = {}) {
    const opts = this._validate(_opts)
    Object.assign(this, opts)

    this._req_opts = {
      tag: [],
      type: ['photo']
    }
    this.request = rest
    .wrap(mime)
    .wrap(errorCode)
    .wrap(location)
    .wrap(defaultRequest, {
      params: {api_key: this.api_key}
    })
    .wrap(pathPrefix, {
      prefix: `https://api.tumblr.com/v2/blog/${opts.name}.tumblr.com/posts`
    })
  }

  fetch () {
    // TODO:
    // process the options, perform parallel requests and transforms if needed
    // this._req_opts = {}
    return this.request(`/${this._req_opts.type[0]}`).then(r => r.entity)
  }

  limit (i) {
    this._req_opts.limit = (i < 20) ? i : 20
    return this
  }

  skip (i) {
    this._req_opts.offset = i
    return this
  }

  tag (s) {
    this._req_opts.tag.push(s)
    return this
  }

  transform (f) {
    this._req_opts.transform = f
    return this
  }

  type (s) {
    this._req_opts.type.push(s)
    return this
  }

  /**
   * Validates the constructor's options
   * @param {Object} opts - options object
   * @param {String} opts.name - name of your tumblr site
   * @param {String} opts.api_key - API key for your tumblr site
   * @param {String} opts[.api_token] - API token for your tumblr site
   * @returns {Object} validated options object
   */
  _validate (opts = {}) {
    const schema = joi.object().keys({
      name: joi.string().required(),
      api_key: joi.string().regex(/^[a-zA-Z0-9]{50}$/).required(),
      api_token: joi.string().regex(/^[a-zA-Z0-9]{50}$/)
    })

    const res = joi.validate(opts, schema)
    if (res.error) { throw new Error(res.error) }
    return res.value
  }
}
