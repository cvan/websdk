(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("WebSDK", [], factory);
	else if(typeof exports === 'object')
		exports["WebSDK"] = factory();
	else
		root["WebSDK"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xhr = exports.slugify = exports.getMetaTagHref = exports.getMetaTagContent = exports.getManifestFallback = exports.getExtName = exports.emit = undefined;

var _mime = __webpack_require__(4);

var _mime2 = _interopRequireDefault(_mime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emit = function emit(opts, detail) {
  if (typeof opts === 'string') {
    opts = { type: opts };
  } else {
    opts = opts || {};
    if ('title' in opts) {
      opts.type = opts.title;
      delete opts.title;
    }
    if ('name' in opts) {
      opts.type = opts.name;
      delete opts.name;
    }
  }

  opts.target = opts.target || document.body || document.documentElement;
  opts.bubbles = 'bubbles' in opts ? opts.bubbles : true;

  opts.detail = detail || opts.detail || {};

  Object.keys(opts).forEach(function (key) {
    if (key === 'detail') {
      return;
    }
    opts.detail[key] = opts[key];
  });

  if (!('bubble' in opts.detail)) {
    opts.detail.bubbles = true;
  }

  if (!('CustomEvent' in window)) {
    throw new Error('`CustomEvent` support is required');
  }

  var evt = new CustomEvent('websdk.' + opts.type, opts.detail);

  Object.keys(opts.detail).forEach(function (key) {
    if (key === 'type' || key === 'target' || key === 'bubbles') {
      return;
    }
    evt[key] = opts.detail[key];
  });

  opts.target.dispatchEvent(evt);

  return evt;
}; /* global CustomEvent, XMLHttpRequest */

var getExtName = function getExtName(filename) {
  filename = (filename || '').trim().replace(/([?#].+)$/g, '').replace(/\s/g, '');
  return filename.substring(filename.lastIndexOf('.') + 1);
};

var xhr = function xhr(url, opts) {
  if (typeof url === 'string') {
    opts = {
      url: url
    };
  }

  opts = opts || {};

  return new Promise(function (resolve, reject) {
    var extName = getExtName(opts.url);

    opts.method = 'method' in opts ? opts.method : 'get';
    opts.json = 'json' in opts ? opts.json : extName === 'json' || extName === 'webmanifest' || extName === 'manifest';

    if (!('XMLHttpRequest' in global)) {
      // throw new Error('`XMLHttpRequest` is not supported');
      resolve({});
      return;
    }

    var req = new XMLHttpRequest();

    req.open(opts.method, opts.url, 'true');

    // if (opts.json) {
    //   req.setRequestHeader('Content-Type', 'application/json');
    // }

    req.addEventListener('load', function () {
      var data = {};

      if (opts.json) {
        try {
          // NOTE: Not parsing as JSON using `XMLHttpRequest#responseType` because of incomplete browser support.
          data = JSON.parse(req.responseText || '{}');
        } catch (e) {}
      }
      resolve(data);
    });

    req.addEventListener('error', reject);

    req.send(opts.data || '');
  });
};

var getMetaTag = module.exports.getMetaTag = function (attributeName, selector, el) {
  if (!attributeName) {
    throw new Error('Expected an `attributeName` argument for `getMetaTag`');
  }

  if (typeof selector === 'string') {
    el = (el || document).querySelector(selector);
  }

  return el ? el.getAttribute(attributeName) : '';
};

var getMetaTagContent = function getMetaTagContent(selector, el) {
  return getMetaTag('content', selector, el);
};

var getMetaTagHref = function getMetaTagHref(selector, el) {
  return getMetaTag('href', selector, el);
};

var getManifestFallback = function getManifestFallback(doc) {
  if (!doc || !doc.querySelector) {
    return {};
  }

  var ogSiteName = getMetaTagContent('meta[property="og:site_name"]');
  var ogTitle = getMetaTagContent('meta[property="og:title"]');
  var ogURL = getMetaTagContent('meta[property="og:url"]');
  var ogDescription = getMetaTagContent('meta[property="og:description"]');
  var ogImage = getMetaTagContent('meta[property="og:image"]');

  var twitterSiteName = getMetaTagContent('meta[property="og:site_name"]');
  var twitterAppName = getMetaTagContent('meta[name="twitter:app:name"], ' + 'meta[name="twitter:app:name:iphone"], ' + 'meta[name="twitter:app:name:ipad"], ' + 'meta[name="twitter:app:name:googleplay"]');
  var twitterTitle = getMetaTagContent('meta[name="twitter:title"]');
  var twitterURL = getMetaTagContent('meta[name="twitter:url"]');
  var twitterDescription = getMetaTagContent('meta[property="og:description"]');
  var twitterImage = getMetaTagContent('meta[name="twitter:image"]');

  var appName = getMetaTagContent('meta[name="apple-mobile-web-app-title"], meta[name="application-name"]');
  var appDescription = getMetaTagContent('meta[name="description"]') || ogDescription || twitterDescription;
  var appStartURL = getMetaTagContent('link[rel="canonical"], meta[name="msapplication-starturl"], meta[name="start_url"]') || twitterURL || ogURL || window.location.href;
  var appThemeColor = undefined.getMetaTagContent('meta[name="theme_color"], meta[name="msapplication-TileColor"], meta[name="apple-mobile-web-app-status-bar-style"]');

  var appIcons = Array.prototype.map.call(document.querySelectorAll('link[rel~="icon"], link[rel~="favicon"], link[rel~="apple-touch-icon"]'), getMetaTagHref);

  if (ogImage) {
    appIcons.push(ogImage);
  }

  if (twitterImage) {
    appIcons.push(twitterImage);
  }

  var manifest = {};
  var insertedIcons = {};

  manifest.name = appName || ogSiteName || twitterSiteName || twitterAppName || ogTitle || twitterTitle || document.title || '';

  manifest.short_name = twitterAppName || manifest.name;

  manifest.description = ogDescription || twitterDescription || appDescription;

  manifest.start_url = appStartURL;

  if (appThemeColor) {
    manifest.theme_color = appThemeColor;
  }

  manifest.start_url = appStartURL;

  manifest.icons = [];

  appIcons.forEach(function (icon) {
    if (!icon || !icon.href || icon.href in insertedIcons) {
      return;
    }

    insertedIcons[icon.href] = true;

    manifest.icons.push({
      src: icon.href,
      sizes: icon.sizes || '',
      type: _mime2.default.lookup(icon.href)
    });
  });

  return manifest;
};

var slugify = function slugify(str) {
  return (str || '').trim().replace(/\s+/, ' ').replace(/[^a-z0-9]+/ig, '_').toLowerCase();
};

exports.emit = emit;
exports.getExtName = getExtName;
exports.getManifestFallback = getManifestFallback;
exports.getMetaTagContent = getMetaTagContent;
exports.getMetaTagHref = getMetaTagHref;
exports.slugify = slugify;
exports.xhr = xhr;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {
	"name": "websdk",
	"libraryName": "websdk",
	"productName": "WebSDK",
	"version": "0.1.0",
	"description": "The Universal SDK for Web Applications",
	"main": "dist/websdk.js",
	"license": "CC0-1.0",
	"author": "Christopher Van Wiemeersch <hearcomestreble@gmail.com>",
	"bugs": {
		"url": "https://github.com/cvan/websdk/issues"
	},
	"homepage": "https://github.com/cvan/websdk",
	"repository": {
		"type": "git",
		"url": "https://github.com/cvan/navigator-web.git"
	},
	"keywords": [
		"navigatorweb",
		"navigator-web",
		"navigator",
		"web",
		"browser",
		"webpack",
		"browserify",
		"es6",
		"es5",
		"library",
		"universal",
		"umd",
		"amd",
		"commonjs",
		"babel"
	],
	"semistandard": {
		"ignore": [
			"dist",
			"**/vendor/**"
		]
	},
	"devDependencies": {
		"babel": "^6.23.0",
		"babel-core": "^6.24.0",
		"babel-eslint": "^7.2.1",
		"babel-loader": "^6.4.1",
		"babel-plugin-add-module-exports": "^0.2.1",
		"babel-preset-es2015": "^6.24.0",
		"chai": "^3.5.0",
		"eslint": "^3.19.0",
		"eslint-loader": "^1.7.1",
		"mocha": "^3.2.0",
		"semistandard": "^10.0.0",
		"snazzy": "^6.0.0",
		"webpack": "^2.3.3",
		"webpack-dev-server": "^2.4.2",
		"yargs": "^7.0.2"
	},
	"scripts": {
		"start": "npm run dev",
		"dev": "webpack-dev-server --no-inline --progress --colors --watch --env dev",
		"pretest": "npm run build",
		"test": "mocha --compilers js:babel-core/register --colors ./test/*.spec.js",
		"pretest:watch": "npm run dist-max",
		"test:watch": "mocha --compilers js:babel-core/register --colors --watch ./test/*.spec.js",
		"build": "webpack --env dist-max",
		"lint": "semistandard -v | snazzy || true",
		"lint:fix": "semistandard -v --fix | snazzy || true",
		"dist": "npm run dist:max && npm run dist:min",
		"dist:max": "webpack --env dist-max",
		"dist:min": "webpack --env dist-min"
	}
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _package = __webpack_require__(2);

var _package2 = _interopRequireDefault(_package);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSDK = function () {
  function WebSDK(opts) {
    _classCallCheck(this, WebSDK);

    opts = opts || {};
    opts.name = opts.name || opts.appName || opts.title || opts.titleName;
    this._opts = opts;
    this._navigator = opts.navigator || global.navigator || {};
    this._window = opts.window || global.window;
    this._document = opts.document || global.document || {
      title: '',
      location: {
        href: ''
      }
    };
    this._productName = 'productName' in opts ? opts.productName : _package2.default.productName || this.name;
    this._name = opts.name || this._document.title;
    this._slug = 'slug' in opts ? opts.slug : (0, _utils.slugify)(this._name);
    this._manifest = 'manifest' in opts ? opts.manifest : null;
    this._fakeManifest = 'fakeManifest' in opts ? opts.fakeManifest : null;
    this._requireManifestTag = 'requireManifestTag' in opts ? opts.requireManifestTag : false;
    this._manifestURL = opts.manifestURL || this.manifestURL;
    this._documentURL = opts.documentURL || this._document.location.href;
    this._logWarnings = 'logWarnings' in opts ? opts.logWarnings : 'document' in global;
  }

  _createClass(WebSDK, [{
    key: 'manifestRefresh',
    value: function manifestRefresh(url, secondAttempt) {
      var self = this;

      url = url || self._manifestURL || self._documentURL;

      return self.manifestFetch(url).then(function (manifest) {
        self.manifest = manifest;
      }).catch(function (err) {
        if (self.logWarnings) {
          console.warn('Warning:', err);
        }
        self._manifest = null;
      });
    }
  }, {
    key: 'manifestFetch',
    value: function manifestFetch(url, isSecondAttempt) {
      var self = this;

      url = url || self._manifestURL || self._documentURL;

      return new Promise(function (resolve, reject) {
        return self.fetch(url).then(function (data) {
          if (!data || !Object.keys(data).length) {
            reject(new Error('Invalid manifest'));
            return;
          }

          resolve(data);
        }).catch(function (err) {
          if (isSecondAttempt) {
            resolve(self.manifestFetch('https://fetchmanifest.org/manifest?url=' + encodeURIComponent(url), true));
            return;
          }

          reject(err);
        });
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(url, opts) {
      return (0, _utils.xhr)(url, opts);
    }
  }, {
    key: 'emit',
    value: function emit(opts, detail) {
      return (0, _utils.emit)(opts, detail);
    }
  }, {
    key: 'logWarnings',
    get: function get() {
      return this._logWarnings;
    }
  }, {
    key: 'requireManifestTag',
    get: function get() {
      return this._requireManifestTag;
    },
    set: function set(value) {
      this._requireManifestTag = value;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    },
    set: function set(value) {
      if (this._name === value) {
        return;
      }
      this._name = value;
      this.emit('namechange', {
        app: this.appData,
        name: value
      });
    }
  }, {
    key: 'slug',
    get: function get() {
      return this._slug;
    },
    set: function set(value) {
      if (this._slug === value) {
        return;
      }
      this._slug = value;
      this.emit('slugchange', {
        app: this.appData,
        slug: value
      });
    }
  }, {
    key: 'productName',
    get: function get() {
      return this._productName;
    },
    set: function set(value) {
      this._productName = value;
    }
  }, {
    key: 'navigator',
    get: function get() {
      return this._navigator;
    },
    set: function set(value) {
      this._navigator = value;
    }
  }, {
    key: 'window',
    get: function get() {
      return this._window;
    },
    set: function set(value) {
      this._window = value;
    }
  }, {
    key: 'document',
    get: function get() {
      return this._document;
    },
    set: function set(value) {
      this._document = value;
    }
  }, {
    key: 'documentURL',
    get: function get() {
      return this._documentURL;
    },
    set: function set(value) {
      if (this._documentURL === value) {
        return;
      }
      this._documentURL = value;
      this.emit('documenturlchange', {
        app: this.appData,
        documentURL: value
      });
    }
  }, {
    key: 'manifestURL',
    get: function get() {
      if (this._manifestURL) {
        return this._manifestURL;
      }

      var manifestURL = '';

      if (!this._document || !this._document.querySelector) {
        return manifestURL;
      }

      var manifestEl = this._document.querySelector('link[rel~="manifest"]');

      if (this.requireManifestTag && !manifestEl) {
        throw new Error('Could not find a `link[rel~="manifest"]` tag');
      }

      if (manifestEl) {
        manifestURL = manifestEl.href;
      }

      this._manifestURL = manifestURL;

      return manifestURL;
    },
    set: function set(value) {
      if (this._manifestURL === value) {
        return;
      }
      this._manifestURL = value;
      this.emit('documenturlchange', {
        app: this.appData,
        manifestURL: value
      });
    }
  }, {
    key: 'fakeManifest',
    get: function get() {
      if (!this._fakeManifest) {
        this._fakeManifest = (0, _utils.getManifestFallback)();
      }
      return this._fakeManifest;
    },
    set: function set(value) {
      if (JSON.stringify(this._fakeManifest) === JSON.stringify(value)) {
        return;
      }
      this._fakeManifest = value;
    }
  }, {
    key: 'manifest',
    get: function get() {
      var manifest = this._manifest;

      // Asynchronously update the stored manifest.
      this.manifestRefresh(this.manifestURL);

      if (!manifest) {
        manifest = this._manifest = this.fakeManifest;
      }

      return manifest;
    },
    set: function set(manifest) {
      if (JSON.stringify(this._manifest) === JSON.stringify(manifest)) {
        return;
      }

      this.emit('manifestchange', {
        app: this.appData,
        manifest: manifest
      });

      if ('name' in manifest) {
        if (!this.name || this.name !== manifest.name) {
          this.name = manifest.name;
        }
      }
    }
  }, {
    key: 'appData',
    get: function get() {
      return {
        name: this._name,
        slug: this._slug,
        manifest: this._manifest,
        manifestURL: this._manifestURL,
        documentURL: this._documentURL
      };
    }
  }]);

  return WebSDK;
}();

exports.default = WebSDK;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lookup = undefined;

var _mime_db = __webpack_require__(5);

var _mime_db2 = _interopRequireDefault(_mime_db);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import mimeTypes from 'mime-types';
// export default mimeTypes;

var lookup = function lookup(ext) {
  ext = (0, _utils.getExtName)(ext);

  var match = '';
  var mimesDbKeys = Object.keys(_mime_db2.default);
  var mimesDbKeysLength = mimesDbKeys.length;
  var mimeType = void 0;

  for (var idx = 0; idx < mimesDbKeysLength; idx++) {
    mimeType = _mime_db2.default[mimesDbKeys[idx]];
    if (mimeType && mimeType.extensions && mimeType.extensions.indexOf(ext) > -1) {
      match = mimesDbKeys[idx];
      break;
    }
  }
  return match;
};

exports.lookup = lookup;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
	"audio/3gpp": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"3gpp"
		]
	},
	"audio/adpcm": {
		"source": "apache",
		"extensions": [
			"adp"
		]
	},
	"audio/basic": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"au",
			"snd"
		]
	},
	"audio/midi": {
		"source": "apache",
		"extensions": [
			"mid",
			"midi",
			"kar",
			"rmi"
		]
	},
	"audio/mp3": {
		"compressible": false,
		"extensions": [
			"mp3"
		]
	},
	"audio/mp4": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"m4a",
			"mp4a"
		]
	},
	"audio/mpeg": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"mpga",
			"mp2",
			"mp2a",
			"mp3",
			"m2a",
			"m3a"
		]
	},
	"audio/ogg": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"oga",
			"ogg",
			"spx"
		]
	},
	"audio/s3m": {
		"source": "apache",
		"extensions": [
			"s3m"
		]
	},
	"audio/silk": {
		"source": "apache",
		"extensions": [
			"sil"
		]
	},
	"audio/vnd.dece.audio": {
		"source": "iana",
		"extensions": [
			"uva",
			"uvva"
		]
	},
	"audio/vnd.digital-winds": {
		"source": "iana",
		"extensions": [
			"eol"
		]
	},
	"audio/vnd.dra": {
		"source": "iana",
		"extensions": [
			"dra"
		]
	},
	"audio/vnd.dts": {
		"source": "iana",
		"extensions": [
			"dts"
		]
	},
	"audio/vnd.dts.hd": {
		"source": "iana",
		"extensions": [
			"dtshd"
		]
	},
	"audio/vnd.lucent.voice": {
		"source": "iana",
		"extensions": [
			"lvp"
		]
	},
	"audio/vnd.ms-playready.media.pya": {
		"source": "iana",
		"extensions": [
			"pya"
		]
	},
	"audio/vnd.nuera.ecelp4800": {
		"source": "iana",
		"extensions": [
			"ecelp4800"
		]
	},
	"audio/vnd.nuera.ecelp7470": {
		"source": "iana",
		"extensions": [
			"ecelp7470"
		]
	},
	"audio/vnd.nuera.ecelp9600": {
		"source": "iana",
		"extensions": [
			"ecelp9600"
		]
	},
	"audio/vnd.rip": {
		"source": "iana",
		"extensions": [
			"rip"
		]
	},
	"audio/wav": {
		"compressible": false,
		"extensions": [
			"wav"
		]
	},
	"audio/wave": {
		"compressible": false,
		"extensions": [
			"wav"
		]
	},
	"audio/webm": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"weba"
		]
	},
	"audio/x-aac": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"aac"
		]
	},
	"audio/x-aiff": {
		"source": "apache",
		"extensions": [
			"aif",
			"aiff",
			"aifc"
		]
	},
	"audio/x-caf": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"caf"
		]
	},
	"audio/x-flac": {
		"source": "apache",
		"extensions": [
			"flac"
		]
	},
	"audio/x-m4a": {
		"source": "nginx",
		"extensions": [
			"m4a"
		]
	},
	"audio/x-matroska": {
		"source": "apache",
		"extensions": [
			"mka"
		]
	},
	"audio/x-mpegurl": {
		"source": "apache",
		"extensions": [
			"m3u"
		]
	},
	"audio/x-ms-wax": {
		"source": "apache",
		"extensions": [
			"wax"
		]
	},
	"audio/x-ms-wma": {
		"source": "apache",
		"extensions": [
			"wma"
		]
	},
	"audio/x-pn-realaudio": {
		"source": "apache",
		"extensions": [
			"ram",
			"ra"
		]
	},
	"audio/x-pn-realaudio-plugin": {
		"source": "apache",
		"extensions": [
			"rmp"
		]
	},
	"audio/x-realaudio": {
		"source": "nginx",
		"extensions": [
			"ra"
		]
	},
	"audio/x-wav": {
		"source": "apache",
		"extensions": [
			"wav"
		]
	},
	"audio/xm": {
		"source": "apache",
		"extensions": [
			"xm"
		]
	},
	"image/apng": {
		"compressible": false,
		"extensions": [
			"apng"
		]
	},
	"image/bmp": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"bmp"
		]
	},
	"image/cgm": {
		"source": "iana",
		"extensions": [
			"cgm"
		]
	},
	"image/g3fax": {
		"source": "iana",
		"extensions": [
			"g3"
		]
	},
	"image/gif": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"gif"
		]
	},
	"image/ief": {
		"source": "iana",
		"extensions": [
			"ief"
		]
	},
	"image/jpeg": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"jpeg",
			"jpg",
			"jpe"
		]
	},
	"image/ktx": {
		"source": "iana",
		"extensions": [
			"ktx"
		]
	},
	"image/png": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"png"
		]
	},
	"image/prs.btif": {
		"source": "iana",
		"extensions": [
			"btif"
		]
	},
	"image/sgi": {
		"source": "apache",
		"extensions": [
			"sgi"
		]
	},
	"image/svg+xml": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"svg",
			"svgz"
		]
	},
	"image/tiff": {
		"source": "iana",
		"compressible": false,
		"extensions": [
			"tiff",
			"tif"
		]
	},
	"image/vnd.adobe.photoshop": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"psd"
		]
	},
	"image/vnd.dece.graphic": {
		"source": "iana",
		"extensions": [
			"uvi",
			"uvvi",
			"uvg",
			"uvvg"
		]
	},
	"image/vnd.djvu": {
		"source": "iana",
		"extensions": [
			"djvu",
			"djv"
		]
	},
	"image/vnd.dvb.subtitle": {
		"source": "iana",
		"extensions": [
			"sub"
		]
	},
	"image/vnd.dwg": {
		"source": "iana",
		"extensions": [
			"dwg"
		]
	},
	"image/vnd.dxf": {
		"source": "iana",
		"extensions": [
			"dxf"
		]
	},
	"image/vnd.fastbidsheet": {
		"source": "iana",
		"extensions": [
			"fbs"
		]
	},
	"image/vnd.fpx": {
		"source": "iana",
		"extensions": [
			"fpx"
		]
	},
	"image/vnd.fst": {
		"source": "iana",
		"extensions": [
			"fst"
		]
	},
	"image/vnd.fujixerox.edmics-mmr": {
		"source": "iana",
		"extensions": [
			"mmr"
		]
	},
	"image/vnd.fujixerox.edmics-rlc": {
		"source": "iana",
		"extensions": [
			"rlc"
		]
	},
	"image/vnd.ms-modi": {
		"source": "iana",
		"extensions": [
			"mdi"
		]
	},
	"image/vnd.ms-photo": {
		"source": "apache",
		"extensions": [
			"wdp"
		]
	},
	"image/vnd.net-fpx": {
		"source": "iana",
		"extensions": [
			"npx"
		]
	},
	"image/vnd.wap.wbmp": {
		"source": "iana",
		"extensions": [
			"wbmp"
		]
	},
	"image/vnd.xiff": {
		"source": "iana",
		"extensions": [
			"xif"
		]
	},
	"image/webp": {
		"source": "apache",
		"extensions": [
			"webp"
		]
	},
	"image/x-3ds": {
		"source": "apache",
		"extensions": [
			"3ds"
		]
	},
	"image/x-cmu-raster": {
		"source": "apache",
		"extensions": [
			"ras"
		]
	},
	"image/x-cmx": {
		"source": "apache",
		"extensions": [
			"cmx"
		]
	},
	"image/x-freehand": {
		"source": "apache",
		"extensions": [
			"fh",
			"fhc",
			"fh4",
			"fh5",
			"fh7"
		]
	},
	"image/x-icon": {
		"source": "apache",
		"compressible": true,
		"extensions": [
			"ico"
		]
	},
	"image/x-jng": {
		"source": "nginx",
		"extensions": [
			"jng"
		]
	},
	"image/x-mrsid-image": {
		"source": "apache",
		"extensions": [
			"sid"
		]
	},
	"image/x-ms-bmp": {
		"source": "nginx",
		"compressible": true,
		"extensions": [
			"bmp"
		]
	},
	"image/x-pcx": {
		"source": "apache",
		"extensions": [
			"pcx"
		]
	},
	"image/x-pict": {
		"source": "apache",
		"extensions": [
			"pic",
			"pct"
		]
	},
	"image/x-portable-anymap": {
		"source": "apache",
		"extensions": [
			"pnm"
		]
	},
	"image/x-portable-bitmap": {
		"source": "apache",
		"extensions": [
			"pbm"
		]
	},
	"image/x-portable-graymap": {
		"source": "apache",
		"extensions": [
			"pgm"
		]
	},
	"image/x-portable-pixmap": {
		"source": "apache",
		"extensions": [
			"ppm"
		]
	},
	"image/x-rgb": {
		"source": "apache",
		"extensions": [
			"rgb"
		]
	},
	"image/x-tga": {
		"source": "apache",
		"extensions": [
			"tga"
		]
	},
	"image/x-xbitmap": {
		"source": "apache",
		"extensions": [
			"xbm"
		]
	},
	"image/x-xpixmap": {
		"source": "apache",
		"extensions": [
			"xpm"
		]
	},
	"image/x-xwindowdump": {
		"source": "apache",
		"extensions": [
			"xwd"
		]
	},
	"video/3gpp": {
		"source": "apache",
		"extensions": [
			"3gp",
			"3gpp"
		]
	},
	"video/3gpp2": {
		"source": "apache",
		"extensions": [
			"3g2"
		]
	},
	"video/h261": {
		"source": "apache",
		"extensions": [
			"h261"
		]
	},
	"video/h263": {
		"source": "apache",
		"extensions": [
			"h263"
		]
	},
	"video/h264": {
		"source": "apache",
		"extensions": [
			"h264"
		]
	},
	"video/jpeg": {
		"source": "apache",
		"extensions": [
			"jpgv"
		]
	},
	"video/jpm": {
		"source": "apache",
		"extensions": [
			"jpm",
			"jpgm"
		]
	},
	"video/mj2": {
		"source": "apache",
		"extensions": [
			"mj2",
			"mjp2"
		]
	},
	"video/mp2t": {
		"source": "apache",
		"extensions": [
			"ts"
		]
	},
	"video/mp4": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"mp4",
			"mp4v",
			"mpg4"
		]
	},
	"video/mpeg": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"mpeg",
			"mpg",
			"mpe",
			"m1v",
			"m2v"
		]
	},
	"video/ogg": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"ogv"
		]
	},
	"video/quicktime": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"qt",
			"mov"
		]
	},
	"video/vnd.dece.hd": {
		"source": "apache",
		"extensions": [
			"uvh",
			"uvvh"
		]
	},
	"video/vnd.dece.mobile": {
		"source": "apache",
		"extensions": [
			"uvm",
			"uvvm"
		]
	},
	"video/vnd.dece.pd": {
		"source": "apache",
		"extensions": [
			"uvp",
			"uvvp"
		]
	},
	"video/vnd.dece.sd": {
		"source": "apache",
		"extensions": [
			"uvs",
			"uvvs"
		]
	},
	"video/vnd.dece.video": {
		"source": "apache",
		"extensions": [
			"uvv",
			"uvvv"
		]
	},
	"video/vnd.dvb.file": {
		"source": "apache",
		"extensions": [
			"dvb"
		]
	},
	"video/vnd.fvt": {
		"source": "apache",
		"extensions": [
			"fvt"
		]
	},
	"video/vnd.mpegurl": {
		"source": "apache",
		"extensions": [
			"mxu",
			"m4u"
		]
	},
	"video/vnd.ms-playready.media.pyv": {
		"source": "apache",
		"extensions": [
			"pyv"
		]
	},
	"video/vnd.uvvu.mp4": {
		"source": "apache",
		"extensions": [
			"uvu",
			"uvvu"
		]
	},
	"video/vnd.vivo": {
		"source": "apache",
		"extensions": [
			"viv"
		]
	},
	"video/webm": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"webm"
		]
	},
	"video/x-f4v": {
		"source": "apache",
		"extensions": [
			"f4v"
		]
	},
	"video/x-fli": {
		"source": "apache",
		"extensions": [
			"fli"
		]
	},
	"video/x-flv": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"flv"
		]
	},
	"video/x-m4v": {
		"source": "apache",
		"extensions": [
			"m4v"
		]
	},
	"video/x-matroska": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"mkv",
			"mk3d",
			"mks"
		]
	},
	"video/x-mng": {
		"source": "apache",
		"extensions": [
			"mng"
		]
	},
	"video/x-ms-asf": {
		"source": "apache",
		"extensions": [
			"asf",
			"asx"
		]
	},
	"video/x-ms-vob": {
		"source": "apache",
		"extensions": [
			"vob"
		]
	},
	"video/x-ms-wm": {
		"source": "apache",
		"extensions": [
			"wm"
		]
	},
	"video/x-ms-wmv": {
		"source": "apache",
		"compressible": false,
		"extensions": [
			"wmv"
		]
	},
	"video/x-ms-wmx": {
		"source": "apache",
		"extensions": [
			"wmx"
		]
	},
	"video/x-ms-wvx": {
		"source": "apache",
		"extensions": [
			"wvx"
		]
	},
	"video/x-msvideo": {
		"source": "apache",
		"extensions": [
			"avi"
		]
	},
	"video/x-sgi-movie": {
		"source": "apache",
		"extensions": [
			"movie"
		]
	},
	"video/x-smv": {
		"source": "apache",
		"extensions": [
			"smv"
		]
	},
	"model/gltf+json": {
		"source": "iana",
		"compressible": true,
		"extensions": [
			"gltf"
		]
	},
	"application/manifest+json": {
		"charset": "UTF-8",
		"compressible": true,
		"extensions": [
			"webmanifest"
		]
	},
	"application/json": {
		"source": "iana",
		"charset": "UTF-8",
		"compressible": true,
		"extensions": [
			"json",
			"map"
		]
	},
	"application/javascript": {
		"source": "iana",
		"charset": "UTF-8",
		"compressible": true,
		"extensions": [
			"js"
		]
	}
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=websdk.js.map