import * as functions from 'firebase-functions';
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const os = require('os');
const mkdirp = require('mkdirp-promise');

const gcs = new Storage();

export const resizeThumbnail = functions.storage.object()
  .onFinalize(async (object, context) => {
    const fileFullPath = object.name || '';
    const contentType = object.contentType || '';
    const fileDir = path.dirname(fileFullPath);
    const fileName = path.basename(fileFullPath);

    /**
     * Get the name for the global temporary directory of the file system and add a
     * sub directory which corresponds to the file directory path. So, we are going to 
     * end up with a sub directory under the general operating system temporary directory
     * that is going to have the same path as the file.
     */
    const tempLocalDir = path.join(os.tmpdir(), fileDir);

    console.log('Thumbnail generation started: ', fileFullPath, fileDir, fileName);

    if (!contentType.startsWith('image/')) {
      console.log('Exiting image processing');
      return null;
    }

    /**
     * In order to create a local directory, we are going to be using mkdirp-promise command.
     * So, what mkdirp-promise is going to create all the directories that we need recursively.
     * So, If fileDir contains multiple folders, these sub folders are going to be created 
     * one at a time 
     */
    await mkdirp(tempLocalDir);

    /**
     * In order to perform the download, we need a reference to the bucket where the file 
     * is present. So, let's define a bucket variable and initialize it using bucket API of
     * our storage service and pass to it the bucket associated to the object.
     */
    const bucket = gcs.bucket(object.bucket)

    /**
     * using the bucket constant, we now can get a reference to the original image file, that
     * the user has uploaded.
     */
    const orginalImageFile = bucket.file(fileFullPath);
    // to perform the download, we need an output file name, so define a const tempLocalFile
    const tempLocalFile = path.join(os.tmpdir(), fileFullPath);
    console.log('Downloading image to: ', tempLocalFile);
    // Now, perform the download (use await in order to trigger the download and wait for its completion).
    await orginalImageFile.download({ destination: tempLocalFile })

    return null;
  })