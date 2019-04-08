# Firebase - Serverless Angular With AngularFire

Design and build Angular applications using a Serverless Architecture by leveraging the whole Firebase ecosystem: this includes the Firestore NoSQL DataStore database, Firebase Security Rules, Firebase Hosting, Firebase Storage and Firebase Cloud Functions.

**Objectives**
* Serverless Architecture Design
* NoSql Database (Firestore)
* Serverless Angular development with AngularFire
* Serverless File Upload with Firebase Storage
* a full drop-in Authentication solution: Firebase UI and Firebase Authentication
* Secure client-side data modification operations with Firestore Security Rules
* High performance, free SSL hosting with Firebase Hosting
* Image processing with Firebase Cloud Functions
* Database Triggers with Firebase Cloud Functions
* REST endpoints with Firebase Cloud Functions

**Table of Contents**

* Introduction to NoSQL data modeling
* Documents vs Collections
* Firestore Unique Identifiers
* Querying a database using the Firebase SDK
* Angular Service Layer Design with AngularFire
* Offline support
* Pagination
* Indexes, Composite Indexes
* Data Modification with AngularFire
* Transactions
* Multi-path Updates
* Authentication with Firebase Authentication
* Securing Database access with Firebase Security Rules
* Production Deployment with Firebase Hosting
* Image file upload with Firebase Storage
* Firebase Storage Rules
* Server-side image processing with Firebase Cloud Functions
* Denormalization is normal - supporting multiple data views
* Firebase Could Functions HTTP endpoints

**Notes:**

Adding a couple of firebase capabilities to our project, the ability to deploy firestore indexes & firestore security rules:

1. Make sure the that Firebase Command Line Development tools is installed.

```
npm install -g firebase-tools
```

2. Firebase login

```
firebase login
```

3. Initialize our project and proceed with the option: Firestore: Deploy rules and create indexes for Firestore. Then, select the project you want to associate. 

```
firebase init
```

4. Notice the files that were created in the root. You can see that the security rules are now part of our code base just like the rest of the application. Also, you can see in the indexes file the compound index that our application needs to run. These set of security rules and indexes is going to be uploaded with each firebase deploy of our project.

```
firebase deploy
```

**Adding firebase cloud functions to our project:**

* In the terminal run the command `firebase init` and select the option `Functions: Configure and deploy Cloud Functions`

*  An hello world example of a cloud function in the functions/index.ts file: An HTTP event and the API for responding to this type of events is very similar to building an express route handler in node.js

```TypeScript
export const helloWorld = functions.https.onRequest((request, response) => {
  response.status(200).json({ message: 'Hello World' });
});
```

* To build our firebase cloud function locally, cd to the functions folder and run the following command: `npm run build`

* The above command will call the TypeScript compiler tsc and according to configuration of the complier in the functions/package.json will generate a lib folder which will contain the output of our firebase cloud function build.

* Deploy our cloud function by running the following command: `firebase deploy` which is going to deploy everything along the way.

**Firebase Cloud Functions Local Emulator and Production Deployment**

From within the functions folder, run the following commands:
```
npm run build
npm run serve 
```
`npm run serve` builds the project and call firebase serve which is going to startup a local server. Now we have a URL to the function end point locally.

*notice we need to use the full URL end point + '/courses' in order to trigger this route handler*

After testing our firebase cloud function, then we are ready to deploy it to production:
```
firebase deploy --only functions
```

If we need to troubleshot our deployment, we can do so using the Views logs options available at the level of firebase dashboard. Also, we can obtain the same logs locally in the command line by running the following command inside the functions folder
```
firebase functions:log
```
