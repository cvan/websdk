/* global CustomEvent, XMLHttpRequest */

import mime from './mime.js';

const emit = function (opts, detail) {
  if (typeof opts === 'string') {
    opts = {type: opts};
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

  let evt = new CustomEvent('websdk.' + opts.type, opts.detail);

  Object.keys(opts.detail).forEach(function (key) {
    if (key === 'type' || key === 'target' || key === 'bubbles') {
      return;
    }
    evt[key] = opts.detail[key];
  });

  opts.target.dispatchEvent(evt);

  return evt;
};

const getExtName = filename => {
  filename = (filename || '')
    .trim()
    .replace(/([?#].+)$/g, '')
    .replace(/\s/g, '');
  return filename.substring(filename.lastIndexOf('.') + 1);
};

const xhr = (url, opts) => {
  if (typeof url === 'string') {
    opts = {
      url: url
    };
  }

  opts = opts || {};

  return new Promise(function (resolve, reject) {
    let extName = getExtName(opts.url);

    opts.method = 'method' in opts ? opts.method : 'get';
    opts.json = 'json' in opts ? opts.json : (
      extName === 'json' ||
      extName === 'webmanifest' ||
      extName === 'manifest'
    );

    if (!('XMLHttpRequest' in global)) {
      // throw new Error('`XMLHttpRequest` is not supported');
      resolve({});
      return;
    }

    const req = new XMLHttpRequest();

    req.open(opts.method, opts.url, 'true');

    // if (opts.json) {
    //   req.setRequestHeader('Content-Type', 'application/json');
    // }

    req.addEventListener('load', function () {
      let data = {};

      if (opts.json) {
        try {
          // NOTE: Not parsing as JSON using `XMLHttpRequest#responseType` because of incomplete browser support.
          data = JSON.parse(req.responseText || '{}');
        } catch (e) {
        }
      }
      resolve(data);
    });

    req.addEventListener('error', reject);

    req.send(opts.data || '');
  });
};

const getMetaTag = module.exports.getMetaTag = (attributeName, selector, el) => {
  if (!attributeName) {
    throw new Error('Expected an `attributeName` argument for `getMetaTag`');
  }

  if (typeof selector === 'string') {
    el = (el || document).querySelector(selector);
  }

  return el ? el.getAttribute(attributeName) : '';
};

const getMetaTagContent = (selector, el) => {
  return getMetaTag('content', selector, el);
};

const getMetaTagHref = (selector, el) => {
  return getMetaTag('href', selector, el);
};

const getManifestFallback = (doc) => {
  if (!doc || !doc.querySelector) {
    return {};
  }

  const ogSiteName = getMetaTagContent('meta[property="og:site_name"]');
  const ogTitle = getMetaTagContent('meta[property="og:title"]');
  const ogURL = getMetaTagContent('meta[property="og:url"]');
  const ogDescription = getMetaTagContent('meta[property="og:description"]');
  const ogImage = getMetaTagContent('meta[property="og:image"]');

  const twitterSiteName = getMetaTagContent('meta[property="og:site_name"]');
  const twitterAppName = getMetaTagContent('meta[name="twitter:app:name"], ' +
    'meta[name="twitter:app:name:iphone"], ' +
    'meta[name="twitter:app:name:ipad"], ' +
    'meta[name="twitter:app:name:googleplay"]');
  const twitterTitle = getMetaTagContent('meta[name="twitter:title"]');
  const twitterURL = getMetaTagContent('meta[name="twitter:url"]');
  const twitterDescription = getMetaTagContent('meta[property="og:description"]');
  const twitterImage = getMetaTagContent('meta[name="twitter:image"]');

  const appName = getMetaTagContent('meta[name="apple-mobile-web-app-title"], meta[name="application-name"]');
  const appDescription = getMetaTagContent('meta[name="description"]') || ogDescription || twitterDescription;
  const appStartURL = getMetaTagContent('link[rel="canonical"], meta[name="msapplication-starturl"], meta[name="start_url"]') || twitterURL || ogURL || window.location.href;
  const appThemeColor = this.getMetaTagContent('meta[name="theme_color"], meta[name="msapplication-TileColor"], meta[name="apple-mobile-web-app-status-bar-style"]');

  let appIcons = Array.prototype.map.call(document.querySelectorAll('link[rel~="icon"], link[rel~="favicon"], link[rel~="apple-touch-icon"]'), getMetaTagHref);

  if (ogImage) {
    appIcons.push(ogImage);
  }

  if (twitterImage) {
    appIcons.push(twitterImage);
  }

  let manifest = {};
  let insertedIcons = {};

  manifest.name = appName || ogSiteName || twitterSiteName || twitterAppName || ogTitle || twitterTitle || document.title || '';

  manifest.short_name = twitterAppName || manifest.name;

  manifest.description = ogDescription || twitterDescription || appDescription;

  manifest.start_url = appStartURL;

  if (appThemeColor) {
    manifest.theme_color = appThemeColor;
  }

  manifest.start_url = appStartURL;

  manifest.icons = [];

  appIcons.forEach(icon => {
    if (!icon || !icon.href || icon.href in insertedIcons) {
      return;
    }

    insertedIcons[icon.href] = true;

    manifest.icons.push({
      src: icon.href,
      sizes: icon.sizes || '',
      type: mime.lookup(icon.href)
    });
  });

  return manifest;
};

const slugify = function (str) {
  return (str || '')
    .trim()
    .replace(/\s+/, ' ')
    .replace(/[^a-z0-9]+/ig, '_')
    .toLowerCase();
};

export {
  emit,
  getExtName,
  getManifestFallback,
  getMetaTagContent,
  getMetaTagHref,
  slugify,
  xhr
};
