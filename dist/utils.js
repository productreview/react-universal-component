'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.cacheProm = exports.loadFromPromiseCache = exports.cacheExport = exports.loadFromCache = exports.callForString = exports.createElement = exports.findExport = exports.resolveExport = exports.requireById = exports.tryRequire = exports.DefaultError = exports.DefaultLoading = exports.babelInterop = exports.isWebpack = exports.isServer = exports.isTest = undefined

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var isTest = (exports.isTest = process.env.NODE_ENV === 'test')
var isServer = (exports.isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
))

var isWebpack = (exports.isWebpack = function isWebpack() {
  return typeof __webpack_require__ !== 'undefined'
})
var babelInterop = (exports.babelInterop = function babelInterop(mod) {
  return mod &&
    (typeof mod === 'undefined' ? 'undefined' : _typeof(mod)) === 'object' &&
    mod.__esModule
    ? mod.default
    : mod
})

var DefaultLoading = (exports.DefaultLoading = function DefaultLoading() {
  return _react2.default.createElement('div', null, 'Loading...')
})
var DefaultError = (exports.DefaultError = function DefaultError(_ref) {
  var error = _ref.error
  return _react2.default.createElement(
    'div',
    null,
    'Error: ',
    error && error.message
  )
})

var tryRequire = (exports.tryRequire = function tryRequire(id) {
  try {
    return requireById(id)
  } catch (err) {
    // warn if there was an error while requiring the chunk during development
    // this can sometimes lead the server to render the loading component.
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'chunk not available for synchronous require yet: ' +
          id +
          ': ' +
          err.message,
        err.stack
      )
    }
  }

  return null
})

var requireById = (exports.requireById = function requireById(id) {
  if (!isWebpack() && typeof id === 'string') {
    return module.require(id)
  }

  return __webpack_require__(id)
})

var resolveExport = (exports.resolveExport = function resolveExport(
  mod,
  key,
  onLoad,
  chunkName,
  props,
  context,
  modCache
) {
  var isSync =
    arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false

  var exp = findExport(mod, key)
  if (onLoad && mod) {
    var _isServer = typeof window === 'undefined'
    var info = { isServer: _isServer, isSync: isSync }
    onLoad(mod, info, props, context)
  }
  if (chunkName && exp) cacheExport(exp, chunkName, props, modCache)
  return exp
})

var findExport = (exports.findExport = function findExport(mod, key) {
  if (typeof key === 'function') {
    return key(mod)
  } else if (key === null) {
    return mod
  }

  return mod &&
    (typeof mod === 'undefined' ? 'undefined' : _typeof(mod)) === 'object' &&
    key
    ? mod[key]
    : babelInterop(mod)
})

var createElement = (exports.createElement = function createElement(
  Component,
  props
) {
  return _react2.default.isValidElement(Component)
    ? _react2.default.cloneElement(Component, props)
    : _react2.default.createElement(Component, props)
})

var callForString = (exports.callForString = function callForString(
  strFun,
  props
) {
  return typeof strFun === 'function' ? strFun(props) : strFun
})

var loadFromCache = (exports.loadFromCache = function loadFromCache(
  chunkName,
  props,
  modCache
) {
  return !isServer && modCache[callForString(chunkName, props)]
})

var cacheExport = (exports.cacheExport = function cacheExport(
  exp,
  chunkName,
  props,
  modCache
) {
  return (modCache[callForString(chunkName, props)] = exp)
})

var loadFromPromiseCache = (exports.loadFromPromiseCache = function loadFromPromiseCache(
  chunkName,
  props,
  promisecache
) {
  return promisecache[callForString(chunkName, props)]
})

var cacheProm = (exports.cacheProm = function cacheProm(
  pr,
  chunkName,
  props,
  promisecache
) {
  return (promisecache[callForString(chunkName, props)] = pr)
})
