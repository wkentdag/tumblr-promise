require('dotenv').config({silent: true})

const test = require('ava')
const Tumblr = require('..')
const KEY = process.env.CONSUMER_KEY
const badKey = `foo${KEY}`

const api = Tumblr.new({
  name: process.env.NAME,
  api_key: process.env.CONSUMER_KEY
})

test('errors with incorrect options', (t) => {
  t.throws(
    () => { Tumblr.new() }, // eslint-disable-line
    'ValidationError: child "name" fails because ["name" is required]'
  )

  t.throws(
    () => { Tumblr.new({ name: 'foo' }) }, // eslint-disable-line
    'ValidationError: child "api_key" fails because ["api_key" is required]'
  )

  t.throws(
    () => { Tumblr.new({ name: 'foo', api_key: badKey }) }, // eslint-disable-line
    `ValidationError: child "api_key" fails because ["api_key" with value "${badKey}" fails to match the required pattern: /^[a-zA-Z0-9]{50}$/]`
  )
})

test('initializes with correct options', (t) => {
  const api = Tumblr.new({ name: 'foo', api_key: KEY })
  t.truthy(api)
})

test('gets data when valid data is provided', (t) => {
  return api.photo.get().then(res =>
    t.truthy(res.meta.status === 200)
  )
})
