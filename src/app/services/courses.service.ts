import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import OrderByDirection = firebase.firestore.OrderByDirection;

import { Course } from '../model/course';
import { Observable, from } from 'rxjs';
import { convertSnaps } from './db-utils';
import { Lesson } from '../model/lesson';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFirestore) { }

  loadAllCourses(): Observable<Course[]> {
    return this.db.collection('courses', ref => ref
      .orderBy('seqNo')
    )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          return convertSnaps<Course>(snaps)
        }),
        first()
      );
  }

  findCourseByUrl(courseUrl: string): Observable<Course> {
    return this.db.collection('courses', ref => ref
      .where('url', '==', courseUrl)
    )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          const courses = convertSnaps<Course>(snaps)
          return courses.length == 1 ? courses[0] : undefined
        }),
        first() // Important for routing to complete
      );
  }

  findLessons(courseId: string, sortOrder: OrderByDirection = 'asc', pageNumber = 0, pageSize = 3): Observable<Lesson[]> {
    return this.db.collection(`courses/${courseId}/lessons`, ref => ref
    .orderBy('seqNo', sortOrder)
    .limit(pageSize)
    .startAfter(pageNumber * pageSize)
    )
    .snapshotChanges()
    .pipe(
      map(snaps => convertSnaps<Lesson>(snaps)),
      first()
    )
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    // turn promise into an observable using the rxjs from method
    return from(this.db.doc(`courses/${courseId}`).update(changes));
  }
}
