import * as functions from 'firebase-functions';
import { db } from './init';

// This type of database trigger callback functions can’t be tested locally. So, they need to be deployed to production.
export const onAddLesson = functions.firestore.document('courses/{courseId}/lessons/{lessonId}')
  .onCreate(
    /**
     * The body of our data base trigger. So, our trigger is going to be a function that 
     * takes two arguments. 1st: is the document snapshot of the document getting created 
     * on this path 'courses/{courseId}/lessons/{lessonId}'. 2nd: is a context variable 
     * which is going to allow us to retrieve the value of the path variables if we needed.
     */
    async (snap, context) => {

      // const courseId = context.params.courseId;

      console.log("Running onAddLesson trigger ...");

      /**
       * Read our course from the database and we need to increment the lessonsCount. However,
       * we should do this in a transactional way (the value of the trigger cannot be modified
       * while our database trigger is getting executed).
       */
      return db.runTransaction(
        /**
         * Inside the transaction body, we can read the course and modify the counter. We are going to
         * use async await
         */
        async transaction => {
          // Obtain a reference to our course document at the lesson document level 'courses/{courseId}/lessons/{lessonId}' 
          const courseRef = snap.ref.parent.parent;
          // receiving the course snapshot in a transactional way
          const courseSnap = await transaction.get(courseRef);
          // retrieve the course data itself
          const course = courseSnap.data();
          // create a changes object continuing the modifications that we want to do to the course object
          const changes = { lessonsCount: course.lessonsCount + 1 };
          // apply the changes to the database using the transaction.update method.
          transaction.update(courseRef, changes);
        });
    }
  );

/**
 * We are expected to return the transaction promise so that the engine that is calling the
 * trigger function knows if the function executed successfully and when the execution
 * is completed. We also need to give back an indication in case something has failed.
 *
 * notice that in other types of triggers where we don't have a transactional requirement like we
 * here in the case of incrementing a counter, we don't have to create a transaction just for
 * returning a value to onCreate. We can return any promise that returns any value to the
 * trigger engine and that value could be a transaction object or not.
 */
