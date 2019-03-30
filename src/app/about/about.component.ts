import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Course } from '../model/course';
import { of } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    // this.db.collection('courses').valueChanges().subscribe(val => console.log(val));

    // this.db.collection('courses').snapshotChanges().subscribe(snaps => {
    //   // console.log(snaps);
    //   const courses: Course[] = snaps.map(snap => {
    //     return<Course> {
    //       id: snap.payload.doc.id,
    //       ...snap.payload.doc.data()
    //     }
    //   })
    //   console.log(courses);
    // });

    // this.db.collection('courses').stateChanges().subscribe(snaps => {
    //   console.log(snaps);
    //   const courses: Course[] = snaps.map(snap => {
    //     return <Course>{
    //       id: snap.payload.doc.id,
    //       ...snap.payload.doc.data()
    //     }
    //   })
    //   console.log(courses);
    // });

  }

  save() {
    // Two references for 2 separate documents in the database
    const ngrxCourseRef = this.db.doc('/courses/HUuuelP47ekawzSBmC8e').ref;
    const angularMaterialCourseRef = this.db.doc('/courses/LBe3cFvAU5DtMDELY5eJ').ref;

    // Perform a batched write that is going to modify these 2 documents in one single atomic transaction
    const bacth = this.db.firestore.batch();
    bacth.update(ngrxCourseRef, { titles: { description: 'NgRx Course' } });
    bacth.update(angularMaterialCourseRef, { titles: { description: 'Angular Material Course' } });

    // bacth.commit(); // Gets us back a promise

    const batch$ = of(bacth.commit()); // convert it into a promise using the of operator
    batch$.subscribe() // call subscribe to trigger the batch commit
  }

  /**
   * Running a transaction to read the data ensures that while the method is running on the 
   * client side that no concurrent process is going to modify this data on the database.
   */
  async runTransaction() {
    const newCounter = await this.db.firestore.runTransaction(async transaction => {

      console.log('Running transaction...');

      const courseRef = this.db.doc('/courses/eIGGTNyQvZBRUfXXr9dE').ref;

      // While reading the data, create a read lock!
      const snap = await transaction.get(courseRef);
      const course = <Course>snap.data();

      // Doing a write operation while we are in the transaction..
      const lessonsCount = course.lessonsCount + 1;
      transaction.update(courseRef, { lessonsCount: lessonsCount })

      // get back the new value
      return lessonsCount;

    });
    console.log('result lessons count = ', newCounter);
    
  }

}