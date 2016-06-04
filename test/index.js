require('dotenv').config({silent: true})

const test = require('ava')
const Tumblr = require('..')
const KEY = process.env.CONSUMER_KEY
const badKey = `foo${KEY}`

const api = new Tumblr({
  name: 'tpromise-test',
  api_key: process.env.CONSUMER_KEY
})

test('errors with incorrect options', (t) => {
  t.throws(
    () => { new Tumblr() }, // eslint-disable-line
    'ValidationError: child "name" fails because ["name" is required]'
  )

  t.throws(
    () => { new Tumblr({ name: 'foo' }) }, // eslint-disable-line
    'ValidationError: child "api_key" fails because ["api_key" is required]'
  )

  t.throws(
    () => { new Tumblr({ name: 'foo', api_key: badKey }) }, // eslint-disable-line
    `ValidationError: child "api_key" fails because ["api_key" with value "${badKey}" fails to match the required pattern: /^[a-zA-Z0-9]{50}$/]`
  )
})

test('initializes with correct options', (t) => {
  const api = new Tumblr({ name: 'foo', api_key: KEY })
  t.truthy(api)
})

test('gets data when valid data is provided', (t) => {
  return api.fetch().then(res =>
    t.truthy(res.meta.status === 200)
  )
})

test('chains parameters', (t) => {
  return api.type('photo').tag('bar').fetch().then(res => {
    t.truthy(res.meta.status === 200)
    t.truthy(res.response.posts[0].tags.includes('bar'))
    t.truthy(res.response.posts[0].type === 'photo')
  })
})

test('ignores bad type params', (t) => {
  return api.type('badkind').fetch().then(res =>
    t.truthy(res.response.posts[0].type === 'photo')
  )
})
