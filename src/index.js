import packageJson from '../package.json';
import { emit, getManifestFallback, slugify, xhr } from './lib/utils.js';

export default class WebSDK {
  constructor (opts) {
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
    this._productName = 'productName' in opts ? opts.productName : (packageJson.productName || this.name);
    this._name = opts.name || this._document.title;
    this._slug = 'slug' in opts ? opts.slug : slugify(this._name);
    this._manifest = 'manifest' in opts ? opts.manifest : null;
    this._fakeManifest = 'fakeManifest' in opts ? opts.fakeManifest : null;
    this._requireManifestTag = 'requireManifestTag' in opts ? opts.requireManifestTag : false;
    this._manifestURL = opts.manifestURL || this.manifestURL;
    this._documentURL = opts.documentURL || this._document.location.href;
    this._logWarnings = 'logWarnings' in opts ? opts.logWarnings : ('document' in global);
  }

  get logWarnings () {
    return this._logWarnings;
  }

  get requireManifestTag () {
    return this._requireManifestTag;
  }

  set requireManifestTag (value) {
    this._requireManifestTag = value;
  }

  get name () {
    return this._name;
  }

  set name (value) {
    if (this._name === value) {
      return;
    }
    this._name = value;
    this.emit('namechange', {
      app: this.appData,
      name: value
    });
  }

  get slug () {
    return this._slug;
  }

  set slug (value) {
    if (this._slug === value) {
      return;
    }
    this._slug = value;
    this.emit('slugchange', {
      app: this.appData,
      slug: value
    });
  }

  get productName () {
    return this._productName;
  }

  set productName (value) {
    this._productName = value;
  }

  get navigator () {
    return this._navigator;
  }

  set navigator (value) {
    this._navigator = value;
  }

  get window () {
    return this._window;
  }

  set window (value) {
    this._window = value;
  }

  get document () {
    return this._document;
  }

  set document (value) {
    this._document = value;
  }

  get documentURL () {
    return this._documentURL;
  }

  set documentURL (value) {
    if (this._documentURL === value) {
      return;
    }
    this._documentURL = value;
    this.emit('documenturlchange', {
      app: this.appData,
      documentURL: value
    });
  }

  get manifestURL () {
    if (this._manifestURL) {
      return this._manifestURL;
    }

    let manifestURL = '';

    if (!this._document || !this._document.querySelector) {
      return manifestURL;
    }

    const manifestEl = this._document.querySelector('link[rel~="manifest"]');

    if (this.requireManifestTag && !manifestEl) {
      throw new Error('Could not find a `link[rel~="manifest"]` tag');
    }

    if (manifestEl) {
      manifestURL = manifestEl.href;
    }

    this._manifestURL = manifestURL;

    return manifestURL;
  }

  set manifestURL (value) {
    if (this._manifestURL === value) {
      return;
    }
    this._manifestURL = value;
    this.emit('documenturlchange', {
      app: this.appData,
      manifestURL: value
    });
  }

  get fakeManifest () {
    if (!this._fakeManifest) {
      this._fakeManifest = getManifestFallback();
    }
    return this._fakeManifest;
  }

  set fakeManifest (value) {
    if (JSON.stringify(this._fakeManifest) === JSON.stringify(value)) {
      return;
    }
    this._fakeManifest = value;
  }

  get manifest () {
    var manifest = this._manifest;

    // Asynchronously update the stored manifest.
    this.manifestRefresh(this.manifestURL);

    if (!manifest) {
      manifest = this._manifest = this.fakeManifest;
    }

    return manifest;
  }

  set manifest (manifest) {
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

  get appData () {
    return {
      name: this._name,
      slug: this._slug,
      manifest: this._manifest,
      manifestURL: this._manifestURL,
      documentURL: this._documentURL
    };
  }

  manifestRefresh (url, secondAttempt) {
    const self = this;

    url = url || self._manifestURL || self._documentURL;

    return self.manifestFetch(url)
      .then(function (manifest) {
        self.manifest = manifest;
      })
      .catch(function (err) {
        if (self.logWarnings) {
          console.warn('Warning:', err);
        }
        self._manifest = null;
      });
  }

  manifestFetch (url, isSecondAttempt) {
    const self = this;

    url = url || self._manifestURL || self._documentURL;

    return new Promise(function (resolve, reject) {
      return self.fetch(url)
        .then(function (data) {
          if (!data || !Object.keys(data).length) {
            reject(new Error('Invalid manifest'));
            return;
          }

          resolve(data);
        })
        .catch(function (err) {
          if (isSecondAttempt) {
            resolve(self.manifestFetch(`https://fetchmanifest.org/manifest?url=${encodeURIComponent(url)}`, true));
            return;
          }

          reject(err);
        });
    });
  }

  fetch (url, opts) {
    return xhr(url, opts);
  }

  emit (opts, detail) {
    return emit(opts, detail);
  }
}
