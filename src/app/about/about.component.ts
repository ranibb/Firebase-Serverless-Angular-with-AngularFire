import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/firestore'

const config = {
  apiKey: "AIzaSyD0-sMPDsuukbQ2V5UQjcjNbqZlliVq54g",
  authDomain: "serverless-angular-angularfire.firebaseapp.com",
  databaseURL: "https://serverless-angular-angularfire.firebaseio.com",
  projectId: "serverless-angular-angularfire",
  storageBucket: "serverless-angular-angularfire.appspot.com",
  messagingSenderId: "422661974860"
};

firebase.initializeApp(config);

const db = firebase.firestore()

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    db.doc('courses/1VfptzJnTyFB4gtc3uJg')
    .get()
    .then(snap => console.log(snap.data()));
  }

}