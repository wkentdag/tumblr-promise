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

    this._req = {}
    this._request = rest
    .wrap(mime)
    .wrap(errorCode)
    .wrap(location)
    .wrap(defaultRequest, {
      params: {api_key: this.api_key}
    })
    .wrap(pathPrefix, {
      prefix: `https://api.tumblr.com/v2/blog/${this.name}.tumblr.com/posts`
    })
  }

  fetch () {
    // TODO: perform transforms
    // TODO: perform parallel requests if needed
    return new Promise((resolve, reject) => {
      this._request({
        params: this._req
      }).then(r => {
        delete this._req
        return resolve(r.entity)
      })
      .catch(reject)
    })
  }

  limit (req) {
    this._req.limit = (i < 20) ? i : 20
    return this
  }

  skip (i) {
    this._req.offset = i
    return this
  }

  tag (s) {
    this._req.tag = s
    return this
  }

  transform (f) {
    this._req.transform = f
    return this
  }

  type (s) {
    let valid = s.match(/^text|photo|quote|link|chat|audio|video|answer$/)
    if (valid) this._req.type = s
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
    if (res.error) throw new Error(res.error)
    return res.value
  }
}
