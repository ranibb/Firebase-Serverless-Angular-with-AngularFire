import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CoursesService } from '../services/courses.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { last, concatMap } from 'rxjs/operators';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

  form: FormGroup;
  description: string;
  course: Course;
  uploadPercent$: Observable<number>;
  downloadUrl$: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesService,
    private storage: AngularFireStorage) {

    this.course = course;

    const titles = course.titles;

    this.form = fb.group({
      description: [titles.description, Validators.required],
      longDescription: [titles.longDescription, Validators.required]
    });

  }

  uploadFile(event) {

    // Get a reference of the uploaded file from the event (Access the array of uploaded files).
    const file: File = event.target.files[0];

    // Define it's ditination target path.
    const filePath = `courses/${this.course.id}/${file.name}`;

    // Trigger the upload using the AngularFireStorage service .
    const task = this.storage.upload(filePath, file);
    task.snapshotChanges().subscribe(console.log);

    this.uploadPercent$ = task.percentageChanges();

    /** 
     * To make sure that we get the correct download URL, we need to wait for the upload 
     * process to complete.
    */
    this.downloadUrl$ = task.snapshotChanges()
      .pipe(
        /**
         * // To make sure that this observable has completed, let's pipe it with last operator. 
         * So, the last operator is going to subscribe to the snapshotChanges observable and 
         * its going to wait for it to complete before proceeding with the observable chain. 
         * So, after the last observable we are going to want to generate a download URL.
         */
        last(),
        /**
         * Now that we have the last value emitted by the upload task observable, we want to 
         * switch from it into the getDownloadURL() observable. So, in order to change from 
         * observable to a new observable, we are going to use a higher order mapping operator.
         */
        concatMap(
          /**
           * So, in response to the latest value emitted by that observable, we will be 
           * generating the download URL using the storage service.
           */
          () => this.storage.ref(filePath).getDownloadURL()
          )
        );

    this.downloadUrl$.subscribe(console.log)
  }

  ngOnInit() {

  }

  save() {

    const changes = this.form.value;

    this.coursesService.saveCourse(this.course.id, { titles: changes })
      .subscribe(
        () => this.dialogRef.close(this.form.value) // we are passing a value in case of clicking the save button
      );

  }

  close() {
    this.dialogRef.close(); // we are not passing a value in case of clicking the close button
  }

}