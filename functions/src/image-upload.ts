import * as functions from 'firebase-functions';
import { db } from './init';
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const os = require('os');
const mkdirp = require('mkdirp-promise');
const spawn = require('child-process-promise').spawn;
const rimraf = require('rimraf');

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

    /**
     * The upload file back to google cloud storage (the thumbnail generated using image magic) 
     * will accidentally trigger another execution of our firebase cloud function, so we will 
     * enter an infinite loop where we are constantly applying image magic to the output of the 
     * previous execution. In order to prevent that, we are going to do an early exist of our 
     * processing; in our case when the file corresponds to a thumbnail, we can check that if 
     * the file starts with 'thumb_'.
     */
    if (!contentType.startsWith('image/') || fileName.startsWith('thumb_')) {
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

    // Generate a thumbnail using ImageMagick

    const outputFilePath = path.join(fileDir, 'thumb_' + fileName);
    const outputFile = path.join(os.tmpdir(), outputFilePath);
    console.log('Generating a thumbnail to:', outputFile);

    /**
     * The spawn service is going allow us to invoke commands from the command line using a 
     * promise based API. For example:
     * `convert -thumbnail 510X287 serverless-angular.png > thumb_serverless-angular.png`
     * So, spawn is going to get us back a promise that when resolved means that the command 
     * finished successfully, so let’s call await for the processing to be completed. The
     * spawn also allow us to get access directly to the output of the command. For that we 
     * would pass in here an extra configuration object where we will define what we want to
     * capture from the command line execution. So, we can capture for example the 'stdout'
     * (standard output of the command) and the 'stderr' (standard error of the command).
     */
    await spawn('convert', [tempLocalFile, '-thumbnail', '510X287 >', outputFile], {
      capture: ['stdout', 'stderr']
    });

    /**
     * Upload the Thumbnail Back to storage. For that, the first thing we need to do is to 
     * define the metadata of the uploaded file.
     */
    const metadata = {
      contentType: object.contentType,
      cacheControl: 'public,max-age=2592000, s-maxage=2592000'
    }
    console.log('Uploading the thumbnail to storage:', outputFile, outputFilePath);
    const uploadedFiles = await bucket.upload(outputFile, { destination: outputFilePath, metadata })

    /**
     * Delete the file that we created locally in order to prevent the file system from filling
     * up over time. What we want to do essentially is execute the Unix command `rm -rf localtmpdir`.
     * In order to execute this command, we need to install rimraf
     */
    rimraf.sync(tempLocalDir);

    /**
     * Delete the file that was originally uploaded by the user
     */
    await orginalImageFile.delete();

    /**
     * We are also going to create a download link to our thumbnail file. 
     */
    const thumbnail = uploadedFiles[0];
    const url = await thumbnail.getSignedUrl({action: 'read', expires: new Date(3000, 0, 1)});
    console.log('Generated signed url:', url);

    /**
     * We are going then to save that download link in the database.
     */
    const frags = fileFullPath.split('/');
    const courseId = frags[1];
    console.log('saving url to database: ' + courseId);
    return db.doc(`courses/${courseId}`).update({uploadedImageUrl: url})
  })