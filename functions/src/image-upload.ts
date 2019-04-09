import * as functions from 'firebase-functions';
const path = require('path');

export const resizeThumbnail = functions.storage.object()
  .onFinalize(async (object, context) => {
    const fileFullPath = object.name || '';
    const contentType = object.contentType || '';
    const fileDir = path.dirname(fileFullPath);
    const fileName = path.basename(fileFullPath);

    console.log('Thumbnail generation started: ', fileFullPath, fileDir, fileName);

    if (contentType.startsWith('image/')) {
      return null;
    }

    return null;
  })