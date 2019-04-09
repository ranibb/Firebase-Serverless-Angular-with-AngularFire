import * as functions from 'firebase-functions';
import { db } from './init';

import * as express from 'express';
const cors = require('cors');

const app = express();

app.use(cors({ origin: true }));

app.get('/courses', async (request, response) => {

  const snaps = await db.collection('courses').get();

  const courses: any[] = [];

  snaps.forEach(snap => courses.push(snap.data()));

  response.status(200).json({ courses });

});

/**
 * In order to deploy the above express route as a firebase cloud fucntion, 
 * we simply need to export. We are going to declare a constant getCourses(the name of firebase cloud function)
 * as being the implementation of http cloud function.
 */
export const getCourses = functions.https.onRequest(app);

// In order to deploy the onAddLesson as a firebase cloud function, we simply need to export it.
export { onAddLesson } from './lessons-counter';

export { onDeleteLesson } from './lessons-counter';