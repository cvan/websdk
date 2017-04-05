// import mimeTypes from 'mime-types';
// export default mimeTypes;

import mimeDb from './mime_db.json';
import { getExtName } from './utils.js';

const lookup = ext => {
  ext = getExtName(ext);

  let match = '';
  let mimesDbKeys = Object.keys(mimeDb);
  let mimesDbKeysLength = mimesDbKeys.length;
  let mimeType;

  for (let idx = 0; idx < mimesDbKeysLength; idx++) {
    mimeType = mimeDb[mimesDbKeys[idx]];
    if (mimeType &&
        mimeType.extensions &&
        mimeType.extensions.indexOf(ext) > -1) {
      match = mimesDbKeys[idx];
      break;
    }
  }
  return match;
};

export {
  lookup
};
