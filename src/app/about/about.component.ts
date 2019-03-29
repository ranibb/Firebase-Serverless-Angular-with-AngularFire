import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Course } from '../model/course';

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

}