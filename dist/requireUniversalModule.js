'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.clearChunks = exports.flushModuleIds = exports.flushChunkNames = exports.MODULE_IDS = exports.CHUNK_NAMES = undefined
exports.default = requireUniversalModule

var _utils = require('./utils')

var CHUNK_NAMES = (exports.CHUNK_NAMES = new Set())
var MODULE_IDS = (exports.MODULE_IDS = new Set())

function requireUniversalModule(universalConfig, options, props, prevProps) {
  var key = options.key,
    _options$timeout = options.timeout,
    timeout = _options$timeout === undefined ? 15000 : _options$timeout,
    onLoad = options.onLoad,
    onError = options.onError,
    isDynamic = options.isDynamic,
    modCache = options.modCache,
    promCache = options.promCache,
    usesBabelPlugin = options.usesBabelPlugin,
    debug = options.debug

  var config = getConfig(isDynamic, universalConfig, options, props)
  var chunkName = config.chunkName,
    path = config.path,
    resolve = config.resolve,
    load = config.load

  var asyncOnly = (!path && !resolve) || typeof chunkName === 'function'

  var requireSync = function requireSync(props, context) {
    var debugVars = {
      universalConfig: universalConfig,
      options: options,
      config: config,
      props: props,
      prevProps: prevProps
    }
    var exp = (0, _utils.loadFromCache)(chunkName, props, modCache)

    if (!exp && debug) {
      console.warn('[requireSync] Module is not in cache', debugVars)
    }

    if (!exp) {
      var mod = void 0

      if (!(0, _utils.isWebpack)() && path) {
        var modulePath = (0, _utils.callForString)(path, props) || ''
        mod = (0, _utils.tryRequire)(modulePath)

        if (!mod && debug) {
          console.warn(
            '[requireSync] tryRequire with modulePath failed',
            { modulePath: modulePath },
            debugVars
          )
        }
      } else if ((0, _utils.isWebpack)() && resolve) {
        var weakId = (0, _utils.callForString)(resolve, props)

        if (__webpack_modules__[weakId]) {
          mod = (0, _utils.tryRequire)(weakId)
        }

        if (!mod && debug) {
          console.warn(
            '[requireSync] tryRequire with weakId failed',
            { weakId: weakId },
            debugVars
          )
        }
      }

      if (mod) {
        exp = (0, _utils.resolveExport)(
          mod,
          key,
          onLoad,
          chunkName,
          props,
          context,
          modCache,
          true
        )

        if (!exp && debug) {
          console.warn('[requireSync] resolveExport failed', debugVars)
        }
      }
    }

    return exp
  }

  var requireAsync = function requireAsync(props, context) {
    var debugVars = {
      props: props,
      context: context,
      options: options,
      config: config
    }
    var exp = (0, _utils.loadFromCache)(chunkName, props, modCache)

    if (exp) {
      if (debug) {
        console.warn('[requireAsync] Loaded from cache', exp, debugVars)
      }

      return Promise.resolve(exp)
    }

    var cachedPromise = (0, _utils.loadFromPromiseCache)(
      chunkName,
      props,
      promCache
    )

    if (cachedPromise) {
      if (debug) {
        console.warn('[requireAsync] Loaded from promise cache', debugVars)
      }

      return cachedPromise
    }

    var prom = new Promise(function(res, rej) {
      var reject = function reject(error) {
        if (debug) {
          console.warn('[requireAsync] Failed to load module', error, debugVars)
        }

        error = error || new Error('timeout exceeded')
        clearTimeout(timer)
        if (onError) {
          var _isServer = typeof window === 'undefined'
          var info = { isServer: _isServer }
          onError(error, info)
        }
        rej(error)
      }

      // const timer = timeout && setTimeout(reject, timeout)
      var timer = timeout && setTimeout(reject, timeout)

      var resolve = function resolve(mod) {
        clearTimeout(timer)

        var exp = (0, _utils.resolveExport)(
          mod,
          key,
          onLoad,
          chunkName,
          props,
          context,
          modCache
        )

        if (exp) {
          if (debug) {
            console.warn(
              '[requireAsync] Export resolved successfully',
              exp,
              debugVars
            )
          }

          return res(exp)
        }

        reject(new Error('export not found'))
      }

      var request = load(props, { resolve: resolve, reject: reject })

      // if load doesn't return a promise, it must call resolveImport
      // itself. Most common is the promise implementation below.
      if (!request || typeof request.then !== 'function') return
      request.then(resolve).catch(reject)
    })

    ;(0, _utils.cacheProm)(prom, chunkName, props, promCache)
    return prom
  }

  var addModule = function addModule(props) {
    if (_utils.isServer || _utils.isTest) {
      if (chunkName) {
        var name = (0, _utils.callForString)(chunkName, props)
        if (usesBabelPlugin) {
          name = name.replace(/\//g, '-')
        }
        if (name) CHUNK_NAMES.add(name)
        if (!_utils.isTest) return name // makes tests way smaller to run both kinds
      }

      if ((0, _utils.isWebpack)()) {
        var weakId = (0, _utils.callForString)(resolve, props)
        if (weakId) MODULE_IDS.add(weakId)
        return weakId
      }

      if (!(0, _utils.isWebpack)()) {
        var modulePath = (0, _utils.callForString)(path, props)
        if (modulePath) MODULE_IDS.add(modulePath)
        return modulePath
      }
    }
  }

  var shouldUpdate = function shouldUpdate(next, prev) {
    var cacheKey = (0, _utils.callForString)(chunkName, next)

    var config = getConfig(isDynamic, universalConfig, options, prev)
    var prevCacheKey = (0, _utils.callForString)(config.chunkName, prev)

    return cacheKey !== prevCacheKey
  }

  return {
    requireSync: requireSync,
    requireAsync: requireAsync,
    addModule: addModule,
    shouldUpdate: shouldUpdate,
    asyncOnly: asyncOnly
  }
}

var flushChunkNames = (exports.flushChunkNames = function flushChunkNames() {
  var chunks = Array.from(CHUNK_NAMES)
  CHUNK_NAMES.clear()
  return chunks
})

var flushModuleIds = (exports.flushModuleIds = function flushModuleIds() {
  var ids = Array.from(MODULE_IDS)
  MODULE_IDS.clear()
  return ids
})

var clearChunks = (exports.clearChunks = function clearChunks() {
  CHUNK_NAMES.clear()
  MODULE_IDS.clear()
})

var getConfig = function getConfig(isDynamic, universalConfig, options, props) {
  if (isDynamic) {
    return typeof universalConfig === 'function'
      ? universalConfig(props)
      : universalConfig
  }

  var load =
    typeof universalConfig === 'function'
      ? universalConfig // $FlowIssue
      : function() {
          return universalConfig
        }

  return {
    file: 'default',
    id: options.id || 'default',
    chunkName: options.chunkName || 'default',
    resolve: options.resolve || '',
    path: options.path || '',
    load: load
  }
}