import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Course } from '../model/course';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  courses$: Observable<Course[]>;

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private db: AngularFirestore) {

  }

  ngOnInit() {

    this.courses$ = this.db.collection('courses').snapshotChanges()
      .pipe(
        map(snaps => {
          return snaps.map(snap => {
            return <Course>{
              id: snap.payload.doc.id,
              ...snap.payload.doc.data()
            }
          })
        })
      );

    this.beginnerCourses$ = this.courses$
      .pipe(
        map(courses => courses.filter(course => course.categories.includes("BEGINNER")))
      );

    this.advancedCourses$ = this.courses$
      .pipe(
        map(courses => courses.filter(course => course.categories.includes("ADVANCED")))
      )

  }

}
